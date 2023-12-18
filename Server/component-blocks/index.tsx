/** @jsxRuntime classic */
/** @jsx jsx */

import React from 'react';
import {
  NotEditable,
  component,
  fields,
} from '@keystone-6/fields-document/component-blocks';
import { ImageUploader } from './ImageUploader';
import { image } from './document-fields';

import { carousel } from './carousel';
import { hero } from './hero';
import { jsx } from '@keystone-ui/core';

export const componentBlocks = {
  carousel,
  hero,
  /** Image */
  image: component({
    preview: ({ fields }) => (
      <NotEditable>
        <ImageUploader
          listKey={fields.image.options.listKey}
          defaultValue={fields.imageRel.value?.data}
          imageAlt={fields.imageAlt.value}
          onChange={fields.image.onChange}
          onImageAltChange={fields.imageAlt.onChange}
          onRelationChange={fields.imageRel.onChange}
        />
      </NotEditable>
    ),
    label: 'Image',
    schema: {
      imageAlt: fields.text({
        label: 'Image Alt',
        defaultValue: '',
      }),
      imageRel: fields.relationship({
        listKey: 'Image',
        label: 'Image Relation',
        selection: 'id, image { width, height, url }',
      }),
      image: image({
        listKey: 'Image',
      }),
    },
    chromeless: true,
  }),
};
