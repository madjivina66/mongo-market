
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User, signInAnonymously, Auth } from 'firebase/auth';
import { useAuth as useFirebaseAuthHook } from '@/firebase'; 

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signup: (email: string, password: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const auth: Auth | null = useFirebaseAuthHook();

  useEffect(() => {
    if (!auth) {
        setLoading(true);
        return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        // Tente une connexion anonyme, mais ne bloque pas le chargement
        signInAnonymously(auth).catch((error) => {
          console.error("Anonymous sign-in failed:", error);
          setUser(null); // S'assure que l'utilisateur est null en cas d'échec
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const signup = (email: string, password: string) => {
    if (!auth) return Promise.reject(new Error("Firebase Auth not initialized"));
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email: string, password: string) => {
    if (!auth) return Promise.reject(new Error("Firebase Auth not initialized"));
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    if (!auth) return Promise.reject(new Error("Firebase Auth not initialized"));
    return signOut(auth);
  };

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
