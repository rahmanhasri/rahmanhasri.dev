// const { Client } = require("@notionhq/client");
import { Client } from '@notionhq/client';
require('dotenv').config();

console.log(
  "NOTION_ROOT_PAGE_ID: ",
  JSON.stringify(process.env.NOTION_ROOT_PAGE_ID, null, 2)
);
// Initializing a client
const notionClient = new Client({
  auth: process.env.NOTION_TOKEN,
});
