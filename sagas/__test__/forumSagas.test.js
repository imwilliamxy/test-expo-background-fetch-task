'use strict';

import { startForumAuth } from '../forumSagas';
import { startForumAuthAction } from '../../actions/forumActions';

test('first test', () => {
  const gen = startForumAuth(startForumAuthAction);

  gen.forEach((item) => {
    console.log(item);
  })

})