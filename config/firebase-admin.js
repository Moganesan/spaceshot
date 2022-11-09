import firebase from "firebase-admin";
import serviceAccount from "../config/serviceAccount.json";

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://spaceshot-56d18-default-rtdb.firebaseio.com/",
});

export default firebase;
