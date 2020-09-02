import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as StoreProvider } from 'react-redux';
// import { Provider as PaperProvider } from 'react-native-paper';
import { PersistGate } from 'redux-persist/integration/react';
import * as Sentry from 'sentry-expo';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

import { registerFetchTask } from './libs/BackgroundTask';

import store from './store';
import { persistor } from './store';

import { RELEASE_STRING } from './constants/Constants';

Sentry.init({
  dsn: 'https://6b092c1ba93a4b789448cf2ffa85f6c7@o177318.ingest.sentry.io/5414179',
  enableInExpoDevelopment: true,
  debug: true,
  release: RELEASE_STRING,
});

Sentry.captureMessage("after Sentry inited.");

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
