import { text, image } from '@keystone-6/core/fields';

export const imageStorageField = image({ storage: 'heroImages' });

export const imageAltField = text({
  defaultValue: '',
  validation: { length: { max: 255 } },
});
