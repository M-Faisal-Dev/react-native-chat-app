import React, { createContext, useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(currentUser => {
      if (currentUser && currentUser.emailVerified) {
        setUser(currentUser);
      } else {
        setUser(null);
      }

      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, []);

  const login = (email, password) =>
    auth().signInWithEmailAndPassword(email, password);

  const logout = () => auth().signOut();

  const register = (email, password) =>
    auth().createUserWithEmailAndPassword(email, password);

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, logout, register }} // ✅ setUser added here
    >
      {!initializing && children}
    </AuthContext.Provider>
  );
};
