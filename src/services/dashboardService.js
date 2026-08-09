import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export async function getDashboardData(uid) {

    const resumeRef = doc(db, "resumes", uid);
    const portfolioRef = doc(db, "portfolios", uid);

    const resumeSnap = await getDoc(resumeRef);
    const portfolioSnap = await getDoc(portfolioRef);

    return {

        resume: resumeSnap.exists()
            ? resumeSnap.data()
            : null,

        portfolio: portfolioSnap.exists()
            ? portfolioSnap.data()
            : null

    };

}