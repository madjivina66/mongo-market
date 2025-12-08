
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User, signInAnonymously, Auth, GoogleAuthProvider, signInWithRedirect, getRedirectResult, getAdditionalUserInfo } from 'firebase/auth';
import { useAuth as useFirebaseAuthHook, useFirestore, setDocumentNonBlocking } from '@/firebase'; 
import { doc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';


interface AuthContextType {
  user: User | null;
  loading: boolean;
  signup: (email: string, password: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  loginWithGoogle: () => Promise<any>;
  logout: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const auth: Auth | null = useFirebaseAuthHook();
  const firestore = useFirestore();

  useEffect(() => {
    if (!auth || !firestore) {
        setLoading(true);
        return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
      setLoading(false);
    }, (error) => {
      console.error("Auth state change error:", error);
      setUser(null);
      setLoading(false);
    });

    // Gérer le résultat de la redirection après le rechargement de la page
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          const user = result.user;
          const additionalInfo = getAdditionalUserInfo(result);
          // Si c'est un nouvel utilisateur, on crée son profil dans Firestore
          if (additionalInfo?.isNewUser) {
              const userProfileRef = doc(firestore, "userProfiles", user.uid);
              const newUserProfile: Omit<UserProfile, 'id'> = {
                  name: user.displayName || 'Nouvel utilisateur',
                  email: user.email || '',
                  phone: user.phoneNumber || '',
                  address: { street: '', city: '', state: '', zip: '', country: '' },
                  isPro: false,
              };
              setDocumentNonBlocking(userProfileRef, newUserProfile, { merge: true });
          }
        }
      })
      .catch((error) => {
        console.error("Erreur de redirection Google:", error);
      })
      .finally(() => {
        // Dans tous les cas, s'assurer que l'état de chargement est faux
        // Et s'il n'y a toujours pas d'utilisateur, connecter anonymement.
        if (!auth.currentUser) {
            signInAnonymously(auth).catch((error) => {
                console.error("Anonymous sign-in failed on initial load:", error);
            });
        }
      });


    return () => unsubscribe();
  }, [auth, firestore]);

  const signup = (email: string, password: string) => {
    if (!auth) return Promise.reject(new Error("Firebase Auth not initialized"));
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email: string, password: string) => {
    if (!auth) return Promise.reject(new Error("Firebase Auth not initialized"));
    return signInWithEmailAndPassword(auth, email, password);
  };

  
  const loginWithGoogle = async () => {
    if (!auth) return Promise.reject(new Error("Firebase not initialized"));
    const provider = new GoogleAuthProvider();
    // Utiliser signInWithRedirect au lieu de signInWithPopup
    return signInWithRedirect(auth, provider);
  }
  

  const logout = () => {
    if (!auth) return Promise.reject(new Error("Firebase Auth not initialized"));
    // La déconnexion déclenchera onAuthStateChanged, qui connectera l'utilisateur anonymement.
    return signOut(auth);
  };

  const value = {
    user,
    loading,
    signup,
    login,
    loginWithGoogle,
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
