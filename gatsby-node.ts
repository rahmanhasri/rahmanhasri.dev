// import { CreateNodeArgs, CreatePagesArgs } from 'gatsby';
// import path from 'path';
// import { createFilePath } from 'gatsby-source-filesystem';

// type Post = {
//   title: string,
//   slug: string,
// }

// exports.onCreateNode = ({ node, getNode, actions }: CreateNodeArgs) => {
//   const { createNodeField } = actions
//   if (node.internal.type === `MarkdownRemark`) {
//     const slug = createFilePath({ node, getNode, basePath: `pages` })
//     createNodeField({
//       node,
//       name: `slug`,
//       value: slug,
//     })
//   }
// }

// exports.createPages = async ({ graphql, actions }: CreatePagesArgs) => {
//   const { createPage } = actions
//   const result = await graphql(`
//     query {
//       allMarkdownRemark(
//         filter: { fileAbsolutePath: { regex: "/content/blog/" } }
//       ) {
//         edges {
//           node {
//             fields {
//               slug
//             }
//             frontmatter {
//               title
//             }
//           }
//         }
//       }
//     }
//   `)

//   const posts = (result.data as any)?.allMarkdownRemark?.edges || [];

//   posts.forEach(({ node }, index) => {
//     let previousPost: Post | any;
//     if (index < posts.length - 1) {
//       const postIndex = index + 1
//       const previousNode = posts[postIndex].node

//       previousPost = {
//         title: previousNode.frontmatter.title,
//         slug: previousNode.fields.slug,
//       }
//     }

//     let nextPost: Post | any;
//     if (index > 0) {
//       const postIndex = index - 1
//       const nextNode = posts[postIndex].node
//       nextPost = {
//         title: nextNode.frontmatter.title,
//         slug: nextNode.fields.slug,
//       }
//     }

//     createPage({
//       path: `/blog${node.fields.slug}`,
//       component: path.resolve(`./src/templates/blog-post.js`),
//       context: {
//         slug: node.fields.slug,
//         previousPost,
//         nextPost,
//       },
//     })
//   })
// }