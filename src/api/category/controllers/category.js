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

module.exports = createCoreController(
  'api::category.category',
  ({ strapi }) => ({

    async find(ctx) {

      const categories = await strapi.db
        .query('api::category.category')
        .findMany({

          where: {
            publishedAt: {
              $notNull: true
            }
          },

          populate: {

            coverImage: true,

            articles: {
              populate: {
                featuredImage: true
              }
            }
          },

          orderBy: {
            sortOrder: 'asc'
          }
        });

      const formattedData = categories.map((item) => ({

        // IDS
        id: item.id || null,

        documentId:
          item.documentId || null,

        // BASIC FIELDS
        name:
          item.name || null,

        slug:
          item.slug || null,

        description:
          item.description || null,

        showOnHome:
          item.showOnHome || false,

        homeSectionTitle:
          item.homeSectionTitle || null,

        sortOrder:
          item.sortOrder || null,

        categoryKind:
          item.categoryKind || null,

        // DATES
        createdAt:
          item.createdAt || null,

        updatedAt:
          item.updatedAt || null,

        publishedAt:
          item.publishedAt || null,

        // COVER IMAGE
        coverImage:
          item.coverImage
            ? {
                url:
                  item.coverImage.url
              }
            : null,

        // FULL ARTICLES DATA
        articles:
          item.articles?.map(article => ({

            id:
              article.id || null,

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

          })) || []

      }));

      return {
        data: formattedData
      };
    }

  })
);