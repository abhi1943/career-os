import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
    query,
    where
} from "firebase/firestore";

import { db } from "../firebase/firebase";

const COLLECTION = "jobApplications";

export async function addApplication(uid, application) {

    return await addDoc(
        collection(db, COLLECTION),
        {
            uid,
            ...application,
            createdAt: Date.now(),
        }
    );

}

export async function getApplications(uid) {

    const q = query(
        collection(db, COLLECTION),
        where("uid", "==", uid)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    }));

}

export async function updateApplication(id, data) {

    await updateDoc(
        doc(db, COLLECTION, id),
        data
    );

}

export async function deleteApplication(id) {

    await deleteDoc(
        doc(db, COLLECTION, id)
    );

}