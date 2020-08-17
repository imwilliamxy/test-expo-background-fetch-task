import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { Platform } from 'react-native';

const FETCH_TASKNAME = 'test_task'
const INTERVAL = 10

// function runBackgroundSaga() {
//   console.log('task function is running');
//   return;
// }
var background_exec_count = 0;
TaskManager.defineTask(FETCH_TASKNAME, () => {
  try {
    var ts = Math. round((new Date()). getTime() / 1000);
    console.log(`backgroundTask():[${Platform.OS}][${ts}][${background_exec_count}] task function is running....`)
    background_exec_count += 1;
    const receivedNewData = true;// do your background fetch here
    return receivedNewData ? BackgroundFetch.Result.NewData : BackgroundFetch.Result.NoData;
  } catch (error) {
    console.log("backgroundTask():ask function run error:",error);
    return BackgroundFetch.Result.Failed;
  }
});
export async function registerFetchTask() {
  

  const status = await BackgroundFetch.getStatusAsync();
  console.log("registerFetchTask(): status:", status);
  // console.log("registerFetchTask():", BackgroundFetch.Status);
  switch (status) {
    case BackgroundFetch.Status.Restricted:
    case BackgroundFetch.Status.Denied:
      console.log("registerFetchTask():Background execution is disabled");
      return;
    case BackgroundFetch.Status.Available: {
      console.log("registerFetchTask():Background execution allowed");

      const options = Platform.OS =='android' ? {
        minimumInterval: INTERVAL, // in seconds
        startOnBoot: true,
        stopOnTerminate: false,
      } : {
        minimumInterval: INTERVAL, // in seconds
        startOnBoot: true,
        stopOnTerminate: false,
      };

      console.log("registerFetchTask():Register task:", FETCH_TASKNAME);
      await BackgroundFetch.registerTaskAsync(FETCH_TASKNAME, options);
      if (Platform.OS == 'ios') {
        console.log("registerFetchTask():(iOS)Setting interval to", INTERVAL);
        await BackgroundFetch.setMinimumIntervalAsync(INTERVAL);
      }

      var tasks = await TaskManager.getRegisteredTasksAsync();
      console.log("registerFetchTask():Registered tasks:", (tasks));

      // let tasks = await TaskManager.getRegisteredTasksAsync();
      // console.log("registerFetchTask():task:", tasks);
      // if (tasks.find(f => f.taskName === FETCH_TASKNAME) == null) {
      //   console.log("registerFetchTask():Registering task");

        
      // } else {
      //   console.log(`registerFetchTask():Task ${FETCH_TASKNAME} already registered, skipping`);
      //   if (Platform.OS == 'ios') {
      //     console.log("registerFetchTask():(iOS)Setting interval to", INTERVAL);
      //     await BackgroundFetch.setMinimumIntervalAsync(INTERVAL);
      //   }
      // }

      
    }
  }
}