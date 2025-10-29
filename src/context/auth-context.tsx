
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User, signInAnonymously, Auth, GoogleAuthProvider, signInWithPopup, getAdditionalUserInfo } from 'firebase/auth';
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
    if (!auth) {
        setLoading(true);
        return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);
    }, (error) => {
      console.error("Auth state change error:", error);
      setUser(null);
      setLoading(false);
    });

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

  const loginWithGoogle = async () => {
    if (!auth || !firestore) return Promise.reject(new Error("Firebase not initialized"));
    const provider = new GoogleAuthProvider();
    
    try {
        const result = await signInWithPopup(auth, provider);
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
            // Utilise set avec merge: true pour créer ou écraser sans supprimer d'autres champs potentiels
            setDocumentNonBlocking(userProfileRef, newUserProfile, { merge: true });
        }
        return result;
    } catch (error) {
        // L'erreur sera gérée dans le composant qui appelle loginWithGoogle
        return Promise.reject(error);
    }
  }

  const logout = () => {
    if (!auth) return Promise.reject(new Error("Firebase Auth not initialized"));
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

    