'use strict';

import axios from 'axios';
import forge from 'node-forge';




function decryptPayload(payload, privateKey) {
  var privateKey = forge.pki.privateKeyFromPem(privateKey);
  var decrypted = privateKey.decrypt(forge.util.decode64(payload));
  // console.log("decryptPayload():return:", forge.util.decodeUtf8(decrypted));
  return decrypted;
}

function encryptPayload(payload, publicKey) {
  var publicKey = forge.pki.publicKeyFromPem(publicKey);
  var encrypted = forge.util.encode64(publicKey.encrypt(payload));
  return encrypted;
};


async function forumJsonApi(authToken, path, method, client_id, data) {

  var m = method || 'GET';
  let headers = {
    'User-Api-Key': authToken,
    'User-Agent': `Discourse ${Platform.OS} App / 1.0`,
    'Content-Type': 'application/json',
    'Dont-Chunk': 'true',
    'User-Api-Client-Id': client_id || '',
  };

  // console.log('forumJsonApi():path:', path);
  // console.log('forumJsonApi():method:', m);
  // console.log('forumJsonApi():method:', typeof (m));
  // console.log('forumJsonApi():data:', data);
  // console.log('forumJsonApi():headers:', headers);

  let result = await axios(path, {
    method: m,
    url: path,
    // mode: "cors",
    headers: headers,
    // data: JSON.stringify(data),
  });

  // console.log('forumJsonApi():result:', result);

  if (result.status == 200) {
    // this.forum_userinfo = JSON.parse(JSON.stringify(result.data.current_user));
    return result.data;
  } else {
    throw new Error('get json api error');
  }
}

async function getForumUserStatus(authToken) {

  const path = '/session/current.json';

  // console.log("getForumUserStatus():path:", path);
  const full_path = `https://forum.uscreditcardguide.com${path}`;
  // console.log("getForumUserStatus():full path:", full_path);
  try {
    let res = await forumJsonApi(authToken, full_path, 'GET', 'client_id', {});
    console.log("getForumUserStatus():result:", res);
    let forum_userinfo = JSON.parse(JSON.stringify(res.current_user));


    // console.log('getForumUserStatus():forum_userinfo:', forum_userinfo);
    return forum_userinfo;
  } catch (error) {
    console.error('getForumUserStatus():', error);
    return null;
  }
}

async function getForumNotifications(authToken, username) {
  try {
    let path = '/notifications.json?recent=true&limit=100';
    let full_path = `https://forum.uscreditcardguide.com${path}`;
    let result = await forumJsonApi(authToken, full_path, 'GET', username, {});
    // console.log("getForumNotifications():result:", result);
    /*

    mentioned: 1,
    replied: 2,
    quoted: 3,
    edited: 4,
    liked: 5,
    private_message: 6,
    invited_to_private_message: 7,
    invitee_accepted: 8,
    posted: 9,
    moved_post: 10,
    linked: 11,
    granted_badge: 12,
    invited_to_topic: 13,
    custom: 14,
    group_mentioned: 15,
    group_message_summary: 16,
    watching_first_post: 17,
    topic_reminder: 18,
    liked_consolidated: 19,
    post_approved: 20,
    code_review_commit_approved: 21,
    membership_request_accepted: 22,
    membership_request_consolidated: 23,
    bookmark_reminder: 24,
    reaction: 25,
    votes_released: 26,
    event_reminder: 27,
    event_invitation: 28
    notification types:
    2: 收到回复
    5: 收到赞
    6: 收到论坛私信
    12: 获得论坛徽章
    16: 收到论坛群发消息
    */


    return result;

    // console.log('getNotifications():self:', this);
  } catch (error) {
    console.error('forumJsonApi():', error);
  }
}

export {
  // preProcessCards,
  decryptPayload,
  encryptPayload,

  forumJsonApi,
  getForumUserStatus,
  getForumNotifications,
}