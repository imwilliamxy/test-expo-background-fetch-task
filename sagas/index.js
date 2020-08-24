'use strict';

// saga effects
import { delay } from 'redux-saga';
import { all, fork } from 'redux-saga/effects';

import {
  watchStartGenerateKeypair,
  // watchStartForumAuth,
  // watchStartGetForumInfo,
} from './forumSagas';


export default function* rootSaga() {
  yield all([
    // forum
    fork(watchStartGenerateKeypair),
    // fork(watchStartForumAuth),
    // fork(watchStartGetForumInfo),
  ]);
}