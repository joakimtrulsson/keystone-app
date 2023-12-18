import { HydratedRelationshipData } from '@keystone-6/fields-document/dist/declarations/src/DocumentEditor/component-blocks/api';

export type TImageListData = {
  id?: string;
  image?: {
    url?: string;
  };
};

export type TImageValue = TImageListData | null;

export interface IImageUploaderProps {
  listKey: string;
  defaultValue?: TImageValue;
  imageAlt?: string;
  mode?: 'edit' | 'preview';
  onChange?(value: TImageValue): void;
  onImageAltChange?(value: string): void;
  onRelationChange?(value: HydratedRelationshipData): void;
}

export enum EImageType {
  CATEGORY = 'Category',
  PAGE = 'Page',
  POST = 'Post',
  DOCUMENT = 'Document', // from document editor
}

export interface IImageFieldInput {
  id?: string;
  extension?: string;
  filesize?: number;
  height?: number;
  width?: number;
}
