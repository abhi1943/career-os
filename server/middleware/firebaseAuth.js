// ======================================================
// CareerOS Firebase Authentication Middleware
// ======================================================

const {
    adminAuth,
} = require("../config/firebaseAdmin");

// ======================================================
// VERIFY FIREBASE ID TOKEN
// ======================================================

async function verifyFirebaseToken(req, res, next) {
    try {
        const authorization =
            req.headers.authorization;

        if (
            !authorization ||
            !authorization.startsWith("Bearer ")
        ) {
            return res.status(401).json({
                success: false,
                message:
                    "Authentication required. Firebase ID token is missing.",
            });
        }

        const idToken =
            authorization
                .substring(7)
                .trim();

        if (!idToken) {
            return res.status(401).json({
                success: false,
                message:
                    "Authentication required. Firebase ID token is missing.",
            });
        }

        const decodedToken =
            await adminAuth.verifyIdToken(
                idToken
            );

        req.user =
            decodedToken;

        return next();

    } catch (error) {
        console.error(
            "❌ Firebase authentication failed:"
        );

        console.error(
            "Code:",
            error?.code
        );

        console.error(
            "Message:",
            error?.message
        );

        // Do NOT expose Firebase's internal
        // authentication error to the client.
        return res.status(401).json({
            success: false,
            message:
                "Invalid or expired Firebase ID token.",
        });
    }
}

// ======================================================
// EXPORT
// ======================================================

module.exports = {
    verifyFirebaseToken,
};