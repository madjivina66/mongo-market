
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
        // L'auth n'est pas encore prêt, on attend.
        setLoading(true);
        return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Met à jour l'utilisateur qu'il soit réel, anonyme ou null
      setLoading(false); // L'état d'auth est maintenant connu
    }, (error) => {
      console.error("Auth state change error:", error);
      setUser(null);
      setLoading(false);
    });

    // Si aucun utilisateur n'est détecté après un court délai, on tente une connexion anonyme.
    // Cela gère le cas où l'utilisateur ouvre l'app pour la première fois.
    if (!auth.currentUser) {
        signInAnonymously(auth).catch((error) => {
            console.error("Anonymous sign-in failed on initial load:", error);
        });
    }

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
