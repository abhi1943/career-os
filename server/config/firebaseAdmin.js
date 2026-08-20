// ======================================================
// CareerOS Firebase Admin
// ======================================================
//
// Responsibilities:
// - Initialize Firebase Admin SDK
// - Provide Firebase Admin Auth
//
// The backend uses this to verify Firebase ID tokens.
//
// ======================================================

const {
    initializeApp,
    applicationDefault,
    getApps,
} = require("firebase-admin/app");

const {
    getAuth,
} = require("firebase-admin/auth");

// ======================================================
// INITIALIZE FIREBASE ADMIN
// ======================================================
//
// GOOGLE_APPLICATION_CREDENTIALS should point to the
// Firebase service-account JSON file.
//
// ======================================================

const firebaseAdminApp =
    getApps().length > 0
        ? getApps()[0]
        : initializeApp({
              credential:
                  applicationDefault(),
          });

// ======================================================
// FIREBASE ADMIN AUTH
// ======================================================

const adminAuth =
    getAuth(
        firebaseAdminApp
    );

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
    firebaseAdminApp,

    adminAuth,
};