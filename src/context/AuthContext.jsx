
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
//
// Vercel environment variable:
// VITE_API_URL
//
// Expected value:
// https://career-os-api-1h85.onrender.com/api
//
// If VITE_API_URL is not configured, use Render directly.
// ======================================================

const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "https://career-os-api-1h85.onrender.com/api";

// ======================================================
// AUTH PROVIDER
// ======================================================

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    const [authLoading, setAuthLoading] =
        useState(true);

    useEffect(() => {
        const unsubscribe =
            onAuthStateChanged(
                auth,
                async (currentUser) => {
                    setUser(currentUser);

                    // ==================================================
                    // WARM JOB STORE
                    // ==================================================
                    //
                    // Authentication must NOT fail if the warm request
                    // fails. Therefore this is completely isolated from
                    // Firebase authentication.
                    // ==================================================

                    if (currentUser) {
                        try {
                            const warmUrl =
                                `${API_BASE_URL}/jobs/warm`;

                            console.log(
                                "[CareerOS] Warming job store:",
                                warmUrl
                            );

                            const response =
                                await fetch(warmUrl, {
                                    method: "GET",
                                    headers: {
                                        Accept:
                                            "application/json",
                                    },
                                    cache: "no-store",
                                });

                            if (!response.ok) {
                                throw new Error(
                                    `Job warm request failed: ${response.status} ${response.statusText}`
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
