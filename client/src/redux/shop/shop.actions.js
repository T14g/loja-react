import ShopActionTypes from './shop.types';

import { firestore, convertCollectionsSnapshotToMap } from  '../../firebase/firebase.utils';

//Redux thunk will dispatch a function instead of an object, the middleware willl
//call that function with dispatch method itself as the first argument

export const fetchCollectionsStart = () => ({
    type: ShopActionTypes.FETCH_COLLECTIONS_START
});

export const fecthCollectionsSuccess = collectionsMap => ({
    type: ShopActionTypes.FETCH_COLLECTIONS_SUCCESS,
    payload: collectionsMap
});

export const fetchCollectionFailure = errorMessage => ({
    type: ShopActionTypes.FETCH_COLLECTIONS_FAILURE,
    payload: errorMessage
});

export const fetchCollectionsStartAsync = () => {
    return dispatch => {
        const collectionRef = firestore.collection('collections');
        //dispatch action switching isFetching to true
        dispatch(fetchCollectionsStart);


        // sempre que collectionRef update ou esse código rodar pela 1 vez
        // snapshot => docs = array com os queryDocuments
        collectionRef.get().then(snapshot => {
            const collectionsMap = convertCollectionsSnapshotToMap(snapshot);

            dispatch(fecthCollectionsSuccess(collectionsMap));

            //Old
            // updateCollections(collectionsMap);

            //após load o conteúdo remover o loading
            // this.setState({ loading: false});
        }).catch( error => dispatch( fetchCollectionFailure(error.message)));
    }
}

