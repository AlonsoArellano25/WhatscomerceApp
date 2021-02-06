import firebase from 'firebase/app'

export const firebaseConfig = {
    apiKey: "AIzaSyCBVMY-GdGetdg-o_XqoyuBFpz-uNPqhog",
    authDomain: "whatscommerce-9b8e2.firebaseapp.com",
    projectId: "whatscommerce-9b8e2",
    storageBucket: "whatscommerce-9b8e2.appspot.com",
    messagingSenderId: "251388460791",
    appId: "1:251388460791:web:fcbf479f7cbd184990ddf2"
};
// Initialize Firebase
export const firebaseapp = firebase.initializeApp(firebaseConfig);