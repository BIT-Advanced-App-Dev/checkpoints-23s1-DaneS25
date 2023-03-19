import { getAuth, signInAnonymously } from "firebase/auth";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBn1LdWi3GhrSNqT919ZsI-0aIBST812zA",
    authDomain: "todo-dane.firebaseapp.com",
    projectId: "todo-dane",
    storageBucket: "todo-dane.appspot.com",
    messagingSenderId: "288990996085",
    appId: "1:288990996085:web:4c0bdd5ec5482d3dd33a3c",
    measurementId: "G-MJQPNS0W3C"
};

firebase.initializeApp(firebaseConfig);

// Get the Auth object
const auth = getAuth();

// Sign in anonymously
signInAnonymously(auth)
  .then((userCredential) => {
    const user = userCredential.user;
    console.log("Signed in anonymously with user:", user);
    setUser(user);
    // Handle the signed-in user here
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // Handle errors here
  });