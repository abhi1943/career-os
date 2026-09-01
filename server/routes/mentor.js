
const express = require("express");

const router = express.Router();

/*
======================================================
CAREEROS AI MENTOR BACKEND ROUTE
======================================================

Sensitive operations should eventually live here:

- AI/API keys
- external AI providers
- protected API calls
- server-side job searches
- server-side integrations

The frontend should call this endpoint instead of
directly calling protected services.
======================================================
*/

router.post("/", async (req, res) => {
    try {
        const {
            question,
            careerId = null,
        } = req.body || {};

        if (
            typeof question !== "string" ||
            !question.trim()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Please ask a career-related question.",
            });
        }

        /*
        --------------------------------------------------
        TEMPORARY SERVER-SIDE MENTOR RESPONSE
        --------------------------------------------------

        For the current CareerOS architecture, the
        deterministic Mentor engine can remain on the
        frontend.

        This backend endpoint is the protected boundary
        where external AI/API operations can be moved.

        We deliberately do NOT expose API keys here.
        --------------------------------------------------
        */

        return res.json({
            success: true,

            message:
                "Mentor backend endpoint is working.",

            question:
                question.trim(),

            careerId:
                careerId || null,

            /*
            Do not return sensitive credentials,
            API keys or server configuration.
            */
            data: null,
        });
    } catch (error) {
        console.error(
            "CareerOS Mentor API Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "CareerOS AI Mentor is temporarily unavailable.",
        });
    }
});

module.exports = router;

