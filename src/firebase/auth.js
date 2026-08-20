import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updateProfile,
} from "firebase/auth";

import {
    doc,
    setDoc,
    serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "./firebase";

// ======================================================
// SIGNUP
// ======================================================
//
// Creates Firebase Authentication user
// and stores CareerOS profile in Firestore.
//
// ======================================================

export async function signupUser(
    name,
    email,
    password
) {
    const userCredential =
        await createUserWithEmailAndPassword(
            auth,
            email.trim(),
            password
        );

    const user =
        userCredential.user;

    // --------------------------------------------------
    // Save display name in Firebase Auth
    // --------------------------------------------------

    await updateProfile(
        user,
        {
            displayName:
                name.trim(),
        }
    );

    // --------------------------------------------------
    // Save CareerOS user profile
    // --------------------------------------------------

    await setDoc(
        doc(
            db,
            "users",
            user.uid
        ),
        {
            uid:
                user.uid,

            name:
                name.trim(),

            email:
                user.email,

            createdAt:
                serverTimestamp(),

            updatedAt:
                serverTimestamp(),
        }
    );

    return user;
}

// ======================================================
// LOGIN
// ======================================================

export function loginUser(
    email,
    password
) {
    return signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
    );
}

// ======================================================
// PASSWORD RESET
// ======================================================

export function resetPassword(
    email
) {
    return sendPasswordResetEmail(
        auth,
        email.trim()
    );
}

// ======================================================
// LOGOUT
// ======================================================

export function logoutUser() {
    return signOut(auth);
}