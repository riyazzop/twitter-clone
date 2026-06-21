"use client";

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebase";

import axiosInstance from "@/lib/axiosInstance";

interface User {
  _id: string;
  username: string;
  name: string;
  avatar: string;
  bio?: string;
  website?:string
  joinedDate: string;
  email:string
  location?:string
}
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    eail: string,
    password: string,
    username: string,
    name: string,
  ) => Promise<void>;
  updateProfile: (profileData: {
    name: string;
    bio: string;
    location: string;
    website: string;
    avatar:string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  isloading: boolean;
  googleSignIn: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isloading, setIsLoading] = useState(false);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseuser) => {
      if (firebaseuser?.email) {
        try {
          const res = await axiosInstance.get("/loggedinuser", {
            params: { email: firebaseuser.email },
          });
          if (res.data) {
            setUser(res.data);
            localStorage.setItem("twitter-user", JSON.stringify(res.data));
          }
          setIsLoading(false);
        } catch (error: any) {
          // 404 means user is in Firebase but not yet in MongoDB.
          // This happens during googleSignIn before registration completes — ignore it.
          if (error?.response?.status !== 404) {
            console.error(error);
          }
          setIsLoading(false);
        }
      }
    });
    return () => unsubscribe();
  }, []);
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const usercred = await signInWithEmailAndPassword(auth, email, password);
    const firebaseuser = usercred.user;
    const res = await axiosInstance.get("/loggedinuser", {
      params: { email: firebaseuser.email },
    });
    if (res.data) {
      localStorage.setItem("twitter-user",JSON.stringify( res.data));
      setUser(res.data);
    }

    // setUser();
    // localStorage.setItem("user", JSON.stringify());
    setIsLoading(false);
  };
  const signup = async (
    email: string,
    password: string,
    username: string,
    name: string,
  ) => {
    setIsLoading(true);
    const usercred = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    const user = usercred.user;
    const newuser: any = {
      username,
      name,
      avatar: user.photoURL || "",
      email,
    };
    console.log(user);
    const res=await axiosInstance.post("/register",newuser )
    if (res.data) {
      localStorage.setItem("twitter-user", JSON.stringify(res.data));
      setUser(res.data);
    }
 
    setIsLoading(false);
  };
  const logout = async () => {
    setUser(null);
    await signOut(auth);
    localStorage.removeItem("user");
  };
  const updateProfile = async (profileData: {
    name: string;
    bio: string;
    location: string;
    website: string;
  }) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(() => 1000));
    const updatedUser = {
      ...user,
      ...profileData,
    };
    const res=await axiosInstance.patch(`/userupdate/${user?.email}`)
    if (res.data) {
      localStorage.setItem("twitter-user", JSON.stringify(res.data));
      setUser(res.data);
    }
    setUser(updatedUser as User);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setIsLoading(false);
  };
  const googleSignIn = async () => {
    setIsLoading(true);
    const googlesignin = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, googlesignin);
    const firebaseuser = result.user;
    if (firebaseuser.email) {
      try {
        // Try to fetch existing user from MongoDB
        const res = await axiosInstance.get("/loggedinuser", {
          params: { email: firebaseuser.email },
        });
        if (res.data) {
          localStorage.setItem("twitter-user", JSON.stringify(res.data));
          setUser(res.data);
        }
      } catch (error: any) {
        if (error?.response?.status === 404) {
          // New Google user — register them in MongoDB
          const newuser = {
            username: firebaseuser.email.split("@")[0],
            name: firebaseuser.displayName,
            avatar: firebaseuser.photoURL || "",
            email: firebaseuser.email,
          };
          const registerRes = await axiosInstance.post("/register", newuser);
          if (registerRes.data) {
            localStorage.setItem("twitter-user", JSON.stringify(registerRes.data));
            setUser(registerRes.data);
          }
        } else {
          throw error; // re-throw unexpected errors
        }
      }
    }
    setIsLoading(false);
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        updateProfile,
        isloading,
        googleSignIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
