import path from 'path';
import { GatsbyConfig } from 'gatsby';

// @ts-check
/**
 * @type {import('gatsby').GatsbyConfig}
 */

const config: GatsbyConfig = {
  siteMetadata: {
    title: 'rahmanhasri',
    siteUrl: 'https://www.yourdomain.tld',
  },
  plugins: [
    'gatsby-plugin-image',
    'gatsby-plugin-sharp',
    'gatsby-plugin-root-import',
    'gatsby-transformer-remark',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'blog-posts',
        path: path.join(__dirname, 'content', 'blog'),
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'pages',
        path: path.join(__dirname, 'src', 'pages'),
      },
    },
  ],
};

module.exports = config;
