import axios from "axios";

// ======================================================
// CareerOS API Client
// ======================================================

const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";

const api = axios.create({
    baseURL: API_BASE_URL,

    headers: {
        "Content-Type": "application/json",
    },
});

// ======================================================
// ADD USER ID TO API REQUESTS
// ======================================================
//
// CareerOS currently uses the temporary x-user-id header
// until full backend authentication middleware is connected.
//
// Firebase provides the authenticated user's UID.
//
// ======================================================

api.interceptors.request.use(
    async (config) => {
        try {
            const { auth } = await import("../firebase/firebase");

            const currentUser = auth.currentUser;

            if (currentUser) {
                config.headers["x-user-id"] =
                    currentUser.uid;
            }
        } catch (error) {
            console.error(
                "API authentication header error:",
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