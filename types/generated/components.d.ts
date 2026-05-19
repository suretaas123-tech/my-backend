import type { Schema, Struct } from '@strapi/strapi';

export interface SeoSharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_seo_shared_seos';
  info: {
    displayName: 'shared.seo';
  };
  attributes: {};
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'seo.shared-seo': SeoSharedSeo;
    }
  }
}
