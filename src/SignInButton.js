import { getAuth, signInAnonymously, signOut } from "firebase/auth";
import { useState } from 'react';
import './signIn.css';

function SignInButton() {
  const [user, setUser] = useState(null);

  const auth = getAuth();

  const handleSignIn = () => {
    signInAnonymously(auth)
      .then((userCredential) => {
        const user = userCredential.user;
        setUser(user);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (user) {
    return (
      <button className="signInButton" onClick={handleSignOut}>Sign out</button>
    );
  } else {
    return (
      <button className="signInButton" onClick={handleSignIn}>Sign in</button>
    );
  }
}

export default SignInButton;