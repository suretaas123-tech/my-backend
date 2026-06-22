'use strict';

module.exports = {
  async globalSearch(ctx) {
    const { q } = ctx.query;

    if (!q) {
      return {
        totalArticles: 0,
        totalEvents: 0,
        articles: [],
        events: [],
      };
    }

    const articles = await strapi.db.query('api::article.article').findMany({
      where: {
        publishedAt: {
          $notNull: true,
        },
        title: {
          $containsi: q,
        },
      },
      populate: {
        featuredImage: true,
        category: true,
        author: true,
        tags: true,
        events: true,
      },
    });

    const events = await strapi.db.query('api::event.event').findMany({
      where: {
        publishedAt: {
          $notNull: true,
        },
        title: {
          $containsi: q,
        },
      },
      populate: {
        featuredImage: true,
      },
    });

    return {
      totalArticles: articles.length,
      totalEvents: events.length,
      articles,
      events,
    };
  },
};