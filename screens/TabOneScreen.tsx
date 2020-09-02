import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector, useStore } from 'react-redux';
import * as Updates from 'expo-updates';
import * as Sentry from 'sentry-expo';


import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

import { RELEASE_STRING } from '../constants/Constants';

import {
  startGenerateForumKeypairAction,
  startForumAuthAction,
} from '../actions/forumActions';

export default function TabOneScreen() {
  const dispatch = useDispatch();
  // const store = useStore();
  const { foruminfo } = useSelector(state => ({
    foruminfo: state.foruminfo,
  }));


  const [haveNewVersion, setHaveNewVersion] = useState(false);
  function onLoginBtnPress() {
    console.log('login button pressed.');
    if (foruminfo.authToken.length == 0) {
      dispatch(startForumAuthAction());
    }
    
  }

  useEffect(()=>{
    console.log('TabOneScreen():RELEASE_STRING:', RELEASE_STRING);
    console.log('TabOneScreen():foruminfo:', foruminfo);
  });

  async function onBtnCheckVersionPress() {
    try {
      Sentry.captureMessage("onBtnCheckVersionPress():check new version.");
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        // await Updates.fetchUpdateAsync();
        // ... notify user of update ...
        // await Updates.reloadAsync();
        Sentry.captureMessage("onBtnCheckVersionPress():found new version.");
        setHaveNewVersion(true);
      } else {
        Sentry.captureMessage("onBtnCheckVersionPress():NO new version.");
      }
    } catch (e) {
      // handle or log error
      console.log('onBtnCheckVersionPress():err:',e);
    }
  }

  async function onBtnUpdatePress() {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        setHaveNewVersion(true);
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (e) {
      // handle or log error
      console.error('onBtnCheckVersionPress():err:',e);
    }
  }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <Text style={styles.commonText}>{RELEASE_STRING}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <TouchableOpacity>
        <Button
          title={'Check new version.'}
          onPress={() => {
            onBtnCheckVersionPress();
          }}
        />
      </TouchableOpacity>
      <Text style={styles.commonText}>{haveNewVersion ? 'Have new version' : "NO new Version"}</Text>
      <TouchableOpacity>
        <Button
          title={'Update'}
          onPress={() => {
            onBtnUpdatePress();
          }}
        />
      </TouchableOpacity>

      <TouchableOpacity>
        <Button
          title={foruminfo.authToken.length>10 ? 'already login' : 'Start login'}
          onPress={() => {
            onLoginBtnPress();
          }}
        />
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  commonText: {
    fontSize: 14,
    // fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
