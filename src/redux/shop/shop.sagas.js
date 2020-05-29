//Listen to every action of a given type
import { takeLatest, call, put } from 'redux-saga/effects';

import ShopActionTypes from './shop.types';

import { firestore, convertCollectionsSnapshotToMap } from  '../../firebase/firebase.utils';

import { fecthCollectionsSuccess, fetchCollectionFailure } from './shop.actions'

//put dispatcher, saga effect for creating actions
//call chama função
//generators function must have yeld
//yield returns { value, done: bool}
//defer control in this point of execution, permite cancelar, caso demore tomar alguma ação//yield
 
export function* fetchCollectionsAsync() {
    try{
        const collectionRef = firestore.collection('collections');
        const snapshot = yield collectionRef.get();
        const collectionsMap = yield call(convertCollectionsSnapshotToMap, snapshot);
        yield put(fecthCollectionsSuccess(collectionsMap));
    }catch (error) {
        yield put(fetchCollectionFailure(error.message));
    }    
}

//Syntax antiga
export function* fetchCollectionsStart() {

    //Just resolve this, nothing more , yeld the result
    //Take latest  because in theory you just want API to fire 1 one
    //Best option here
    yield takeLatest(
        ShopActionTypes.FETCH_COLLECTIONS_START,
        fetchCollectionsAsync  
    );

}