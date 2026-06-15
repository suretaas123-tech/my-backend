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

    // ARTICLES
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

    const uniqueArticles = [
      ...new Map(
        articles.map(item => [item.documentId, item])
      ).values()
    ];

    const formattedArticles = uniqueArticles.map(article => ({
      ...article,
      featuredImage: article.featuredImage
        ? {
            url: article.featuredImage.url
          }
        : null
    }));

    // EVENTS
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
        },
        populate: {
          featuredImage: true
        }
      });

    const uniqueEvents = [
      ...new Map(
        events.map(item => [item.documentId, item])
      ).values()
    ];

    const formattedEvents = uniqueEvents.map(event => ({
      ...event,
      featuredImage: event.featuredImage
        ? {
            url: event.featuredImage.url
          }
        : null
    }));

    return {
      totalArticles: formattedArticles.length,
      totalEvents: formattedEvents.length,
      articles: formattedArticles,
      events: formattedEvents
    };
  }
};