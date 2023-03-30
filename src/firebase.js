import { initializeApp } from "firebase/app"
import { GoogleAuthProvider, getAuth, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut } from "firebase/auth"
import { enableIndexedDbPersistence, getFirestore, query, getDocs, collection, where, addDoc, } from 'firebase/firestore'

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
const auth = getAuth(app);
const db = getFirestore(app)
enableIndexedDbPersistence(db)
const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const logout = () => {
  signOut(auth);
};
export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword, 
  registerWithEmailAndPassword, 
  sendPasswordReset, 
  logout, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail
  }