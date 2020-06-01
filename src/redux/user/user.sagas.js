import { takeLatest, put, all , call } from 'redux-saga/effects';

import UserActionTypes from './user.types';

import { 
    SignInSuccess, 
    SignInFailure, 
    SignOutSuccess, 
    SignOutFailure ,
    SignUpFailure,
    SignUpSuccess
} from './user.actions';

import { auth, googleProvider, createUserProfileDocument, getCurrentUser } from '../../firebase/firebase.utils';
 
//Give a user auth object, refactored as fuck
export function* getSnapshotFromUserAuth(userAuth, additionalData) {
    const userRef = yield call(createUserProfileDocument, userAuth, additionalData);
    const userSnapShot = yield userRef.get();
    yield put(SignInSuccess({id: userSnapShot.id, ...userSnapShot.data()}));
}

export function* signOut() {
    try{
        yield auth.signOut();
        //after sign out is true
        yield put(SignOutSuccess());
    }catch(error) {
        put(SignOutFailure(error));
    }
}

export function* signUp({payload : { email, password, displayName}}) {
    try{
        const { user } = yield auth.createUserWithEmailAndPassword(email, password);
        yield put(SignUpSuccess({ user , additionalData : {displayName}}));
    }catch(error){
        yield put(SignUpFailure(error));
    }
}

export function* signInAfterSignUp({ payload: { user, additionalData }}) {
    yield getSnapshotFromUserAuth(user, additionalData);
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

export function* isUserAuthenticated() {
    try{
        const userAuth = yield getCurrentUser();
        if(!userAuth) return;
        yield getSnapshotFromUserAuth(userAuth);

    }catch(error) {
        yield put(SignInFailure(error))
    }
}

//Generator function listening to the last google sign in!
export function* onGoogleSignInStart(){
   yield takeLatest(UserActionTypes.GOOGLE_SIGN_IN_START, signInWithGoogle);
}

export function* onEmailSignInStart() {
    yield takeLatest(UserActionTypes.EMAIL_SIGN_IN_START, signInWithEmail);
}

export function* onCheckUserSession() {
    yield takeLatest(UserActionTypes.CHECK_USER_SESSION, isUserAuthenticated)
}

export function* onSignOutStart() {
    yield takeLatest(UserActionTypes.SIGN_OUT_START, signOut);
}

export function* onSignUpStart() {
    yield takeLatest(UserActionTypes.SIGN_UP_START, signUp);
}

export function* onSignUpSuccess() {
    yield takeLatest(UserActionTypes.SIGN_UP_SUCCESS, signInAfterSignUp);
}

export function* userSagas() {
    yield all([
        call(onGoogleSignInStart), 
        call(onEmailSignInStart), 
        call(onCheckUserSession),
        call(onSignOutStart),
        call(onSignUpStart),
        call(onSignUpSuccess)
    ]);
}