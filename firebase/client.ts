import { initializeApp, getApp, getApps} from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCv6MdVGXh7B1nGbkuLLIQtRx6A0tMDm2Y",
    authDomain: "prepwise-bb341.firebaseapp.com",
    projectId: "prepwise-bb341",
    storageBucket: "prepwise-bb341.firebasestorage.app",
    messagingSenderId: "458348766146",
    appId: "1:458348766146:web:ae5dba5092e8070a7fac5b",
    measurementId: "G-JLG1FWM6PR"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) :getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);