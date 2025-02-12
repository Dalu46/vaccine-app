'use client';
import { create } from 'zustand';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { app } from '../../app/firebase/config';
import { useEffect } from 'react';

// Define the Auth State
interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

// Create the Auth Store
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }), // Automatically set loading to false when user is set
  setIsLoading: (isLoading) => set({ isLoading }),
}));

// Authentication Initialization Component
export const AuthInit = () => {
  const auth = getAuth(app);
  const setUser = useAuthStore((state) => state.setUser);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Update the user state
      setIsLoading(false); // Set loading state to false
    });

    // Cleanup on unmount
    return () => unsubscribe();
  }, [auth, setUser, setIsLoading]);

  return null; // This component renders nothing, it's just for initializing auth
};
