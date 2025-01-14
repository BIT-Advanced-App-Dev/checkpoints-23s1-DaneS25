import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, signInWithGoogle, db } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./login.css";
import { doc, setDoc, getDoc, collection } from "firebase/firestore";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      return;
    }
    if (user) {
      navigate("/Home");
    }
  }, [user, loading, navigate]);

  const handleLogin = async () => {
    try {
      await logInWithEmailAndPassword(email, password);
  
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
    
        if (!userDoc.exists()) {
          // Create a user document if it doesn't exist
          await setDoc(userDocRef, {
            email: user.email,
            uid: user.uid,
            name: user.name,
            authProvider: "local"
          });
    
          // Create a tasks subcollection under the user document
          await setDoc(collection(db, "users", auth.currentUser.uid, "tasks"), {
          });
        }
    
        navigate("/Home");
      }

    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="login">
      <div className="login__container">
      <p className="loginHead">Login</p>
        <input
          type="text"
          className="login__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="login__textBox"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button className="login__btn" onClick={handleLogin}>
          Login
        </button>
        <button className="login__btn login__google" onClick={signInWithGoogle}>
          Login with Google
        </button>
        <div>
          <Link to="/reset">Forgot Password</Link>
        </div>
        <div>
          Don't have an account? <Link to="/register">Register</Link> now.
        </div>
      </div>
    </div>
  );
}

export default Login;
