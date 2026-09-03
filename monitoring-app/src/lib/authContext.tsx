"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "./firebase";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  User as FirebaseUser
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

type Role = "admin" | "user" | null;

interface UserProfile {
  uid: string;
  email: string;
  role: Role;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string,role: Role) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && firebaseUser.email) {
        // Fetch role from Firestore
        try {
          const docRef = doc(db, "users", firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          
          let role: Role = "user";
          if (docSnap.exists()) {
            role = docSnap.data().role as Role;
          } else {
            // If document doesn't exist, create it (fallback)
            await setDoc(docRef, { email: firebaseUser.email, role: "user" });
          }

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            role,
          });
        } catch (error) {
          console.error("Error fetching user role:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string, role: Role) => {
    try {
      setLoading(true);
      let userCredential;
      try {
        // Try to sign in first
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } catch (error: any) {
        // If user not found, create one (useful for this simulation phase)
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
            userCredential = await createUserWithEmailAndPassword(auth, email, password);
        } else {
            throw error;
        }
      }

      if (userCredential && userCredential.user) {
         // Update or set role in Firestore to ensure it matches what was requested
         // Note: In a real app, users shouldn't be able to just "choose" their role like this.
         // This is purely for the mock/development UI you requested.
         await setDoc(doc(db, "users", userCredential.user.uid), {
            email: userCredential.user.email,
            role: role
         }, { merge: true });
         
         router.push("/dashboard");
      }
    } catch (error: any) {
      alert("Login gagal: " + error.message);
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
