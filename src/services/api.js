import axios from "axios";

// ======================================================
// CareerOS API Client
// ======================================================

const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "https://career-os-api-1h85.onrender.com/api";

const api = axios.create({
    baseURL: API_BASE_URL,

    headers: {
        "Content-Type": "application/json",
    },
});

// ======================================================
// FIREBASE AUTHENTICATION
// ======================================================
//
// Firebase provides the authenticated user's ID token.
//
// The token is sent to the backend using the standard
// Authorization header:
//
// Authorization: Bearer <Firebase ID token>
//
// The user's UID is NOT sent through x-user-id.
// The backend extracts the verified UID from req.user.uid.
//
// ======================================================

api.interceptors.request.use(
    async (config) => {
        try {
            const { auth } =
                await import("../firebase/firebase");

            const currentUser =
                auth.currentUser;

            if (currentUser) {
                const token =
                    await currentUser.getIdToken();

                config.headers =
                    config.headers || {};

                config.headers.Authorization =
                    `Bearer ${token}`;
            }
        } catch (error) {
            console.error(
                "API Firebase authentication error:",
                error
            );
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ======================================================
// DEFAULT EXPORT
// ======================================================

export default api;