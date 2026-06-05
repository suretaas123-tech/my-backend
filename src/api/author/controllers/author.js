'use strict';

/**
 * author controller
 */

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

// FORMAT ARTICLES
function formatArticles(articles = []) {

  return articles.map(article => ({

    id: article.id || null,

    documentId:
      article.documentId || null,

    title:
      article.title || null,

    slug:
      article.slug || null,

    excerpt:
      article.excerpt || null,

    description:
      article.description || null,

    body:
      extractText(article.body),

    featuredImage:
      article.featuredImage
        ? {
            url:
              article.featuredImage.url
          }
        : null,

    articleType:
      article.articleType || null,

    columnGroup:
      article.columnGroup || null,

    columnRole:
      article.columnRole || null,

    columnSortOrder:
      article.columnSortOrder || null,

    showInLatestColumns:
      article.showInLatestColumns || false,

    isPopular:
      article.isPopular || false,

    popularRank:
      article.popularRank || null,

    isTrending:
      article.isTrending || false,

    showInHero:
      article.showInHero || false,

    heroOrder:
      article.heroOrder || null,

    publishDate:
      article.publishDate ||
      article.publishedAt ||
      null,

    createdAt:
      article.createdAt || null,

    updatedAt:
      article.updatedAt || null,

    publishedAt:
      article.publishedAt || null,

  }));
}

module.exports = createCoreController(
  'api::author.author',
  ({ strapi }) => ({

    // GET ALL AUTHORS
    async find(ctx) {

      const results = await strapi.db
        .query('api::author.author')
        .findMany({

          where: {
            publishedAt: {
              $notNull: true
            }
          },

          populate: {

            avatar: true,

            articles: {
              populate: {
                featuredImage: true
              }
            }
          },

          orderBy: {
            id: 'desc'
          }
        });

      const formattedData = results.map(author => ({

  // IDS
  id: author.id || null,

  documentId:
    author.documentId || null,

  // BASIC FIELDS
  name:
    author.name || null,

  slug:
    author.slug || null,

  title:
    author.title || null,

  bio:
    author.bio || null,

  // DATE FIELDS
  publishDate:
    author.publishDate ||
    author.publishedAt ||
    null,

  createdAt:
    author.createdAt || null,

  updatedAt:
    author.updatedAt || null,

  publishedAt:
    author.publishedAt || null,

  // AVATAR IMAGE
  avatar:
    author.avatar
      ? {
          url:
            author.avatar.url
        }
      : null,

  // FULL ARTICLES DATA
  articles:
    formatArticles(
      author.articles
    ),

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
    // GET SINGLE AUTHOR
    async findOne(ctx) {

      const { id } = ctx.params;

      const author = await strapi.db
        .query('api::author.author')
        .findOne({

          where: {
            id: Number(id),

            publishedAt: {
              $notNull: true
            }
          },

          populate: {

            avatar: true,

            articles: {
              populate: {
                featuredImage: true
              }
            }
          }
        });

      if (!author) {
        return ctx.notFound(
          'Author not found'
        );
      }

      return {

        // IDS
        id: author.id || null,

        documentId:
          author.documentId || null,

        // BASIC FIELDS
        name:
          author.name || null,

        slug:
          author.slug || null,

        title:
          author.title || null,

        bio:
          author.bio || null,

        // DATE FIELDS
        publishDate:
          author.publishDate ||
          author.publishedAt ||
          null,

        createdAt:
          author.createdAt || null,

        updatedAt:
          author.updatedAt || null,

        publishedAt:
          author.publishedAt || null,

        // AVATAR IMAGE
        avatar:
          author.avatar
            ? {
                url:
                  author.avatar.url
              }
            : null,

        // FULL ARTICLES DATA
        articles:
          formatArticles(
            author.articles
          ),

      };
    }

  })
);