// saga effects
import {
  call,
  put,
  select,
  takeEvery,
  takeLatest
} from 'redux-saga/effects';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as AuthSession from 'expo-auth-session';

import axios from "axios";

import {
  FORUM_AUTH_IN_PROGRESS,
  FORUM_AUTH_SUCCESS,
  FORUM_AUTH_FAIL,

  FORUM_GENERATE_KEYPAIR_START,
  FORUM_GENERATE_KEYPAIR_SUCCESS,
  FORUM_GENERATE_KEYPAIR_FAIL,

  FORUM_GET_FORUM_INFO_IN_PROGRESS,
  FORUM_GET_FORUM_INFO_SUCCESS,
  FORUM_GET_FORUM_INFO_FAIL,
} from '../actions/actionTypes';


// worker saga: startGenerateKeypair
function* startGenerateKeypair(action) {
  try {
    console.log('forumSagas():startGenerateKeypair():action:', action);
    var rsa = forge.pki.rsa;
    var keypair = yield (rsa.generateKeyPair({ bits: 1024, e: 0x10001 }));
    var public_key = forge.pki.publicKeyToPem(keypair.publicKey);
    console.log('forumSagas():startGenerateKeypair():public key:', public_key);

    var private_key = forge.pki.privateKeyToPem(keypair.privateKey);
    console.log('forumSagas():startGenerateKeypair():private key:', private_key);
    var payloads = {
      public: public_key,
      private: private_key
    }

    yield put({
      type: FORUM_GENERATE_KEYPAIR_SUCCESS,
      payloads: payloads,
    });
  } catch (error) {
    console.log('forumSagas():startGenerateKeypair():err:', error);
    yield put({
      type: FORUM_GENERATE_KEYPAIR_FAIL,
      error
    })

  }
}

// watchers: watchStartGenerateKeypair
export function* watchStartGenerateKeypair() {
  // console.log("forumSagas():watchStartGenerateKeypair()");
  yield takeLatest(FORUM_GENERATE_KEYPAIR_START, startGenerateKeypair);
}
