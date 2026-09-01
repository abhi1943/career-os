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
                async (currentUser) => {
                    setUser(currentUser);

                    /*
                     * Step 3:
                     * Warm the backend job store immediately
                     * after Firebase authentication succeeds.
                     *
                     * Authentication should NOT fail if warming
                     * has an error, so the request is intentionally
                     * handled independently.
                     */
                    if (currentUser) {
                        try {
                            const response =
                                await fetch("/api/jobs/warm");

                            if (!response.ok) {
                                throw new Error(
                                    `Job warm request failed: ${response.status}`
                                );
                            }

                            const data =
                                await response.json();

                            console.log(
                                "[CareerOS] Job store warm:",
                                data
                            );
                        } catch (error) {
                            console.error(
                                "[CareerOS] Failed to warm job store:",
                                error
                            );
                        }
                    }

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