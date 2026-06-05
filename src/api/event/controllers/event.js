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
  'api::event.event',
  ({ strapi }) => ({

    async find(ctx) {

      const events = await strapi.db
        .query('api::event.event')
        .findMany({

          where: {
            publishedAt: {
              $notNull: true
            }
          },

          populate: {

            featuredImage: true,

            article: {
              populate: {
                featuredImage: true
              }
            }
          },

          orderBy: {
            id: 'desc'
          }
        });

      const formattedData = events.map((item) => ({

        // EVENT DATA
        id: item.id || null,

        documentId:
          item.documentId || null,

        title:
          item.title || null,

        slug:
          item.slug || null,

        summary:
          item.summary || null,

        body:
          extractText(item.body),

        eventType:
          item.eventType || null,

        startDate:
          item.startDate || null,

        endDate:
          item.endDate || null,

        location:
          item.location || null,

        registerationUrl:
          item.registerationUrl || null,

        isFeatured:
          item.isFeatured || false,

        createdAt:
          item.createdAt || null,

        updatedAt:
          item.updatedAt || null,

        publishedAt:
          item.publishedAt || null,

        publishDate:
          item.publishDate ||
          item.publishedAt ||
          null,

        // FEATURED IMAGE
        featuredImage:
          item.featuredImage
            ? {
                url:
                  item.featuredImage.url
              }
            : null,

        // FULL ARTICLE DATA
        article:
          item.article
            ? {

                id:
                  item.article.id || null,

                documentId:
                  item.article.documentId || null,

                title:
                  item.article.title || null,

                slug:
                  item.article.slug || null,

                excerpt:
                  item.article.excerpt || null,

                description:
                  item.article.description || null,

                body:
                  extractText(
                    item.article.body
                  ),

                featuredImage:
                  item.article.featuredImage
                    ? {
                        url:
                          item.article
                            .featuredImage.url
                      }
                    : null,

                articleType:
                  item.article.articleType || null,

                columnGroup:
                  item.article.columnGroup || null,

                columnRole:
                  item.article.columnRole || null,

                columnSortOrder:
                  item.article.columnSortOrder || null,

                showInLatestColumns:
                  item.article
                    .showInLatestColumns || false,

                isPopular:
                  item.article.isPopular || false,

                popularRank:
                  item.article.popularRank || null,

                isTrending:
                  item.article.isTrending || false,

                showInHero:
                  item.article.showInHero || false,

                heroOrder:
                  item.article.heroOrder || null,

                publishDate:
                  item.article.publishDate ||
                  item.article.publishedAt ||
                  null,

                createdAt:
                  item.article.createdAt || null,

                updatedAt:
                  item.article.updatedAt || null,

                publishedAt:
                  item.article.publishedAt || null,

              }
            : null

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