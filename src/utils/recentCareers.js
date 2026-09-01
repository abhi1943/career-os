import { auth } from "../firebase/firebase";

// ======================================================
// STORAGE KEY
// ======================================================

function getStorageKey(uid) {
    return `careerOS_recent_careers_${uid}`;
}

// ======================================================
// GET CURRENT USER ID
// ======================================================

function getCurrentUserId() {
    return auth?.currentUser?.uid || null;
}

// ======================================================
// SAVE RECENT CAREER
// ======================================================

export function saveRecentCareer(career) {
    const uid = getCurrentUserId();

    if (!uid || !career) {
        return false;
    }

    const careerId =
        career?.id ||
        career?.careerId;

    if (!careerId) {
        return false;
    }

    const normalizedId = String(careerId);

    try {
        const key = getStorageKey(uid);

        const stored =
            localStorage.getItem(key);

        const existing = stored
            ? JSON.parse(stored)
            : [];

        const existingCareers =
            Array.isArray(existing)
                ? existing
                : [];

        const updated = [
            {
                ...career,
                id: normalizedId,
            },

            ...existingCareers.filter(
                (item) =>
                    String(
                        item?.id ||
                        item?.careerId ||
                        ""
                    ) !== normalizedId
            ),
        ].slice(0, 5);

        localStorage.setItem(
            key,
            JSON.stringify(updated)
        );

        // Notify components in the same tab.
        window.dispatchEvent(
            new CustomEvent(
                "careerOS:recentCareersUpdated"
            )
        );

        return true;

    } catch (error) {
        console.error(
            "CareerOS Recent Careers save error:",
            error
        );

        return false;
    }
}

// ======================================================
// GET RECENT CAREERS
// ======================================================

export function getRecentCareers() {
    const uid = getCurrentUserId();

    if (!uid) {
        return [];
    }

    try {
        const key = getStorageKey(uid);

        const stored =
            localStorage.getItem(key);

        if (!stored) {
            return [];
        }

        const parsed =
            JSON.parse(stored);

        return Array.isArray(parsed)
            ? parsed
            : [];

    } catch (error) {
        console.error(
            "CareerOS Recent Careers load error:",
            error
        );

        return [];
    }
}