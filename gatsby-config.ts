import path from 'path';

// @ts-check
/**
 * @type {import('gatsby').GatsbyConfig}
 */

const config = {
  siteMetadata: {
    title: 'rahmanhasri',
    siteUrl: 'https://www.yourdomain.tld',
  },
  plugins: [
    {
      resolve: `gatsby-plugin-typescript`,
      options: {
        isTSX: true,
        jsxPragma: `jsx`,
        allExtensions: true,
      },
    },
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: path.join(__dirname, 'src', 'utils', 'typography'),
      },
    },
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
    'gatsby-plugin-image',
    'gatsby-plugin-sharp',
    'gatsby-transformer-remark',
  ],
};

module.exports = config;
