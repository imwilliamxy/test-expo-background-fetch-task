'use strict';

import {
  createStore,
  applyMiddleware,
} from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension'
import { persistStore, persistReducer } from 'redux-persist'
// import storage from 'redux-persist/lib/storage'
import AsyncStorage from '@react-native-community/async-storage';
// import { createLogger, logger } from "redux-logger";

import reducers from './reducers/index';

// redux saga
import createSagaMiddleware from 'redux-saga';
// middleware
const sagaMiddleware = createSagaMiddleware();
import rootSaga from './sagas/index';

const persistConfig = {
  key: 'root',
  // storage,
  storage: AsyncStorage, 
  timeout: null,
  blacklist: [],
}

// const persistedReducer = persistReducer(persistConfig, reducers);

const store = createStore(
  // reducers,
  persistReducer(persistConfig, reducers),
  composeWithDevTools(
    applyMiddleware(sagaMiddleware),
    // applyMiddleware(sagaMiddleware,createLogger({collapsed:true})),
    // other store enhancers if any
  )
  // applyMiddleware(sagaMiddleware,createLogger({collapsed:true})),
  // applyMiddleware(sagaMiddleware,),
);
sagaMiddleware.run(rootSaga);

const persistor = persistStore(store);
export default store;
export { persistor };
