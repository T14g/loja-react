import { createStore, applyMiddleware } from 'redux';
import { persistStore } from 'redux-persist';
import logger from 'redux-logger';

import rootReducer from './root.reducer';

const middlewares = [logger];

//store
const store = createStore(rootReducer, applyMiddleware(...middlewares));

 //store version with persistence
const persistor = persistStore(store);

export { store , persistor };
