//Listen to every action of a given type
import { takeEvery } from 'redux-saga/effects';

import ShopActionTypes from './shop.types';

//generators function must have yeld
export function* fetchCollectionsAsync() {
    yield console.log('Im Fired!');
}

//Syntax antiga
export function* fetchCollectionsStart() {

    //Just resolve this, nothing more , yeld the result
    yield takeEvery(
        ShopActionTypes.FETCH_COLLECTIONS_START,
        fetchCollectionsAsync  
    );

}