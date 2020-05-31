import { takeLatest, put, all , call } from 'redux-saga/effects';

import UserActionTypes from './user.types';

import { SignInSuccess, SignInFailure } from './user.actions';

import { auth, googleProvider, createUserProfileDocument } from '../../firebase/firebase.utils';
 
//Give a user auth object, refactored as fuck
export function* getSnapshotFromUserAuth(userAuth) {
    const userRef = yield call(createUserProfileDocument, userAuth);
    const userSnapShot = yield userRef.get();
    yield put(SignInSuccess({id: userSnapShot.id, ...userSnapShot.data()}));
}

export function* signInWithGoogle() {

    //Any API CALL have a chance to fail so catch the error
    try{
        const { user } = yield auth.signInWithPopup(googleProvider);
        yield getSnapshotFromUserAuth(user);

    }catch(error) {
        yield put(SignInFailure(error));
    }

}

export function* signInWithEmail({ payload: {email, password}}){
    try{
        const { user } = yield auth.signInWithEmailAndPassword(email, password);
        yield getSnapshotFromUserAuth(user);

    }catch (error){
        put(SignInFailure(error));
    }
}

//Generator function listening to the last google sign in!
export function* onGoogleSignInStart(){
   yield takeLatest(UserActionTypes.GOOGLE_SIGN_IN_START, signInWithGoogle);
}

export function* onEmailSignInStart() {
    yield takeLatest(UserActionTypes.EMAIL_SIGN_IN_START, signInWithEmail);
}

export function* userSagas() {
    yield all([call(onGoogleSignInStart), call(onEmailSignInStart)]);
}