import {
    doc,
    setDoc,
    getDoc,
    serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

/* ---------------- Resume ---------------- */

export async function saveResume(uid, resume) {
    await setDoc(
        doc(db, "resumes", uid),
        resume,
        { merge: true }
    );
}

export async function loadResume(uid) {
    const snapshot = await getDoc(
        doc(db, "resumes", uid)
    );

    if (snapshot.exists()) {
        return snapshot.data();
    }

    return null;
}

/* ---------------- Portfolio ---------------- */

export async function savePortfolio(uid, portfolio) {
    await setDoc(
        doc(db, "portfolios", uid),
        {
            ...portfolio,
            updatedAt: serverTimestamp(),
        },
        { merge: true }
    );
}

export async function loadPortfolio(uid) {
    const snapshot = await getDoc(
        doc(db, "portfolios", uid)
    );

    if (snapshot.exists()) {
        return snapshot.data();
    }

    return null;
}

/* ---------------- Public Portfolio ---------------- */

/*
 * Publishes the user's current portfolio.
 *
 * The UID is used as the public portfolio ID so the
 * same share link remains stable.
 */
export async function publishPortfolio(
    uid,
    portfolio
) {
    await setDoc(
        doc(db, "publicPortfolios", uid),
        {
            ownerId: uid,
            portfolio,
            published: true,
            updatedAt: serverTimestamp(),
        },
        { merge: true }
    );
}

/*
 * Loads a publicly shared portfolio.
 */
export async function loadPublicPortfolio(
    portfolioId
) {
    const snapshot = await getDoc(
        doc(
            db,
            "publicPortfolios",
            portfolioId
        )
    );

    if (!snapshot.exists()) {
        return null;
    }

    return snapshot.data();
}

/*
 * Turn public sharing off.
 */
export async function unpublishPortfolio(uid) {
    await setDoc(
        doc(db, "publicPortfolios", uid),
        {
            published: false,
            updatedAt: serverTimestamp(),
        },
        { merge: true }
    );
}

/* ---------------- Assessment ---------------- */

export async function saveAssessment(
    uid,
    assessment
) {
    await setDoc(
        doc(db, "assessments", uid),
        assessment,
        { merge: true }
    );
}

export async function loadAssessment(uid) {
    const snapshot = await getDoc(
        doc(db, "assessments", uid)
    );

    if (snapshot.exists()) {
        return snapshot.data();
    }

    return null;
}