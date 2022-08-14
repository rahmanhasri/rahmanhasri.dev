import { Client } from '@notionhq/client';
import {
  PageObjectResponse,
  ListBlockChildrenResponse,
  ChildPageBlockObjectResponse,
  GetBlockResponse,
  ParagraphBlockObjectResponse,
  Heading2BlockObjectResponse,
  Heading3BlockObjectResponse,
  BulletedListItemBlockObjectResponse,
  CodeBlockObjectResponse,
  VideoBlockObjectResponse,
  ImageBlockObjectResponse,
  DividerBlockObjectResponse,
  Heading1BlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';
import dotenv from 'dotenv';
import path from 'path';
import slugify from 'slugify';
import fs from 'fs';
import rimraf from 'rimraf';
import fetch from 'node-fetch';
import crypto from 'crypto';
dotenv.config();

// Initializing a client
console.log('NOTION_TOKEN:', process.env.NOTION_TOKEN);
const notionClient = new Client({
  auth: process.env.NOTION_TOKEN,
});

interface MarkdownPages {
  [slug: string]: string
}

const markdownPages: MarkdownPages = {};

const DEST_PATH = path.normalize(path.join(__dirname, '..', 'content', 'blog'));

enum NOTION_CONST {
  BLOCK_OBJECT = 'block',
  CHILD_PAGE_TYPE = 'child_page',
  PARAGRAPH_TYPE = 'paragraph',
  HEADING_1_TYPE = 'heading_1',
  HEADING_2_TYPE = 'heading_2',
  HEADING_3_TYPE = 'heading_3',
  BULLET_LIST_TYPE = 'bulleted_list_item',
  CODE_TYPE = 'code',
  VIDEO_TYPE = 'video',
  IMAGE_TYPE = 'image',
  DIVIDER_TYPE = 'divider',
}

function toTextString(text: Array<any>): string {
  return text.reduce((result, textItem) => {
    if (textItem.type !== 'text') {
      console.error(`=================> not a 'text' type: ${textItem.type}`)
      process.exit(1)
    }

    if (textItem.text.link !== null) {
      return `${result}[${textItem.text.content}](${textItem.text.link.url})`;
    }

    if (textItem.annotations.code === true) {
      return `${result}\`${textItem.text.content}\``
    }

    return `${result}${textItem.text.content}`
  }, '');
}

class NotionProcessor {
  private readonly REGEX_META = /^== *(\w+) *:* (.+) *$/;
  public metas: string[] = [];
  public text: string = '';

  async start(pageContent: ListBlockChildrenResponse) {
    let wasBulletedList = false;

    const listBlock: Array<GetBlockResponse> = pageContent.results;
    for (const block of listBlock) {
      if (wasBulletedList && (block as any).type !== 'bulleted_list_item') {
        wasBulletedList = false;
        this.text = this.text + '\n'
      }

      if (block.object !== NOTION_CONST.BLOCK_OBJECT) {
        return;
      }

      if ((block as ChildPageBlockObjectResponse).type === NOTION_CONST.CHILD_PAGE_TYPE) {
        this.text = this.text + await this.generateChildPage(block as ChildPageBlockObjectResponse);
      } else if ((block as ParagraphBlockObjectResponse).type === NOTION_CONST.PARAGRAPH_TYPE) {
        this.text = this.text + this.generateParagraphText(block);
      } else if ((block as Heading1BlockObjectResponse).type === NOTION_CONST.HEADING_1_TYPE) {
        this.text = this.text + this.generateHeadingText(block);
      } else if ((block as Heading2BlockObjectResponse).type === NOTION_CONST.HEADING_2_TYPE) {
        this.text = this.text + this.generateHeadingText(block);
      } else if ((block as Heading3BlockObjectResponse).type === NOTION_CONST.HEADING_3_TYPE) {
        this.text = this.text + this.generateHeadingText(block);
      } else if ((block as BulletedListItemBlockObjectResponse).type === NOTION_CONST.BULLET_LIST_TYPE) {
        wasBulletedList = true;
        this.text = this.text + `* ${toTextString((block as any).bulleted_list_item.text)}\n`;
      } else if ((block as any).type === NOTION_CONST.CODE_TYPE) {
        const codeBlock = block as CodeBlockObjectResponse;
        this.text = this.text + `\`\`\`${codeBlock.code.language}\n${toTextString(codeBlock.code.rich_text)}\n\`\`\`\n\n`;
      } else if((block as VideoBlockObjectResponse).type === NOTION_CONST.VIDEO_TYPE) {
        this.text = this.text + `\`video: ${(block as any).video.external.url}\`\n\n`;
      } else if ((block as ImageBlockObjectResponse).type === NOTION_CONST.IMAGE_TYPE) {
        const image_name = await NotionProcessor.downloadFile((block as any).image.file.url, DEST_PATH);
        if (image_name) {
          this.text = this.text + `![${image_name}](${image_name})\n\n`;
        }
      } else if ((block as DividerBlockObjectResponse).type === NOTION_CONST.DIVIDER_TYPE) {
        this.text = this.text + '---\n';
      } else {
        console.error('===> Unhandled block: ', JSON.stringify(block, null, 2));
      }
    }
  }

  private async generateChildPage(block: ChildPageBlockObjectResponse): Promise<string> {
    const subpageSlug = await NotionProcessor.convertNotionToMarkdown(
      block.id,
      false,
    );

    if (!subpageSlug) {
      return '';
    }

    return `[${block.child_page.title}](/blog/${subpageSlug})\n\n`;
  }

  private generateParagraphText(block: any): string {
    // Empty block.
    if (!block.paragraph.rich_text.length) {
      return '\n\n';
    }

    // Meta
    const match = block.paragraph.rich_text[0].text.content.match(this.REGEX_META);
    if (match !== null) {
      this.metas.push(`${match[1]}: '${match[2]}'`)
      return '';
    }

    return `${toTextString(block.paragraph.rich_text)}\n\n`;
  }

  private generateHeadingText(block: any): string {
    if (block.heading_1?.rich_text?.length) {
      return `# ${toTextString(block.heading_1.rich_text)}\n\n`;
    } else if (block.heading_2?.rich_text?.length) {
      return `## ${toTextString(block.heading_2.rich_text)}\n\n`;
    } else if (block.heading_3?.rich_text?.length) {
      return `### ${toTextString(block.heading_3.rich_text)}\n\n`;
    }

    return '';
  }

  public static async downloadFile(url: string, destinationFolder: string): Promise<string> {
    console.log(`-> Downloading ${url}`);

    const response = await fetch(url);
    const contentType: string[] | undefined = response?.headers?.get('content-type')?.split('/');
    if (contentType) {
      const ext: string = contentType[contentType.length - 1];
      const buffer = await response.buffer();
      const hash = crypto.createHash('sha1').update(buffer).digest('hex');
      const fileName = `${hash}.${ext}`;
      const filePath = path.join(destinationFolder, fileName);
      await fs.promises.writeFile(filePath, buffer);

      return fileName;
    }

    return '';
  }

  // recursive converter if the page has child pages
  public static async convertNotionToMarkdown(
    pageId: string | undefined,
    isParent: boolean,
  ): Promise<string> {
    if (!pageId) {
      return '';
    }

    const pageProps = await notionClient.pages.retrieve({
      page_id: pageId,
    });
    const pageBlocks = await notionClient.blocks.retrieve({ block_id: pageId });
    const pageContent = await notionClient.blocks.children.list({
      block_id: pageId,
    });

    const pageTitle = (pageBlocks as ChildPageBlockObjectResponse).child_page.title;
    const slug = slugify(pageTitle, { lower: true, remove: /[*+~.,()'"!:@]/g })
    const blogMetas: string[] = [];

    // Handle Frontmatter
    blogMetas.push(`title: '${pageTitle}'`);

    // Download The Cover
    if ((pageProps as PageObjectResponse).cover !== null && (pageProps as PageObjectResponse).cover?.type === "external") {
      const pageCoverUrl = (pageProps as any).cover?.external?.url
      const coverImageName = await NotionProcessor.downloadFile(pageCoverUrl, DEST_PATH);
      blogMetas.push(`featured: '${coverImageName}'`)
    }

    // Process Block
    const contentProcessor = new NotionProcessor();
    await contentProcessor.start(pageContent);
    blogMetas.concat(contentProcessor.metas);
    const metaText = '---\n' + blogMetas.join('\n') + '\n---\n';
    const output = metaText + contentProcessor.text;
    console.log('-> blogMetas', blogMetas)

    if (!isParent) {
      markdownPages[slug] = output
      console.log(`=> Imported Notion Database`);
    }
    return slug;
  }
}

async function init(): Promise<void> {
  console.log(`-> Cleaning the '${DEST_PATH} folder`)
  rimraf.sync(DEST_PATH)
  fs.mkdirSync(DEST_PATH, { recursive: true });

  console.log(
    'NOTION_ROOT_PAGE_ID: ',
    JSON.stringify(process.env.NOTION_ROOT_PAGE_ID, null, 2)
  );

  await NotionProcessor.convertNotionToMarkdown(process.env.NOTION_ROOT_PAGE_ID, true);

  await Promise.all(
    Object.entries(markdownPages).map(async ([slug, markdown]) => {
      const filename = `${slug}.md`;
      const filepath = path.join(DEST_PATH, filename);
      await fs.promises.writeFile(filepath, markdown);
    })
  );

  console.log(`Imported ${Object.keys(markdownPages).length} pages`);
}

init();
