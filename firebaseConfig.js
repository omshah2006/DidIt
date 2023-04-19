import { initializeApp } from 'firebase/app';

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyAorD2TFL2DSENSexGnuwtVIgieYDBaL5Y',
  authDomain: 'did-it-237f2.firebaseapp.com',
//   databaseURL: 'https://project-id.firebaseio.com',
  projectId: 'did-it-237f2',
  storageBucket: 'did-it-237f2.appspot.com',
//   messagingSenderId: 'sender-id',
  appId: 'app-1-525897641401-ios-cbf5f5e09649147be2da68',
//   measurementId: 'G-measurement-id',
};

const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
