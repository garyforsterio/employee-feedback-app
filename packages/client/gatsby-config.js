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
    // TODO: setup error reporting step
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
