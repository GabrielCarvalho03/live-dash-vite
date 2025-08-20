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

// import { initializeApp } from "firebase/app";
// import { getDatabase } from "firebase/database";

// const firebaseConfig = {
//   apiKey: "AIzaSyAJf9AgXRLsBhiK_vlxEG8J6NDHLFb8Qb8",
//   authDomain: "financas-bfc03.firebaseapp.com",
//   databaseURL: "https://financas-bfc03-default-rtdb.firebaseio.com",
//   projectId: "financas-bfc03",
//   storageBucket: "financas-bfc03.appspot.com",
//   messagingSenderId: "450595661980",
//   appId: "1:450595661980:web:dfd9613010bed3adbd6559",
//   measurementId: "G-B8EDLP3DF7",
// };

// const app = initializeApp(firebaseConfig);
// export const db = getDatabase(app);
