import intermediateColleges from "./intermediateColleges";
import engineeringColleges from "./engineeringColleges";
import degreeColleges from "./degreeColleges";
import diplomaColleges from "./diplomaColleges";
import medicalColleges from "./medicalColleges";


// ======================================================
// NORMALIZE COLLEGE IDs
// ======================================================

function normalizeColleges(
    colleges,
    category
) {
    return colleges.map(
        (college, index) => ({
            ...college,
            id: `${category}_${college.id ?? index + 1}`,
        })
    );
}
// ======================================================
// COLLEGE DATABASE
// ======================================================

const collegesDatabase = {

    intermediate:
        normalizeColleges(
            intermediateColleges,
            "intermediate"
        ),

    engineering:
        normalizeColleges(
            engineeringColleges,
            "engineering"
        ),

    degree:
        normalizeColleges(
            degreeColleges,
            "degree"
        ),

    diploma:
        normalizeColleges(
            diplomaColleges,
            "diploma"
        ),

    medical:
        normalizeColleges(
            medicalColleges,
            "medical"
        ),

};

export default collegesDatabase;