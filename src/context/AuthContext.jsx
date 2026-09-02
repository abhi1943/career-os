
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

// ======================================================
// CAREEROS API BASE URL
// ======================================================

const RAW_API_URL =
    import.meta.env.VITE_API_URL ||
    "https://career-os-api-1h85.onrender.com/api";

const API_BASE_URL =
    RAW_API_URL
        .replace(/\/+$/, "")
        .replace(/\/api$/i, "") +
    "/api";

// ======================================================
// AUTH PROVIDER
// ======================================================

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
                     * Warm the backend job store immediately
                     * after Firebase authentication succeeds.
                     *
                     * Authentication must NOT fail if warming
                     * has an error.
                     */
                    if (currentUser) {
                        try {
                            const response =
                                await fetch(
                                    `${API_BASE_URL}/jobs/warm`
                                );

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

    // ======================================================
    // LOGOUT
    // ======================================================

    const logout = async () => {
        await signOut(auth);
    };

    // ======================================================
    // AUTH CONTEXT VALUE
    // ======================================================

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

// ======================================================
// USE AUTH HOOK
// ======================================================

export function useAuth() {
    return useContext(AuthContext);
}

