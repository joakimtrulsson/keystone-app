import { list } from '@keystone-6/core';
import { allOperations } from '@keystone-6/core/access';
import { relationship, text, timestamp, image } from '@keystone-6/core/fields';
import { document } from '@keystone-6/fields-document';
import { EImageType, IImageFieldInput } from '../component-blocks/ImageUploader/types';

import { isSignedIn, permissions, rules } from '../access';

import { imageStorageField } from '../component-blocks/ImageUploader/fields';

export const imageSchema = list({
  access: {
    operation: {
      ...allOperations(isSignedIn),
      create: permissions.canCreateItems,
      query: () => true,
    },
    filter: {
      query: rules.canReadItems,
      update: rules.canReadItems,
      // update: rules.canManageItems,
      delete: rules.canManageItems,
    },
  },
  ui: {
    listView: {
      initialColumns: ['name', 'type', 'image'],
      initialSort: { field: 'name', direction: 'ASC' },
    },
  },
  /** Image */
  fields: {
    name: text({ defaultValue: '' }),
    // Category, Page, Post, Document (from document editor)
    type: text({ defaultValue: EImageType.DOCUMENT }),
    filename: text({
      isIndexed: 'unique',
      db: { isNullable: true },
      ui: { createView: { fieldMode: 'hidden' }, itemView: { fieldMode: 'read' } },
    }),
    image: imageStorageField,
  },
  hooks: {
    resolveInput: async ({ resolvedData, item }) => {
      const { name, image } = resolvedData;
      const imageId = (image as IImageFieldInput).id ?? item?.image_id;
      const imageExt = (image as IImageFieldInput).extension ?? item?.image_extension;
      const origFilename =
        typeof imageId === 'string'
          ? imageId.split('-').slice(0, -1).join('-')
          : 'unknown';
      const filename = imageId ? `${imageId}.${imageExt}` : null;

      if (name === '') {
        return {
          ...resolvedData,
          name: origFilename || item?.name,
          filename: filename || item?.filename,
        };
      }

      return { ...resolvedData, filename };
    },
  },
});
