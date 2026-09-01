import {
  useContext,
  useMemo,
  useState,
} from "react";

import { CareerContext } from "../../context/CareerContext";

import {
  getAllColleges,
} from "../../utils/collegeEngine";

import CollegeCard from "../../components/cards/CollegeCard";


// ======================================================
// COLLEGE CATEGORIES
// ======================================================

const COLLEGE_CATEGORIES = [
  {
    value: "all",
    label: "All Colleges",
  },
  {
    value: "engineering",
    label: "Engineering",
  },
  {
    value: "degree",
    label: "Degree",
  },
  {
    value: "diploma",
    label: "Diploma",
  },
  {
    value: "medical",
    label: "Medical",
  },
  {
    value: "intermediate",
    label: "Intermediate",
  },
];


// ======================================================
// COLLEGE TYPES
// ======================================================

const COLLEGE_TYPES = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "Government",
    label: "Government",
  },
  {
    value: "Private",
    label: "Private",
  },
];


// ======================================================
// EDUCATION → CATEGORY
// ======================================================

const EDUCATION_TO_CATEGORY = {
  after10th: "intermediate",

  intermediate: "intermediate",

  polytechnic: "diploma",

  iti: "diploma",

  degree: "degree",

  btech: "engineering",

  medical: "medical",

  government: "all",
};


// ======================================================
// EDUCATION LABEL
// ======================================================

function getEducationLabel(education) {
  if (!education) {
    return null;
  }

  const labels = {
    after10th: "10th",

    intermediate: "Intermediate",

    polytechnic: "Polytechnic",

    iti: "ITI",

    degree: "Degree",

    btech: "B.Tech / Engineering",

    medical: "Medical",

    government: "Government Exams",
  };

  return (
    labels[education] ||
    education.charAt(0).toUpperCase() +
      education.slice(1)
  );
}


// ======================================================
// NORMALIZE TEXT
// ======================================================

function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}


// ======================================================
// GET COLLEGE CATEGORY
//
// IMPORTANT:
// Do NOT depend on college ID.
// The college database may contain different
// ID formats.
//
// We check explicit category fields first.
// Then use course/branch information as fallback.
// ======================================================

function getCollegeCategory(college) {
  if (!college) {
    return "";
  }

  const explicitCategory =
    normalize(
      college.category ||
      college.collegeCategory ||
      college.typeCategory
    );

  if (
    [
      "engineering",
      "degree",
      "diploma",
      "medical",
      "intermediate",
    ].includes(explicitCategory)
  ) {
    return explicitCategory;
  }

  const course =
    normalize(
      college.course ||
      college.courses ||
      college.stream ||
      college.branch
    );

  const name =
    normalize(college.name);

  // ----------------------------------------------------
  // MEDICAL
  // ----------------------------------------------------

  if (
    course.includes("mbbs") ||
    course.includes("bds") ||
    course.includes("bams") ||
    course.includes("bhms") ||
    course.includes("pharmacy") ||
    course.includes("medical") ||
    name.includes("medical")
  ) {
    return "medical";
  }

  // ----------------------------------------------------
  // ENGINEERING
  // ----------------------------------------------------

  if (
    course.includes("b.tech") ||
    course.includes("btech") ||
    course.includes("engineering") ||
    course.includes("computer science") ||
    course.includes("cse") ||
    course.includes("ece") ||
    course.includes("eee") ||
    course.includes("mechanical") ||
    course.includes("civil")
  ) {
    return "engineering";
  }

  // ----------------------------------------------------
  // DIPLOMA
  // ----------------------------------------------------

  if (
    course.includes("diploma") ||
    course.includes("polytechnic") ||
    course.includes("iti")
  ) {
    return "diploma";
  }

  // ----------------------------------------------------
  // INTERMEDIATE
  // ----------------------------------------------------

  if (
    course.includes("intermediate") ||
    course.includes("mpc") ||
    course.includes("bipc") ||
    course.includes("mec") ||
    course.includes("cec") ||
    course.includes("hec")
  ) {
    return "intermediate";
  }

  // ----------------------------------------------------
  // DEGREE
  // ----------------------------------------------------

  if (
    course.includes("b.sc") ||
    course.includes("bsc") ||
    course.includes("b.com") ||
    course.includes("bcom") ||
    course.includes("bba") ||
    course.includes("bca") ||
    course.includes("b.a") ||
    course.includes("ba") ||
    course.includes("degree")
  ) {
    return "degree";
  }

  return "";
}


// ======================================================
// CHECK COLLEGE CATEGORY
// ======================================================

function matchesCategory(
  college,
  selectedCategory
) {
  if (selectedCategory === "all") {
    return true;
  }

  return (
    getCollegeCategory(college) ===
    selectedCategory
  );
}


