import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, provider } from "./firebase";
import Notes from "./components/Notes";

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => setUser(user));
  }, []);

  const loginGoogle = async () => {
    await signInWithPopup(auth, provider);
  };

  const loginEmail = async () => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const registerEmail = async () => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  if (!user) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Notesy</h1>
        <button onClick={loginGoogle}>Login with Google</button>
        <div>
          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button onClick={loginEmail}>Login with Email</button>
        <button onClick={registerEmail}>Register</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Hello, {user.email}</h2>
      <button onClick={logout}>Logout</button>
      <Notes user={user} />
    </div>
  );
};

export default App;
