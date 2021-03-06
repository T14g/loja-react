import { createStore, applyMiddleware } from 'redux';
import { persistStore } from 'redux-persist';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

import  rootSaga from './root-saga';

import rootReducer from './root.reducer';


const sagaMiddleWare = createSagaMiddleware();

const middlewares = [sagaMiddleWare];

if(process.env.NODE_ENV === 'development'){
    middlewares.push(logger);
}

//store 
const store = createStore(rootReducer, applyMiddleware(...middlewares));

//Here you will pass each individual saga
sagaMiddleWare.run(rootSaga);

 //store version with persistence
const persistor = persistStore(store);

export { store , persistor };