// ======================================================
// CHECK COLLEGE TYPE
// ======================================================

function matchesType(
  college,
  selectedType
) {
  if (selectedType === "all") {
    return true;
  }

  const collegeType =
    normalize(
      college?.type ||
      college?.ownership ||
      college?.ownershipType ||
      college?.management
    );

  return (
    collegeType ===
    normalize(selectedType)
  );
}


// ======================================================
// CHECK SEARCH
// ======================================================

function matchesSearch(
  college,
  query
) {
  if (!query) {
    return true;
  }

  const searchableText = [
    college?.name,

    college?.location,

    college?.city,

    college?.state,

    college?.course,

    college?.stream,

    college?.branch,

    college?.category,

    college?.collegeCategory,

    college?.type,

    college?.ownership,

    college?.ownershipType,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchableText.includes(
    query
  );
}


// ======================================================
// CHECK STUDENT RELEVANCE
//
// This is intentionally used only for the
// recommendation message / optional sorting.
// It does NOT hide colleges.
//
// This means users can still explore every
// college category manually.
// ======================================================

function getStudentRelevance(
  college,
  student
) {
  if (!college || !student) {
    return 0;
  }

  let score = 0;

  const collegeCategory =
    getCollegeCategory(college);

  const recommendedCategory =
    EDUCATION_TO_CATEGORY[
      student.education
    ];

  // Education category match
  if (
    recommendedCategory &&
    recommendedCategory !== "all" &&
    collegeCategory ===
      recommendedCategory
  ) {
    score += 10;
  }

  const collegeText = [
    college?.name,
    college?.course,
    college?.stream,
    college?.branch,
    college?.category,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const specialization =
    normalize(
      student.specialization
    );

  const dreamCareer =
    normalize(
      student.dreamCareer
    );

  // Specialization match
  if (
    specialization &&
    collegeText.includes(
      specialization
    )
  ) {
    score += 5;
  }

  // Dream career match
  if (
    dreamCareer &&
    collegeText.includes(
      dreamCareer
    )
  ) {
    score += 5;
  }

  return score;
}


// ======================================================
// COLLEGES PAGE
// ======================================================

function Colleges() {
  const { student } =
    useContext(CareerContext);


  // ====================================================
  // STATE
  // ====================================================

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("all");

  const [
    selectedType,
    setSelectedType,
  ] = useState("all");


  // ====================================================
  // GET STUDENT RECOMMENDED CATEGORY
  // ====================================================

  const recommendedCategory =
    EDUCATION_TO_CATEGORY[
      student?.education
    ] || null;


  // ====================================================
  // GET ALL COLLEGES
  // ====================================================

  const allColleges =
    useMemo(() => {
      return getAllColleges();
    }, []);


  // ====================================================
  // FILTER COLLEGES
  // ====================================================

  const filteredColleges =
    useMemo(() => {

      const query =
        search
          .trim()
          .toLowerCase();

      const results =
        allColleges.filter(
          (college) => {

            // ------------------------------------------
            // CATEGORY
            // ------------------------------------------

            if (
              !matchesCategory(
                college,
                selectedCategory
              )
            ) {
              return false;
            }


            // ------------------------------------------
            // GOVERNMENT / PRIVATE
            // ------------------------------------------

            if (
              !matchesType(
                college,
                selectedType
              )
            ) {
              return false;
            }


            // ------------------------------------------
            // SEARCH
            // ------------------------------------------

            if (
              !matchesSearch(
                college,
                query
              )
            ) {
              return false;
            }


            return true;
          }
        );


      // ------------------------------------------------
      // If user hasn't selected a category manually,
      // put profile-relevant colleges first.
      //
      // We DO NOT remove other colleges.
      // ------------------------------------------------

      if (
        selectedCategory === "all" &&
        student?.education
      ) {
        return [...results].sort(
          (a, b) =>
            getStudentRelevance(
              b,
              student
            ) -
            getStudentRelevance(
              a,
              student
            )
        );
      }

      return results;

    }, [
      allColleges,
      selectedCategory,
      selectedType,
      search,
      student,
    ]);


  // ====================================================
  // EDUCATION LABEL
  // ====================================================

  const educationLabel =
    getEducationLabel(
      student?.education
    );


  // ====================================================
  // RECOMMENDATION TEXT
  // ====================================================

  const recommendationText =
    recommendedCategory &&
    recommendedCategory !== "all"
      ? `Recommended for your ${educationLabel} education`
      : null;


  // ====================================================
  // RESET FILTERS
  // ====================================================

  function resetFilters() {

    setSearch("");

    setSelectedCategory("all");

    setSelectedType("all");
  }


  // ====================================================
  // GET ACTIVE CATEGORY LABEL
  // ====================================================

  const activeCategoryLabel =
    COLLEGE_CATEGORIES.find(
      (item) =>
        item.value ===
        selectedCategory
    )?.label || "All Colleges";


  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="max-w-7xl mx-auto py-16 px-6">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="text-center">

        <p className="text-blue-600 font-semibold">
          CAREEROS COLLEGE EXPLORER
        </p>

        <h1 className="text-5xl font-bold mt-2">
          Explore Colleges
        </h1>

        <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
          Explore colleges across India by
          education level, ownership type,
          location, and course.
        </p>

      </div>


      {/* ==================================================
          STUDENT RECOMMENDATION
      ================================================== */}

      {recommendationText && (
        <div className="mt-8 flex justify-center">

          <div className="bg-blue-50 border border-blue-100 text-blue-700 px-5 py-3 rounded-xl text-sm font-semibold">

            🎓 {recommendationText}

          </div>

        </div>
      )}


      {/* ==================================================
          FILTER PANEL
      ================================================== */}

      <div className="bg-white rounded-3xl shadow-lg p-6 mt-10">

        <div className="grid md:grid-cols-3 gap-5">

          {/* ==================================================
              SEARCH
          ================================================== */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Search
            </label>

            <input
              type="text"
              placeholder="Search college, city, state, course..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>


          {/* ==================================================
              CATEGORY
          ================================================== */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              College Category
            </label>

            <select
              value={
                selectedCategory
              }
              onChange={(e) =>
                setSelectedCategory(
                  e.target.value
                )
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
            >

              {COLLEGE_CATEGORIES.map(
                (category) => (

                  <option
                    key={
                      category.value
                    }
                    value={
                      category.value
                    }
                  >
                    {category.label}
                  </option>

                )
              )}

            </select>

          </div>


          {/* ==================================================
              GOVERNMENT / PRIVATE
          ================================================== */}

          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              College Type
            </label>

            <select
              value={selectedType}
              onChange={(e) =>
                setSelectedType(
                  e.target.value
                )
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
            >

              {COLLEGE_TYPES.map(
                (type) => (

                  <option
                    key={type.value}
                    value={type.value}
                  >
                    {type.label}
                  </option>

                )
              )}

            </select>

          </div>

        </div>


        {/* ==================================================
            ACTIVE FILTERS
        ================================================== */}

        <div className="flex flex-wrap items-center gap-3 mt-5">

          {selectedCategory !== "all" && (
            <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-semibold">
              Category:{" "}
              {activeCategoryLabel}
            </span>
          )}

          {selectedType !== "all" && (
            <span className="bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg text-sm font-semibold">
              Type:{" "}
              {selectedType}
            </span>
          )}

          {search.trim() && (
            <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-semibold">
              Search: "{search.trim()}"
            </span>
          )}

        </div>


        {/* ==================================================
            RESET
        ================================================== */}

        <div className="flex justify-end mt-5">

          <button
            type="button"
            onClick={
              resetFilters
            }
            className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
          >
            Reset Filters
          </button>

        </div>

      </div>


      {/* ==================================================
          RESULTS SUMMARY
      ================================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-10">

        <div>

          <h2 className="text-2xl font-bold text-gray-800">
            Colleges
          </h2>

          <p className="text-gray-500 text-sm mt-1">

            Showing{" "}

            <span className="font-semibold text-gray-700">
              {filteredColleges.length}
            </span>{" "}

            college
            {filteredColleges.length !== 1
              ? "s"
              : ""}

          </p>

        </div>


        {/* ==================================================
            ACTIVE CATEGORY
        ================================================== */}

        <div className="text-sm text-gray-500">

          Category:{" "}

          <span className="font-semibold text-blue-600">
            {activeCategoryLabel}
          </span>

        </div>

      </div>


      {/* ==================================================
          RESULTS
      ================================================== */}

      {filteredColleges.length > 0 ? (

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">

          {filteredColleges.map(
            (college, index) => (

              <CollegeCard
                key={
                  college.id ||
                  `${college.name}-${college.location}-${index}`
                }
                college={college}
              />

            )
          )}

        </div>

      ) : (

        <div className="mt-8 bg-white rounded-3xl border border-gray-100 p-12 text-center">

          <div className="text-5xl mb-4">
            🎓
          </div>

          <h3 className="text-xl font-bold text-gray-800">
            No colleges found
          </h3>

          <p className="text-gray-500 mt-2">
            Try changing your search or
            filters.
          </p>

          <button
            type="button"
            onClick={
              resetFilters
            }
            className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition"
          >
            Clear Filters
          </button>

        </div>

      )}

    </div>
  );
}

export default Colleges;