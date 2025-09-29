
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User, signInAnonymously } from 'firebase/auth';
import { useAuth as useFirebaseAuth } from '@/firebase'; // Importer le hook depuis la nouvelle structure

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
  
  // Utiliser le hook d'authentification fourni par la nouvelle structure Firebase
  const auth = useFirebaseAuth();

  useEffect(() => {
    // S'assurer que l'instance d'authentification est prête avant de s'abonner
    if (!auth) {
        setLoading(true);
        return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        // Si aucun utilisateur n'est connecté, on tente une connexion anonyme
        // pour permettre l'accès aux données publiques comme les produits.
        signInAnonymously(auth).catch((error) => {
          console.error("Anonymous sign-in failed:", error);
          // Même en cas d'échec, on arrête le chargement pour ne pas bloquer l'UI.
          setUser(null);
          setLoading(false);
        });
      }
    });

    return () => unsubscribe();
  }, [auth]); // L'effet dépend maintenant de l'instance `auth` fournie par le hook

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
