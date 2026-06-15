'use strict';

module.exports = {
  async globalSearch(ctx) {
    const { q } = ctx.query;

    if (!q) {
      return {
        totalArticles: 0,
        totalEvents: 0,
        articles: [],
        events: []
      };
    }

    // SEARCH ARTICLES
    const articles = await strapi.db
      .query('api::article.article')
      .findMany({
        where: {
          publishedAt: {
            $notNull: true
          },
          title: {
            $containsi: q
          }
        },
        populate: {
          featuredImage: true,
          category: true,
          author: true,
          tags: true,
          events: true
        }
      });

    // REMOVE DUPLICATE ARTICLES
    const uniqueArticles = [
      ...new Map(
        articles.map(item => [item.documentId, item])
      ).values()
    ];

    // SEARCH EVENTS
    const events = await strapi.db
      .query('api::event.event')
      .findMany({
        where: {
          publishedAt: {
            $notNull: true
          },
          title: {
            $containsi: q
          }
        }
      });

    // REMOVE DUPLICATE EVENTS
    const uniqueEvents = [
      ...new Map(
        events.map(item => [item.documentId, item])
      ).values()
    ];

    return {
      totalArticles: uniqueArticles.length,
      totalEvents: uniqueEvents.length,
      articles: uniqueArticles,
      events: uniqueEvents
    };
  }
};