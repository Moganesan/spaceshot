import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAMh9de76udmoVriU4mvjEkD4GEncAnmRY",
  authDomain: "spaceshot-56d18.firebaseapp.com",
  projectId: "spaceshot-56d18",
  storageBucket: "spaceshot-56d18.appspot.com",
  messagingSenderId: "613004289935",
  appId: "1:613004289935:web:053038e2aaaec5e1b6cdfa",
  measurementId: "G-8DWYP4RPHC",
  databaseURL: "https://spaceshot-56d18-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default app;

export { database, ref };
