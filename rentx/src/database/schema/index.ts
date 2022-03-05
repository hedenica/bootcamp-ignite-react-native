import { appSchema } from '@nozbe/watermelondb';

import { user } from './user';

const schemas = appSchema({
  version: 1,
  tables: [
    user,
  ]
});

export { schemas }