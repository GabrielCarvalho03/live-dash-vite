import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// Se quiser usar analytics, pode manter:
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDbhFfjKWrIWz_EEmiXfrmJ69Z_ab7utSY",
  authDomain: "finance-350fb.firebaseapp.com",
  databaseURL: "https://finance-350fb-default-rtdb.firebaseio.com",
  projectId: "finance-350fb",
  storageBucket: "finance-350fb.appspot.com", // Corrigido!
  messagingSenderId: "209660527764",
  appId: "1:209660527764:web:4723545dd1925fd193a081",
  measurementId: "G-GG8192BVZC",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const analytics = getAnalytics(app);

export { app, db, analytics };
