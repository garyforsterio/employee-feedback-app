/**
 * Load config
 */
const dotenv = require('dotenv');

dotenv.config({
  path: `.env`,
});

module.exports = {
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: ``,
        short_name: ``,
        start_url: `/`,
        background_color: `#3f51b5`,
        theme_color: `#3f51b5`,
        display: `minimal-ui`,
        icon: `src/images/icon.svg`,
      },
    },
    'gatsby-plugin-typescript',
    'gatsby-plugin-offline',
    {
      resolve: 'gatsby-plugin-alias-imports',
      options: {
        alias: {
          '@/components': 'src/components',
          '@hooks': 'src/hooks',
          '@images': 'src/images',
          '@services': 'src/services',
        },
      },
    },
    // Report errors to sentry
    // TODO: next step
    // {
    //   resolve: 'gatsby-plugin-sentry',
    //   options: {
    //     dsn: process.env.GATSBY_SENTRY_DSN,
    //     environment: process.env.GATSBY_ENV,
    //     release: process.env.GATSBY_VERSION,
    //     whitelistUrls: [/https:\/\/[a-z-]*.?pretiaar\.com/],
    //   },
    // },
  ],
};
