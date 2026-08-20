// ======================================================
// CareerOS Firebase Authentication Middleware
// ======================================================
//
// Responsibilities:
// - Read Firebase ID token from Authorization header
// - Verify token using Firebase Admin SDK
// - Attach authenticated Firebase user to req.user
// - Reject unauthenticated requests
//
// Expected header:
//
// Authorization: Bearer <firebase-id-token>
//
// ======================================================

const {
    adminAuth,
} = require("../config/firebaseAdmin");

// ======================================================
// REQUIRE FIREBASE AUTHENTICATION
// ======================================================

async function requireFirebaseAuth(
    req,
    res,
    next
) {
    try {
        // --------------------------------------------------
        // GET AUTHORIZATION HEADER
        // --------------------------------------------------

        const authorization =
            req.headers.authorization || "";

        // --------------------------------------------------
        // VALIDATE BEARER TOKEN
        // --------------------------------------------------

        if (
            !authorization.startsWith(
                "Bearer "
            )
        ) {
            return res.status(401).json({
                success: false,

                message:
                    "Authentication required.",
            });
        }

        // --------------------------------------------------
        // EXTRACT ID TOKEN
        // --------------------------------------------------

        const idToken =
            authorization
                .substring(7)
                .trim();

        if (!idToken) {
            return res.status(401).json({
                success: false,

                message:
                    "Authentication token is missing.",
            });
        }

        // --------------------------------------------------
        // VERIFY FIREBASE ID TOKEN
        // --------------------------------------------------

        const decodedToken =
            await adminAuth.verifyIdToken(
                idToken
            );

        // --------------------------------------------------
        // ATTACH AUTHENTICATED USER
        // --------------------------------------------------
        //
        // decodedToken.uid is now the trusted Firebase UID.
        //
        // We do NOT accept the UID from the frontend as the
        // source of truth.
        //
        // --------------------------------------------------

        req.user = {
            uid:
                decodedToken.uid,

            email:
                decodedToken.email ||
                null,

            name:
                decodedToken.name ||
                null,

            emailVerified:
                Boolean(
                    decodedToken.email_verified
                ),
        };

        // --------------------------------------------------
        // CONTINUE REQUEST
        // --------------------------------------------------

        next();
    } catch (error) {
        console.error(
            "CareerOS Firebase authentication error:",
            error.message
        );

        return res.status(401).json({
            success: false,

            message:
                "Invalid or expired authentication token.",
        });
    }
}

// ======================================================
// EXPORT
// ======================================================

module.exports = {
    requireFirebaseAuth,
};