import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector, useStore } from 'react-redux';

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
  function onLoginBtnPress() {
    console.log('login button pressed.');
    if (foruminfo.authToken.length == 0) {
      dispatch(startForumAuthAction());
    }
    
  }

  useEffect(()=>{
    console.log('TabOneScreen():RELEASE_STRING:', RELEASE_STRING);
    console.log('TabOneScreen():foruminfo:', foruminfo);
  })
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <Text style={styles.commonText}>{RELEASE_STRING}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
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
