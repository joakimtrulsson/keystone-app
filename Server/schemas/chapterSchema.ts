import { list } from '@keystone-6/core';
import { allOperations } from '@keystone-6/core/access';
import { relationship, text, image, json } from '@keystone-6/core/fields';
// import { document } from '@keystone-6/fields-document';

import { isSignedIn, permissions, rules } from '../access';

import buildSlug from '../utils/buildSlug';

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

    sections: relationship({
      ref: 'Section',
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

    // sections: json({
    //   ui: {
    //     views: './fields/sections/components',
    //     createView: { fieldMode: 'edit' },
    //     listView: { fieldMode: 'hidden' },
    //     itemView: { fieldMode: 'edit' },
    //   },
    // }),

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
    // slugTest: {
    //   // type: Virtual,
    //   resolver: item => `${item.name}-${item.id}`
    //   }
    // },
    // slug: text({
    //   // Being a slug, it should be indexed for lookups and unique
    //   // isIndexed: 'unique',

    //   // Define the hook function itself and attach it to the resolveInput
    //   // step of the mutation lifecycle
    //   hooks: {
    //     resolveInput: ({ operation, resolvedData, inputData }) => {
    //       // Lets only default the slug value on create and only if
    //       // it isn't supplied by the caller.
    //       // We probably don't want slugs to change automatically if an
    //       // item is renamed.
    //       console.log(resolvedData);
    //       if (operation === 'update' && !inputData.slug) {
    //         return buildSlug(inputData.title);
    //       }

    //       // Since this hook is a the field level we only return the
    //       // value for this field, not the whole item
    //       return resolvedData.slug;
    //     },
    //   },
    // }),
  },
});
