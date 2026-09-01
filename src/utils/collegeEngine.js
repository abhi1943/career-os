import collegesDatabase from "../data/colleges/colleges";


// ======================================================
// EDUCATION → COLLEGE CATEGORY
// ======================================================

const EDUCATION_TO_COLLEGE_CATEGORY = {

    after10th: "intermediate",

    intermediate: "intermediate",

    polytechnic: "diploma",

    iti: "diploma",

    degree: "degree",

    btech: "engineering",

    medical: "medical",

    government: null,

};


// ======================================================
// SPECIALIZATION → COURSE KEYWORDS
// ======================================================

const SPECIALIZATION_KEYWORDS = {

    // ==================================================
    // ENGINEERING
    // ==================================================

    CSE: [
        "computer science",
        "cse",
        "computer",
        "information technology",
        "it",
        "software",
    ],

    "AI & ML": [
        "artificial intelligence",
        "machine learning",
        "ai",
        "ml",
        "data science",
    ],

    "Data Science": [
        "data science",
        "artificial intelligence",
        "machine learning",
        "data",
    ],

    "Cyber Security": [
        "cyber security",
        "cybersecurity",
        "information security",
        "security",
    ],

    ECE: [
        "electronics",
        "ece",
        "communication",
    ],

    EEE: [
        "electrical",
        "eee",
        "electronics",
    ],

    Mechanical: [
        "mechanical",
        "automobile",
        "production",
    ],

    Civil: [
        "civil",
        "construction",
        "structural",
    ],

    IT: [
        "information technology",
        "it",
        "computer science",
        "software",
    ],


    // ==================================================
    // DEGREE
    // ==================================================

    "B.Sc": [
        "b.sc",
        "bsc",
        "science",
    ],

    "B.Com": [
        "b.com",
        "bcom",
        "commerce",
        "accounting",
    ],

    BBA: [
        "bba",
        "business administration",
        "management",
    ],

    BA: [
        "ba",
        "arts",
        "humanities",
    ],

    BCA: [
        "bca",
        "computer application",
        "computer applications",
        "computer science",
    ],


    // ==================================================
    // MEDICAL
    // ==================================================

    MBBS: [
        "mbbs",
        "medicine",
        "medical",
    ],

    BDS: [
        "bds",
        "dental",
        "dentistry",
    ],

    BAMS: [
        "bams",
        "ayurveda",
        "ayurvedic",
    ],

    BHMS: [
        "bhms",
        "homeopathy",
        "homeopathic",
    ],

    "B.Pharmacy": [
        "b.pharmacy",
        "bpharmacy",
        "pharmacy",
        "pharmaceutical",
    ],


    // ==================================================
    // DIPLOMA
    // ==================================================

    Electrician: [
        "electrical",
        "electrician",
    ],

    Fitter: [
        "fitter",
        "mechanical",
    ],

    "Computer Operator": [
        "computer",
        "information technology",
        "it",
    ],

    Electronics: [
        "electronics",
        "electrical",
    ],

    Mechanic: [
        "mechanical",
        "automobile",
        "mechanic",
    ],

};


// ======================================================
// NORMALIZE TEXT
// ======================================================

function normalizeText(value) {

    return String(value || "")
        .trim()
        .toLowerCase();

}


// ======================================================
// GET COLLEGE SEARCH TEXT
// ======================================================

function getCollegeSearchText(college) {

    return [

        college?.name,

        college?.course,

        college?.courses,

        college?.branch,

        college?.branches,

        college?.specialization,

        college?.specializations,

        college?.program,

        college?.programs,

        college?.stream,

        college?.streams,

    ]
        .flat()
        .filter(Boolean)
        .map(normalizeText)
        .join(" ");

}


// ======================================================
// CHECK COLLEGE COURSE MATCH
// ======================================================

function collegeMatchesSpecialization(
    college,
    specialization
) {

    if (!specialization) {
        return true;
    }

    const keywords =
        SPECIALIZATION_KEYWORDS[
            specialization
        ];

    // ----------------------------------------------
    // If we don't have keyword mapping,
    // don't accidentally hide colleges.
    // ----------------------------------------------

    if (
        !keywords ||
        keywords.length === 0
    ) {
        return true;
    }

    const collegeText =
        getCollegeSearchText(
            college
        );

    if (!collegeText) {
        return true;
    }

    return keywords.some(
        (keyword) =>
            collegeText.includes(
                normalizeText(keyword)
            )
    );

}


// ======================================================
// GET COLLEGE CATEGORY
// ======================================================

export function getCollegeCategory(
    education
) {

    if (!education) {
        return null;
    }

    return (
        EDUCATION_TO_COLLEGE_CATEGORY[
            education
        ] || null
    );

}


// ======================================================
// GET COLLEGES FOR EDUCATION
// ======================================================

export function getColleges(
    education,
    specialization = null
) {

    if (!education) {
        return [];
    }

    const category =
        getCollegeCategory(
            education
        );

    if (!category) {
        return [];
    }

    const colleges =
        collegesDatabase[
            category
        ] || [];

    // ----------------------------------------------
    // No specialization:
    // return entire category.
    // ----------------------------------------------

    if (!specialization) {
        return colleges;
    }

    // ----------------------------------------------
    // Filter according to specialization.
    // ----------------------------------------------

    const matched =
        colleges.filter(
            (college) =>
                collegeMatchesSpecialization(
                    college,
                    specialization
                )
        );

    // ----------------------------------------------
    // Safety fallback:
    // If the database does not contain course
    // information, don't show an empty page.
    // ----------------------------------------------

    return matched.length > 0
        ? matched
        : colleges;

}


// ======================================================
// GET COLLEGES FOR STUDENT
// ======================================================

export function getCollegesForStudent(
    student
) {

    if (!student) {
        return [];
    }

    return getColleges(
        student.education,
        student.specialization
    );

}


// ======================================================
// GET ALL COLLEGES
// ======================================================

export function getAllColleges() {

    return Object.values(
        collegesDatabase
    ).flat();

}


// ======================================================
// GET COLLEGE DATABASE
// ======================================================

export function getCollegeDatabase() {

    return collegesDatabase;

}