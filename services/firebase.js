// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAAUn54q2msTE4nOAlbpIK1--Zt1MhUcMo',
  projectId: 'chat-app-cbda3',
  appId: '1:338833728433:android:8bb93e2127841ca0025390',
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
