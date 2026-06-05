'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

// CONVERT RICH TEXT TO PLAIN TEXT
function extractText(blocks) {

  // Already plain string
  if (typeof blocks === 'string') {
    return blocks;
  }

  // Invalid value
  if (!Array.isArray(blocks)) {
    return '';
  }

  return blocks
    .map(block =>
      block.children
        ?.map(child => child.text || '')
        .join(' ')
    )
    .join(' ')
    .trim();
}

module.exports = createCoreController(
  'api::tag.tag',
  ({ strapi }) => ({

    async find(ctx) {

      const tags = await strapi.documents(
        'api::tag.tag'
      ).findMany({

        status: 'published',

        populate: {

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

      // FORMAT DATA
      const formattedData = tags.map(tag => ({

        id:
          tag.id || null,

        documentId:
          tag.documentId || null,

        name:
          tag.name || null,

        slug:
          tag.slug || null,

        createdAt:
          tag.createdAt || null,

        updatedAt:
          tag.updatedAt || null,

        publishedAt:
          tag.publishedAt || null,

        // FULL ARTICLES DATA
        articles:
          tag.articles?.map(article => ({

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
    }

  })
);