import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';



const config = {
    apiKey: "AIzaSyDenge5o74MZQjWq6WZg4iCMIDHYvGQz34",
    authDomain: "loja-db-99c0f.firebaseapp.com",
    databaseURL: "https://loja-db-99c0f.firebaseio.com",
    projectId: "loja-db-99c0f",
    storageBucket: "loja-db-99c0f.appspot.com",
    messagingSenderId: "276973792433",
    appId: "1:276973792433:web:c2ea22d9f080989d5d0690"
};


export const createUserProfileDocument = async (userAuth, additionalData) => {
    if(!userAuth) return;//doest nothing

    //query a db por um doccument reference object
    //ver se existe
    const userRef = firestore.doc(`users/${userAuth.uid}`);

    //get the snapshot object, mesmo que não exista retorna algo
    const snapeShot = await userRef.get();

    //Check if there is data in that place if not, so create
    if(!snapeShot.exists){
        const { displayName, email } = userAuth;
        const createdAt = new Date();//js object current date and time when this was created

        //Because assyncronous request
        //set() => create document using those props of the object
        try {
            await userRef.set({
                displayName,
                email,
                createdAt,
                ...additionalData
            })
        }catch (error) {
            console.log('Error creating user', error.message);
        }
    }

    return userRef;
}

export const addCollectionAndDocuments = async (collectionKey, objectsToAdd) => {
    //Return a ref no mather what
    const collectionRef = firestore.collection(collectionKey);

    //All or nothing = batch
    const batch = firestore.batch();

    objectsToAdd.forEach(obj => {
        //return new unique objects with unique keys, one for each obj, random unique id 
        const newDocRef = collectionRef.doc();
        
        //Will take each item into the batch
        batch.set(newDocRef, obj);
    });

    //Fires the batch and return  a promisse, void if success
    return await batch.commit();

}

//will convert/transform the snapshot object into the right object with rooting name 

export const convertCollectionsSnapshotToMap = (collections) => {
    

    //o objecto retornado tem aquele shape, routeName, id + title e items
    const transformedCollection = collections.docs.map(doc => {
        const { title, items} = doc.data();

        return {
            routeName : encodeURI(title.toLowerCase()),
            id: doc.id,
            title,
            items
        }
    });


    //O primeiro objecto vazio {}
    //pega o objecto transformed collection, usando o título da coleção => data da coleção
    //adiciona no accumulator cada um desta maneira teremos um objecto onde titulo => data
    return transformedCollection.reduce((accumulator, collection) => {
        accumulator[collection.title.toLowerCase()] = collection;
        return accumulator;
    }, {});
}


firebase.initializeApp(config);

//Will unsubscribe imediatly after getting  userAuth 
export const getCurrentUser = () => {
    return new Promise((resolve,reject) => {
        const unsubscribe = auth.onAuthStateChanged(userAuth => {
            unsubscribe();
            resolve(userAuth)
        }, reject)
    })
};

export const auth = firebase.auth();
export const firestore = firebase.firestore();

//Google auth
export const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' }); //Always trigger google pop-up when using Google provider
export const signInWithGoogle = () => auth.signInWithPopup(googleProvider);

export default firebase;