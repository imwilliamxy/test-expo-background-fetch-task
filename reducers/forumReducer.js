'use strict';
// import AsyncStorage from '@react-native-community/async-storage';
import { REHYDRATE } from 'redux-persist';
import {
  FORUM_ADD_FORUM_URL,
  FORUM_CLEAR_FORUM_URL,

  FORUM_GENERATE_KEYPAIR_START,
  FORUM_GENERATE_KEYPAIR_SUCCESS,
  FORUM_GENERATE_KEYPAIR_FAIL,

  FORUM_GET_FORUM_INFO_IN_PROGRESS,
  FORUM_GET_FORUM_INFO_SUCCESS,
  FORUM_GET_FORUM_INFO_FAIL,

  FORUM_AUTH_IN_PROGRESS,
  FORUM_AUTH_SUCCESS,
  FORUM_AUTH_FAIL,
} from '../actions/actionTypes';

const initialState = {
  url: null,
  oneTimePassword: '',
  authToken: '',
  public_key: '',
  private_key: '',
  siteinfo: {},
}


export default (state = initialState, action) => {
  switch (action.type) {
    case 'persist/REHYDRATE':

      if (action?.payload) {
        // 似乎任意一个reducer执行 REHYDRATE 即可
        console.log('forumReducers():REHYDRATE: action:', action)
        return {
          ...state,
          siteinfo: action.payload?.foruminfo?.siteinfo,
          authToken: action.payload?.foruminfo?.authToken,
        };
      } else {
        // console.log("userCardsReducers() REHYDRATE:payload NOT exist.");
        return {
          ...state
        };
      }

    case FORUM_ADD_FORUM_URL:
      return {
        ...state,
        url: action.url,
      }

    case FORUM_CLEAR_FORUM_URL:
      // console.log("blogMenuReducers():BLOG_MENU_DOWNLOAD_SUCCESS:action:",action);
      return {
        url: null,
      }

    case FORUM_GENERATE_KEYPAIR_SUCCESS:
      return {
        ...state,
        public_key: action.payloads.public,
        private_key: action.payloads.private,
      }

    case FORUM_GET_FORUM_INFO_SUCCESS:
      return {
        ...state,
        siteinfo: action.payloads,
      }

    case FORUM_AUTH_SUCCESS:
      console.log('forumReducers():FORUM_AUTH_SUCCESS:action:', action);
      // try {
      //   AsyncStorage.setItem('@forum_token', action.payloads.key);
      // } catch (e) {
      //   // saving error
      //   console.error('error:', e);
      // }

      return {
        ...state,
        oneTimePassword: action.payloads.oneTimePassword,
        authToken: action.payloads.key,
      }

    default:
      return {
        ...state,
      };
  }
}