'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

// Convert rich text → plain text
function extractText(blocks) {

  // Already plain string
  if (typeof blocks === 'string') {
    return blocks;
  }

  // Invalid value
  if (!Array.isArray(blocks)) {
    return null;
  }

  return blocks
    .map(block =>
      block.children
        ?.map(child => child.text || '')
        .join(' ') || ''
    )
    .join(' ')
    .replace(/<[^>]*>/g, '')
    .trim();
}

// Get image URL safely
function getImageUrl(image) {

  if (!image) return null;

  const url =
    image?.url ||
    image?.formats?.thumbnail?.url ||
    null;

  if (!url) return null;

  return url.startsWith('http')
    ? url
    : `${process.env.STRAPI_PUBLIC_URL || 'http://localhost:1337'}${url}`;
}

// FORMAT CATEGORY
function formatCategory(category) {

  if (!category) return null;

  return {
    id: category.id || null,
    documentId: category.documentId || null,
    name: category.name || null,
    slug: category.slug || null,
    description: category.description || null,
    showOnHome: category.showOnHome || false,
    homeSectionTitle: category.homeSectionTitle || null,
    sortOrder: category.sortOrder || null,
    categoryKind: category.categoryKind || null,

    coverImage:
      category.coverImage
        ? {
            url: category.coverImage.url
          }
        : null,

    createdAt: category.createdAt || null,
    updatedAt: category.updatedAt || null,
    publishedAt: category.publishedAt || null,
  };
}

// FORMAT AUTHOR
function formatAuthor(author) {

  if (!author) return null;

  return {
    id: author.id || null,
    documentId: author.documentId || null,
    name: author.name || null,
    slug: author.slug || null,
    title: author.title || null,
    bio: author.bio || null,

    avatar:
      author.avatar
        ? {
            url: author.avatar.url
          }
        : null,

    createdAt: author.createdAt || null,
    updatedAt: author.updatedAt || null,
    publishedAt: author.publishedAt || null,
  };
}

// FORMAT TAGS
function formatTags(tags = []) {

  return tags.map(tag => ({

    id: tag.id || null,
    documentId: tag.documentId || null,

    name: tag.name || null,
    slug: tag.slug || null,

    createdAt: tag.createdAt || null,
    updatedAt: tag.updatedAt || null,
    publishedAt: tag.publishedAt || null,

  }));
}

// FORMAT EVENTS
function formatEvents(events = []) {

  return events.map(event => ({

    id: event.id || null,
    documentId: event.documentId || null,

    title: event.title || null,
    slug: event.slug || null,

    summary: event.summary || null,

    body: extractText(event.body),

    eventType: event.eventType || null,

    startDate: event.startDate || null,
    endDate: event.endDate || null,

    location: event.location || null,

    registerationUrl:
      event.registerationUrl || null,

    isFeatured:
      event.isFeatured || false,

    createdAt: event.createdAt || null,
    updatedAt: event.updatedAt || null,
    publishedAt: event.publishedAt || null,

  }));
}

module.exports = createCoreController(
  'api::article.article',
  ({ strapi }) => ({

    // GET ALL ARTICLES
    async find(ctx) {

      const results = await strapi.db
        .query('api::article.article')
        .findMany({

          where: {
            publishedAt: {
              $notNull: true
            }
          },

          populate: {
            featuredImage: true,

            category: {
              populate: {
                coverImage: true
              }
            },

            author: {
              populate: {
                avatar: true
              }
            },

            tags: true,

            events: true,
          },

          orderBy: {
            id: 'desc'
          }
        });

      const formattedData = results.map(item => ({

  id: item.id || null,

  documentId:
    item.documentId || null,

  title: item.title || null,

  slug: item.slug || null,

  excerpt: item.excerpt || null,

  description:
    item.description || null,

  body: extractText(item.body),

  featuredImage:
    item.featuredImage
      ? {
          url: item.featuredImage.url
        }
      : null,

  category:
    formatCategory(item.category),

  author:
    formatAuthor(item.author),

  tags:
    formatTags(item.tags),

  events:
    formatEvents(item.events),

  articleType:
    item.articleType || null,

  columnGroup:
    item.columnGroup || null,

  columnRole:
    item.columnRole || null,

  columnSortOrder:
    item.columnSortOrder || null,

  showInLatestColumns:
    item.showInLatestColumns || false,

  isPopular:
    item.isPopular || false,

  popularRank:
    item.popularRank || null,

  isTrending:
    item.isTrending || false,

  showInHero:
    item.showInHero || false,

  heroOrder:
    item.heroOrder || null,

  publishDate:
    item.publishDate ||
    item.publishedAt ||
    null,

  createdAt:
    item.createdAt || null,

  updatedAt:
    item.updatedAt || null,

  publishedAt:
    item.publishedAt || null,

}));

return {
  data: formattedData,
  meta: {
    pagination: {
      page: 1,
      pageSize: formattedData.length,
      pageCount: 1,
      total: formattedData.length
    }
  }
};
    },

    // GET SINGLE ARTICLE
    async findOne(ctx) {

      const id = Number(ctx.params.id);

if (isNaN(id)) {
  return ctx.badRequest('Invalid article id');
}

      const item = await strapi.db
        .query('api::article.article')
        .findOne({

         where: {
  id,
  publishedAt: {
    $notNull: true
  }
},

          populate: {
            featuredImage: true,

            category: {
              populate: {
                coverImage: true
              }
            },

            author: {
              populate: {
                avatar: true
              }
            },

            tags: true,

            events: true,
          }
        });

      if (!item) {
        return ctx.notFound('Article not found');
      }

      return {

        id: item.id || null,

        documentId:
          item.documentId || null,

        title: item.title || null,

        slug: item.slug || null,

        excerpt: item.excerpt || null,

        description:
          item.description || null,

        body:
          extractText(item.body),

        featuredImage:
          item.featuredImage
            ? {
                url: item.featuredImage.url
              }
            : null,

        category:
          formatCategory(item.category),

        author:
          formatAuthor(item.author),

        tags:
          formatTags(item.tags),

        events:
          formatEvents(item.events),

        articleType:
          item.articleType || null,

        columnGroup:
          item.columnGroup || null,

        columnRole:
          item.columnRole || null,

        columnSortOrder:
          item.columnSortOrder || null,

        showInLatestColumns:
          item.showInLatestColumns || false,

        isPopular:
          item.isPopular || false,

        popularRank:
          item.popularRank || null,

        isTrending:
          item.isTrending || false,

        showInHero:
          item.showInHero || false,

        heroOrder:
          item.heroOrder || null,

        publishDate:
          item.publishDate ||
          item.publishedAt ||
          null,

        createdAt:
          item.createdAt || null,

        updatedAt:
          item.updatedAt || null,

       publishedAt:
  item.publishedAt || null,
      };
    },

    // SEARCH ARTICLES
    async search(ctx) {
  const { q } = ctx.query;

  if (!q) {
    return {
      data: []
    };
  }

  try {
    const articles = await strapi.documents('api::article.article').findMany({
      filters: {
        title: {
          $containsi: q
        }
      }
    });

    return {
      data: articles
    };
  } catch (error) {
    console.error(error);
    return {
      error: error.message
    };
  }
}

  })
);