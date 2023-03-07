import { initializeApp } from "firebase/app"
import { enableIndexedDbPersistence, getFirestore } from 'firebase/firestore'

// Config from my firebase app I created
const firebaseConfig = {
    apiKey: "AIzaSyBn1LdWi3GhrSNqT919ZsI-0aIBST812zA",
    authDomain: "todo-dane.firebaseapp.com",
    projectId: "todo-dane",
    storageBucket: "todo-dane.appspot.com",
    messagingSenderId: "288990996085",
    appId: "1:288990996085:web:4c0bdd5ec5482d3dd33a3c",
    measurementId: "G-MJQPNS0W3C"
  };

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
enableIndexedDbPersistence(db)
export {db}