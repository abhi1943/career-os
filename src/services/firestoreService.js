import {
  doc,
  setDoc,
  getDoc,
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
    portfolio,
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

/* ---------------- Assessment ---------------- */

export async function saveAssessment(uid, assessment) {
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