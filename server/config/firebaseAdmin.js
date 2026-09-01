// ======================================================
// CareerOS Firebase Admin
// ======================================================

const {
    initializeApp,
    cert,
    getApps,
} = require("firebase-admin/app");

const {
    getAuth,
} = require("firebase-admin/auth");

// ======================================================
// FIREBASE ADMIN CONFIGURATION
// ======================================================

const projectId =
    process.env.FIREBASE_PROJECT_ID;

const clientEmail =
    process.env.FIREBASE_CLIENT_EMAIL;

const privateKey =
    process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(
              /\\n/g,
              "\n"
          )
        : undefined;

// ======================================================
// VALIDATE FIREBASE CONFIGURATION
// ======================================================

if (
    !projectId ||
    !clientEmail ||
    !privateKey
) {
    console.error(
        "❌ Firebase Admin configuration is missing."
    );

    console.error(
        "Required environment variables:"
    );

    console.error(
        "FIREBASE_PROJECT_ID"
    );

    console.error(
        "FIREBASE_CLIENT_EMAIL"
    );

    console.error(
        "FIREBASE_PRIVATE_KEY"
    );
}

// ======================================================
// INITIALIZE FIREBASE ADMIN
// ======================================================

const firebaseAdminApp =
    getApps().length > 0
        ? getApps()[0]
        : initializeApp({
              credential: cert({
                  projectId,
                  clientEmail,
                  privateKey,
              }),
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