import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

import axios from 'axios';
import * as Sentry from 'sentry-expo';
import "isomorphic-fetch";

const FETCH_TASKNAME = 'test_task';
const INTERVAL = 15;

var background_exec_count = 0;

export async function request_server(flag: String, ts: number, count: number) {

  let param = {
    app_name: 'test-expo-background-fetch-task-' + flag,
    OS: Platform.OS,
    count: count,
    timestamp: ts,
    appOwnership: Constants.appOwnership,
    expoVersion: Constants.expoVersion,
    deviceName: Constants.deviceName,
    isDevice: Constants.isDevice,

  }

  let u = new URLSearchParams(param).toString();
  let req_url = 'https://test.xingyong.net/t.php?' + u;
  console.log("request_server():os:", Platform.OS);
  console.log("request_server():req_url:", req_url);

  try {
    const response = await axios({
      method: 'GET',
      url: req_url,
      // mode: "cors",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
      },
      // data: JSON.stringify(param)
    });
    return response;
  } catch (error) {
    if (error.request) {
      console.log('request_server():error.request:', error.request);
    }

    if (error.message) {
      console.log('request_server():error.request.message:', error.message);
    }
    // console.log('request_server():error.response.status):', error.response.status);
    console.log('request_server():error:', error);
  }


}

async function backgroundTask() {
  try {
    var ts = Math.round((new Date()).getTime() / 1000);
    console.log(`backgroundTask():[${Platform.OS}][${ts}][${background_exec_count}] task function is running....`)
    background_exec_count += 1;
    const receivedNewData = false;// do your background fetch here


    console.log("backgroundTask():request is sent.");
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Time's up!",
        body: 'Change sides!',
      },
      trigger: {
        seconds: 10,
      },
    });
    let resp = await request_server('backgroundTask', ts, background_exec_count);
    console.log("backgroundTask():response.data:", resp.data);
    return receivedNewData ? BackgroundFetch.Result.NewData : BackgroundFetch.Result.NoData;
  } catch (error) {
    console.error("backgroundTask():run error:", error);
    return BackgroundFetch.Result.Failed;
  }
}


// TaskManager.defineTask(FETCH_TASKNAME, backgroundTask);

export async function registerFetchTask() {
  TaskManager.defineTask(FETCH_TASKNAME, async () => {
    var ts = Math.round((new Date()).getTime() / 1000);
    console.log(`backgroundTask():[${Platform.OS}][${ts}][${background_exec_count}] task function is running....`)
    Sentry.captureMessage(`backgroundTask():[${Platform.OS}][${ts}][${background_exec_count}] task function is running....`);
    background_exec_count += 1;
    try {
      let resp = await request_server('backgroundTask', ts, background_exec_count);
      console.log("backgroundTask():response.data:", resp.data);
      Sentry.captureMessage("backgroundTask():response.data:", resp.data);
    } catch (error) {
      console.error('backgroundTask():request_server error:', error);
      Sentry.captureMessage('backgroundTask():request_server error:', error);
    }

    try {
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Time's up!",
          body: 'Change sides!',
        },
        trigger: {
          seconds: 10,
        },
      });
    } catch (error) {
      console.error('backgroundTask():add local Notification error:', error);
      Sentry.captureMessage('backgroundTask():add local Notification error:', error);
    }
    return BackgroundFetch.Result.NewData ;
  });
  const status = await BackgroundFetch.getStatusAsync();
  console.log("registerFetchTask(): status:", status);
  // console.log("registerFetchTask():", BackgroundFetch.Status);
  switch (status) {
    case BackgroundFetch.Status.Restricted:
    case BackgroundFetch.Status.Denied:
      console.log("registerFetchTask():Background execution is disabled");
      Sentry.captureMessage("registerFetchTask():Background execution is disabled");
      return;
    case BackgroundFetch.Status.Available: {
      console.log("registerFetchTask():Background execution allowed");
      Sentry.captureMessage("registerFetchTask():Background execution allowed");

      const options = Platform.OS == 'android' ? {
        minimumInterval: INTERVAL, // in seconds
        startOnBoot: true,
        stopOnTerminate: false,
      } : {
          minimumInterval: INTERVAL, // in seconds
          startOnBoot: true,
          stopOnTerminate: false,
        };

      console.log("registerFetchTask():Register task:", FETCH_TASKNAME);
      Sentry.captureMessage(`registerFetchTask():Register task:${FETCH_TASKNAME}`);

      await BackgroundFetch.registerTaskAsync(FETCH_TASKNAME, options);
      if (Platform.OS == 'ios') {
        console.log("registerFetchTask():(iOS)Setting interval to", INTERVAL);
        Sentry.captureMessage(`registerFetchTask():(iOS)Setting interval to:${INTERVAL}`);
        await BackgroundFetch.setMinimumIntervalAsync(INTERVAL);
      }

      var tasks = await TaskManager.getRegisteredTasksAsync();
      console.log("registerFetchTask():Registered tasks:", tasks);
      Sentry.captureMessage(`registerFetchTask():Registered tasks:${JSON.stringify(tasks)}`);

    }
  }
}