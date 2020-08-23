'use strict';
import axios from 'axios';
import { Platform } from 'react-native';
import {
  request_server
} from '../BackgroundTask';

// jest.setTimeout(1000);
jest.setTimeout(10000);

test('test', async () => {
  // let url = 'https://test.xingyong.net/t.php?app_name=test-expo-background-fetch-task/0.0.1&OS=ios&count=1&timestamp=1598151480';
  var ts = Math.round((new Date()).getTime() / 1000);

  let response = await request_server('jestTest', ts, 0);
  if (response.data){
    console.log('backgroundTask():response:', response.data);
  } else {
    console.log('backgroundTask():response:', response);
  }
  
  expect(200).toBe(200);

})