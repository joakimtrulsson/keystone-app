import { list } from '@keystone-6/core';
import { relationship, text, image } from '@keystone-6/core/fields';
import { allOperations } from '@keystone-6/core/access';
import { isSignedIn, permissions, rules } from '../access';

export const teaserSchema = list({
  access: {
    operation: {
      ...allOperations(isSignedIn),
      create: permissions.canCreateItems,
      query: () => true,
    },
    filter: {
      query: () => true,
      // query: rules.canReadItems,
      update: rules.canManageItems,
      delete: rules.canManageItems,
    },
  },
  fields: {
    text: text({ validation: { isRequired: true } }),
    url: text({ validation: { isRequired: true } }),
    image: image({ storage: 'teaserImages' }),
  },
});
