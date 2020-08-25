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
import forge from 'node-forge';
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

const FORUM_URL = 'forum.uscreditcardguide.com';

import {
  decryptPayload,
  encryptPayload,

  forumJsonApi,
  getForumUserStatus,
  getForumNotifications,
} from '../libs/Utility';

function randomBytes(length) {
  return Array(length + 1)
    .join('x')
    .replace(/x/g, c => {
      return Math.floor(Math.random() * 16).toString(16);
    });
};

function serializeParams(obj) {
  return Object.keys(obj)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent([obj[k]])}`)
    .join('&');
};

function parseForumUrl(term) {
  var url = '';

  term = term.trim();
  while (term.endsWith('/')) {
    term = term.slice(0, term.length - 1);
  }

  if (!term.match(/^https?:\/\//)) {
    url = `https://${term}`;
  } else {
    url = term;
  }
  // console.log('site.js:formTerm():ret url:', url);
  return url;
}

function getForumDataFromStore(state) {
  return state.foruminfo.siteinfo;
}

function getUserIdFromStore(state) {
  // return state.userinfo.user_id;
  return undefined;
}

function getForumPublicKeyFromStore(state) {
  return state.foruminfo?.public_key;
}

function getForumPrivateKeyFromStore(state) {
  return state.foruminfo?.private_key;
}


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


// worker saga: startGetForumInfo
function* startGetForumInfo(action) {
  try {
    console.log('forumSagas():startGetForumInfo():action:', action);
    const real_url = parseForumUrl(FORUM_URL);

    var response = yield (axios.head(real_url + '/user-api-key/new'));
    var key = 'Auth-Api-Version'.toLowerCase();
    var apiVersion = parseInt(response.headers[key], 10);
    if (apiVersion < 2) {
      throw 'bad api version number';
    }

    var info_url = `${real_url}/site/basic-info.json`;
    console.log('forumSagas():startGetForumInfo():info_url:', info_url);
    response = yield (axios.get(info_url));
    var info = response.data;
    console.log('forumSagas():startGetForumInfo():mark 1 info:', info);

    let loginRequired = false;
    var about_url = `${real_url}/about.json`;
    console.log('forumSagas():startGetForumInfo():about_url:', about_url);
    response = yield (axios.get(about_url));
    var aboutInfo = response.data;

    var payloads = {
      url: real_url,
      title: info.title,
      description: info.description,
      icon: info.apple_touch_icon_url,
      apiVersion: apiVersion,
      loginRequired: loginRequired,
    };


    yield put({
      type: FORUM_GET_FORUM_INFO_SUCCESS,
      payloads: payloads,
    });





  } catch (error) {
    console.log('forumSagas():startGetForumInfo():error:', error);
    yield put({
      type: FORUM_GET_FORUM_INFO_FAIL,
      error
    })

  }
}

// watchers: watchStartGetForumInfo
export function* watchStartGetForumInfo() {
  // console.log("forumSagas():watchStartGetForumInfo()");
  yield takeLatest(FORUM_GET_FORUM_INFO_IN_PROGRESS, startGetForumInfo);
}
// worker saga: startForumLogin
function* startForumAuth(action) {
  try {
    console.log('forumSagas():startForumAuth():action:', action);
    console.log('forumSagas():startForumAuth():FORUM_URL:', FORUM_URL)


    var site = yield select(getForumDataFromStore);
    if (!site || site.url == undefined || site.url == null) {
      throw 'forum site info is empty!';
    }
    let scopes = 'notifications,session_info,one_time_password';
    let basePushUrl = 'https://api.discourse.org';
    let push_url = basePushUrl + '/api/publish_' + Platform.OS;
    let redirectUrl = AuthSession.getRedirectUrl();

    var client_id = yield select(getUserIdFromStore);
    var public_key = yield select(getForumPublicKeyFromStore);
    // console.log('forumSagas():startGetForumInfo():client_id:',client_id);

    (client_id?.length > 5) ? client_id = client_id : client_id = randomBytes(32);
    console.log('forumSagas():startForumAuth():client_id:', client_id);
    console.log('forumSagas():startForumAuth():site.url:', site.url);
    console.log('forumSagas():startForumAuth():public_key:', public_key);

    let params = {
      scopes: scopes,
      client_id: client_id,
      nonce: randomBytes(16),
      push_url: push_url,
      auth_redirect: redirectUrl,
      application_name: Constants.deviceName,
      public_key: public_key,
      discourse_app: 1,
    };

    console.log('forumSagas():startForumAuth():params:', params);

    var authUrl = `${site.url}/user-api-key/new?${serializeParams(params)}`;
    console.log('forumSagas():startForumAuth():authUrl:', authUrl);
    // console.log('generateAuthURL() ret.length:', ret.length);

    const authResult = yield (AuthSession.startAsync({
      authUrl: authUrl
    }));

    console.log('forumSagas():startForumAuth():authResult:', authResult);

    if (authResult?.type == 'success') {
      console.log('forumSagas():startForumAuth():auth return success');
      const private_key = yield select(getForumPrivateKeyFromStore);
      const public_key = yield select(getForumPublicKeyFromStore);
      console.log('forumSagas():startForumAuth():private_key:', private_key);
      console.log('forumSagas():startForumAuth():public_key:', public_key);
      console.log('forumSagas():startForumAuth():payload:', authResult.params.payload);
      console.log('forumSagas():startForumAuth():oneTimePassword:', authResult.params.oneTimePassword);
      const decodeData = yield (decryptPayload(authResult.params.payload, private_key));
      var OTP = yield (decryptPayload(authResult.params.oneTimePassword, private_key));
      var payloads = JSON.parse(decodeData);
      console.log('forumSagas():startForumAuth():decodeData:', decodeData);
      console.log('forumSagas():startForumAuth():OTP:', OTP);
      payloads.oneTimePassword = OTP;
      console.log('forumSagas():startForumAuth():payloads:', payloads);


      yield put({
        type: FORUM_AUTH_SUCCESS,
        payloads: payloads,
      });
    } else {
      yield put({
        type: FORUM_AUTH_FAIL,
        payload: {
          msg: 'auth data error.'
        }
      })
    }


  } catch (error) {
    console.log('forumSagas():startForumAuth():err:', error);
    yield put({
      type: FORUM_AUTH_FAIL,
      error
    })

  }
}

// watchers: watchStartForumLogin
export function* watchStartForumAuth() {
  // console.log("forumSagas():watchStartForumAuth()");
  yield takeLatest(FORUM_AUTH_IN_PROGRESS, startForumAuth);
}