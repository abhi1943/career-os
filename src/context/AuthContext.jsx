/* eslint-disable react-refresh/only-export-components */

import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    onAuthStateChanged,
    signOut,
} from "firebase/auth";

import { auth } from "../firebase/firebase";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] =
        useState(null);

    const [authLoading, setAuthLoading] =
        useState(true);

    useEffect(() => {
        const unsubscribe =
            onAuthStateChanged(
                auth,
                (currentUser) => {
                    setUser(currentUser);
                    setAuthLoading(false);
                }
            );

        return unsubscribe;
    }, []);

    const logout = async () => {
        await signOut(auth);
    };

    const value = {
        // Firebase authenticated user
        user,

        // Authentication state
        isAuthenticated: Boolean(user),

        // Loading state while Firebase
        // checks the current session
        authLoading,

        // Convenient user information
        userId: user?.uid || null,

        userEmail: user?.email || null,

        // Centralized logout
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
