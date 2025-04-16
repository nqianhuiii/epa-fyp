import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBTilz3vhUspawVHULlbdFfAh4wDBukEnE",
  authDomain: "epa-fyp-5ffeb.firebaseapp.com",
  projectId: "epa-fyp-5ffeb",
  storageBucket: "epa-fyp-5ffeb.appspot.com",
  messagingSenderId: "444616892950",
  appId: "1:444616892950:web:563e9c646783afe1cb0b37"
};

const app = initializeApp(firebaseConfig);

// so that the session can persist after restart
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
}); 

// initialize firestore database
const db = getFirestore(app);

export {auth, db};
