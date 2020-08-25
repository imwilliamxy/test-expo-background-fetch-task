import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector, useStore } from 'react-redux';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

import {
  startGenerateForumKeypairAction,
  startForumAuthAction,
} from '../actions/forumActions';

export default function TabOneScreen() {
  const dispatch = useDispatch();
  function onLoginBtnPress() {
    console.log('login button pressed.');
    dispatch(startForumAuthAction());
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <TouchableOpacity>
        <Button
          title={'login'}
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
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
