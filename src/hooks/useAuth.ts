"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

const ADMIN_UID = process.env.NEXT_PUBLIC_ADMIN_UID;

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAdmin: false,
    loading: true,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setState({
        user,
        isAdmin: user?.uid === ADMIN_UID,
        loading: false,
      });
    });

    return () => unsubscribe();
  }, []);

  return state;
}
