  
import axios from "axios";

// ======================================================
// CareerOS API Client
// ======================================================

const RAW_API_URL =
    import.meta.env.VITE_API_URL ||
    "https://career-os-api-1h85.onrender.com/api";

// Always normalize API URL to:
// https://career-os-api-1h85.onrender.com/api
const API_BASE_URL =
    RAW_API_URL
        .replace(/\/+$/, "")
        .replace(/\/api$/i, "") +
    "/api";

const api = axios.create({
    baseURL: API_BASE_URL,

    headers: {
        "Content-Type": "application/json",
    },
});

// ======================================================
// FIREBASE AUTHENTICATION
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
  
