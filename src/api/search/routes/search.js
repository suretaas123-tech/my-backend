'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/search',
      handler: 'search.globalSearch',
      config: {
        auth: false,
      },
    },
  ],
};