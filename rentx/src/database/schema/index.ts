import { appSchema } from '@nozbe/watermelondb';

import { user } from './user';
import { car } from './car';

const schemas = appSchema({
  version: 2,
  tables: [
    user,
    car,
  ]
});

export { schemas }