import { list } from '@keystone-6/core';
import { allOperations } from '@keystone-6/core/access';
import { relationship, text, image } from '@keystone-6/core/fields';
// import { document } from '@keystone-6/fields-document';

import { isSignedIn, permissions, rules } from '../access';

export const chapterSchema = list({
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
  ui: {
    hideCreate: (args) => !permissions.canCreateItems(args),
    listView: {
      initialColumns: ['title', 'author'],
    },
  },
  fields: {
    title: text({ validation: { isRequired: true } }),
    desc: text({ validation: { isRequired: true } }),
    heroImage: image({ storage: 'heroImages' }),
    referencedChapter: relationship({
      ref: 'Chapter',
      many: true,
      ui: {
        createView: {
          fieldMode: (args) => (permissions.canManageAllItems(args) ? 'edit' : 'hidden'),
        },
        itemView: {
          fieldMode: (args) => (permissions.canManageAllItems(args) ? 'edit' : 'read'),
        },
      },
    }),
    events: relationship({
      ref: 'Event.chapter',
      many: true,
      ui: {
        createView: {
          fieldMode: (args) => (permissions.canManageAllItems(args) ? 'edit' : 'hidden'),
        },
        itemView: {
          fieldMode: (args) => (permissions.canManageAllItems(args) ? 'edit' : 'read'),
        },
      },
      hooks: {
        resolveInput({ operation, resolvedData, context }) {
          return resolvedData.events;
          // return resolvedData.chapter;
        },
      },
    }),

    author: relationship({
      ref: 'User.chapters',
      ui: {
        createView: {
          fieldMode: (args) => (permissions.canManageAllItems(args) ? 'edit' : 'hidden'),
        },
        itemView: {
          fieldMode: (args) => (permissions.canManageAllItems(args) ? 'edit' : 'read'),
        },
      },
      hooks: {
        resolveInput({ operation, resolvedData, context }) {
          if (operation === 'create' && !resolvedData.author && context.session) {
            // Nytt item länkas till användaren, detta är viktigt eftersom utan canManageAllItems syns inte det här fältet.

            return { connect: { id: context.session.itemId } };
          }
          return resolvedData.author;
        },
      },
    }),
  },
});
