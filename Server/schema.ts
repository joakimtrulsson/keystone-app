import type { Lists } from '.keystone/types';
import type { Session } from './access';

import {
  User,
  Role,
  Event,
  Chapter,
  Post,
  Image,
  Section,
  Faq,
  Teaser,
} from './schemas/index';

export const lists: Lists<Session> = {
  Chapter,
  Event,
  Post,
  User,
  Role,
  Image,
  // Section,
  // Faq,
  // Teaser,
};
