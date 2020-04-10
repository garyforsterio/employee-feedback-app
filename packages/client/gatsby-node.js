// Implement the Gatsby API “onCreatePage”.
// called after every page is created.
/** @type {import('gatsby').GatsbyNode['onCreatePage']} */
exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions;
  //   Main page is utilzing client side routes
  if (page.path === '/') {
    page.matchPath = '/*';
    createPage(page);
  }
};
