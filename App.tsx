import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as StoreProvider } from 'react-redux';
// import { Provider as PaperProvider } from 'react-native-paper';
import { PersistGate } from 'redux-persist/integration/react';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

import { registerFetchTask } from './libs/BackgroundTask';

import store from './store';
import { persistor } from './store';

import { RELEASE_STRING } from './constants/Constants';

registerFetchTask();

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  useEffect(() => {
    console.log("App():useEffect():RELEASE_STRING:", RELEASE_STRING);
  }, [])

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <StoreProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaProvider>
            <Navigation colorScheme={colorScheme} />
            <StatusBar />
          </SafeAreaProvider>
        </PersistGate>
      </StoreProvider>
    );
  }
}
