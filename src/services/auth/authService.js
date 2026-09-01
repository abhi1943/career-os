// ======================================================
// CareerOS Authentication Service
// ======================================================

import {
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";

import {
    auth,
} from "../firebase/firebase";

// ======================================================
// REGISTER
// ======================================================

export async function register(
    email,
    password
) {
    try {
        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email.trim(),
                password
            );

        return {
            success: true,
            user: userCredential.user,
        };
    } catch (error) {
        console.error(
            "CareerOS registration error:",
            error
        );

        return {
            success: false,
            code: error?.code,
            message:
                getAuthErrorMessage(
                    error?.code
                ),
        };
    }
}

// ======================================================
// LOGIN
// ======================================================

export async function login(
    email,
    password
) {
    try {
        const userCredential =
            await signInWithEmailAndPassword(
                auth,
                email.trim(),
                password
            );

        return {
            success: true,
            user: userCredential.user,
        };
    } catch (error) {
        console.error(
            "CareerOS login error:",
            error
        );

        return {
            success: false,
            code: error?.code,
            message:
                getAuthErrorMessage(
                    error?.code
                ),
        };
    }
}

// ======================================================
// LOGOUT
// ======================================================

export async function logout() {
    try {
        await signOut(auth);

        return {
            success: true,
        };
    } catch (error) {
        console.error(
            "CareerOS logout error:",
            error
        );

        return {
            success: false,
            code: error?.code,
            message:
                getAuthErrorMessage(
                    error?.code
                ),
        };
    }
}

// ======================================================
// PASSWORD RESET
// ======================================================

export async function resetPassword(
    email
) {
    try {
        await sendPasswordResetEmail(
            auth,
            email.trim()
        );

        return {
            success: true,
        };
    } catch (error) {
        console.error(
            "CareerOS password reset error:",
            error
        );

        return {
            success: false,
            code: error?.code,
            message:
                getAuthErrorMessage(
                    error?.code
                ),
        };
    }
}

// ======================================================
// FIREBASE ERROR MESSAGES
// ======================================================

function getAuthErrorMessage(
    code
) {
    switch (code) {
        case "auth/email-already-in-use":
            return (
                "An account already exists with this email address."
            );

        case "auth/invalid-email":
            return (
                "Please enter a valid email address."
            );

        case "auth/weak-password":
            return (
                "Password should be at least 6 characters."
            );

        case "auth/invalid-credential":
            return (
                "Incorrect email or password. Please try again."
            );

        case "auth/wrong-password":
            return (
                "Incorrect password. Please try again."
            );

        case "auth/user-not-found":
            return (
                "No account was found with this email address."
            );

        case "auth/user-disabled":
            return (
                "This account has been disabled."
            );

        case "auth/too-many-requests":
            return (
                "Too many requests. Please try again later."
            );

        case "auth/network-request-failed":
            return (
                "Network error. Please check your internet connection."
            );

        case "auth/operation-not-allowed":
            return (
                "This authentication method is currently disabled."
            );

        default:
            return (
                "Something went wrong. Please try again."
            );
    }
}