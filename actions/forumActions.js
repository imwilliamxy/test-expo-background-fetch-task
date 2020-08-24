'use strict';
import {
  FORUM_ADD_FORUM_URL,
  FORUM_CLEAR_FORUM_URL,

  FORUM_GENERATE_KEYPAIR_START,
  FORUM_GENERATE_KEYPAIR_SUCCESS,
  FORUM_GENERATE_KEYPAIR_FAIL,

  FORUM_AUTH_IN_PROGRESS,
  FORUM_AUTH_SUCCESS,
  FORUM_AUTH_FAIL,

  FORUM_GET_FORUM_INFO_IN_PROGRESS,
  FORUM_GET_FORUM_INFO_SUCCESS,
  FORUM_GET_FORUM_INFO_FAIL,
} from './actionTypes';

// add forum url to store
export const addForumUrlAction = (url) => {
  return {
    type: FORUM_ADD_FORUM_URL,
    url: url,
  }
}

// clear forum url to store
export const clearForumUrlAction = () => {
  return {
    type: FORUM_CLEAR_FORUM_URL,
  }
}

export const startGenerateForumKeypairAction = () => {
  return {
    type: FORUM_GENERATE_KEYPAIR_START,
  }
}

export const getForumInfoAction = () => {
  return {
    type: FORUM_GET_FORUM_INFO_IN_PROGRESS,
  }
}

export const startForumAuthAction = () => {
  return {
    type: FORUM_AUTH_IN_PROGRESS,
  }
}