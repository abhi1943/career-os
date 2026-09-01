import {
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
    Search,
    MapPin,
    SlidersHorizontal,
    RefreshCw,
    BriefcaseBusiness,
    Bell,
    ChevronRight,
} from "lucide-react";

import JobRefreshStatus from "../../components/jobs/JobRefreshStatus";
import RecommendedJobs from "../../components/jobs/RecommendedJobs";
import JobCard from "../../components/jobs/JobCard";

import { getJobs } from "../../services/jobService";
import api from "../../services/api";

import { CareerContext } from "../../context/CareerContext";

import {
    getRecommendedJobs,
} from "../../services/jobRecommendationService";

// ======================================================
// CAREEROS JOB CATEGORIES
// ======================================================

const JOB_CATEGORIES = [
    {
        key: "it",
        label: "IT",
        description:
            "Software, Web, Data, Cloud & Technology jobs",
    },

    {
        key: "non-it",
        label: "Non-IT",
        description:
            "Operations, Support, Office & Business jobs",
    },

    {
        key: "medical",
        label: "Medical",
        description:
            "Doctors, Nurses, Pharmacy & Healthcare jobs",
    },

    {
        key: "engineering",
        label: "Engineering",
        description:
            "Civil, Electrical, Electronics & Engineering jobs",
    },

    {
        key: "mechanical",
        label: "Mechanical",
        description:
            "Mechanical, Production, Manufacturing & CAD jobs",
    },

    {
        key: "education",
        label: "Education",
        description:
            "Teachers, Lecturers, Professors & Teaching jobs",
    },

    {
        key: "finance-accounting",
        label: "Finance & Accounting",
        description:
            "Accounting, Finance, Banking & Audit jobs",
    },

    {
        key: "government",
        label: "Government",
        description:
            "Government, Public Sector & Administration jobs",
    },

    {
        key: "sales-marketing",
        label: "Sales & Marketing",
        description:
            "Sales, Marketing & Business Development jobs",
    },

    {
        key: "hr",
        label: "HR",
        description:
            "Recruitment, HR & Talent Acquisition jobs",
    },

    {
        key: "design",
        label: "Design",
        description:
            "UI/UX, Graphic, Web & Product Design jobs",
    },

    {
        key: "skilled-trades",
        label: "Skilled Trades",
        description:
            "Electrician, Welder, Technician & Trade jobs",
    },

    {
        key: "other",
        label: "Other",
        description:
            "General, Assistant, Field & Support jobs",
    },
];

// ======================================================
// JOBS PAGE
// ======================================================

function JobsPage() {
    const navigate = useNavigate();

    // ======================================================
    // CAREEROS STUDENT PROFILE
    // ======================================================

    const { student } =
        useContext(CareerContext);

    // ======================================================
    // CATEGORY STATE
    // ======================================================

    const [selectedCategory, setSelectedCategory] =
        useState("");

    // ======================================================
    // SEARCH & FILTER STATE
    // ======================================================

    const [search, setSearch] =
        useState("");

    const [location, setLocation] =
        useState("India");

    const [experience, setExperience] =
        useState("Any Experience");

    const [jobType, setJobType] =
        useState("Any Type");

    const [workMode, setWorkMode] =
        useState("Any");

    const [salary, setSalary] =
        useState("Any Salary");

    // ======================================================
    // JOB STATE
    // ======================================================

    const [jobs, setJobs] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [page, setPage] =
        useState(1);

    const [total, setTotal] =
        useState(0);

    const [hasMore, setHasMore] =
        useState(false);

    const [jobsRefreshKey, setJobsRefreshKey] =
        useState(0);

    // ======================================================
    // SAVED JOB ALERT STATE
    // ======================================================

    const [savingAlert, setSavingAlert] =
        useState(false);

    const [alertMessage, setAlertMessage] =
        useState("");

    const [alertError, setAlertError] =
        useState("");

    // ======================================================
    // SELECTED CATEGORY DETAILS
    // ======================================================

    const selectedCategoryInfo =
        useMemo(
            () =>
                JOB_CATEGORIES.find(
                    (category) =>
                        category.key ===
                        selectedCategory
                ),
            [selectedCategory]
        );

    // ======================================================
    // FETCH JOBS
    // ======================================================

    async function loadJobs(
        selectedPage = 1,
        categoryOverride = selectedCategory
    ) {
        try {
            // --------------------------------------------------
            // CATEGORY IS REQUIRED
            // --------------------------------------------------

            if (!categoryOverride) {
                setJobs([]);

                setTotal(0);

                setHasMore(false);

                setPage(1);

                return;
            }

            setLoading(true);

            setError("");

            const data =
                await getJobs({
                    career:
                        search.trim(),

                    category:
                        categoryOverride,

                    location:
                        location.trim() ||
                        "India",

                    page:
                        selectedPage,

                    experience,

                    jobType,

                    workMode,

                    salary,
                });

            // ==================================================
            // API VALIDATION
            // ==================================================

            if (!data?.success) {
                throw new Error(
                    data?.message ||
                    "Failed to load jobs."
                );
            }

            // ==================================================
            // GET ACTUAL JOBS
            // ==================================================

            const fetchedJobs =
                Array.isArray(
                    data?.jobs
                )
                    ? data.jobs
                    : [];

            // ==================================================
            // ADVANCED JOB RECOMMENDATIONS
            // ==================================================

            const jobsWithMatches =
                student
                    ? getRecommendedJobs(
                        fetchedJobs,
                        student,
                        {
                            limit:
                                fetchedJobs.length,

                            minimumScore: 0,
                        }
                    ).map(
                        (item) => ({
                            ...item.job,
                            match:
                                item.match,
                        })
                    )
                    : fetchedJobs;

            // ==================================================
            // SORT BY RECOMMENDATION SCORE
            // ==================================================

            const sortedJobs =
                [...jobsWithMatches].sort(
                    (a, b) =>
                        (
                            Number(
                                b?.match?.score
                            ) || 0
                        ) -
                        (
                            Number(
                                a?.match?.score
                            ) || 0
                        )
                );

            // ==================================================
            // SAVE JOBS
            // ==================================================

            setJobs(
                sortedJobs
            );

            setTotal(
                Number(
                    data?.total
                ) || 0
            );

            setHasMore(
                Boolean(
                    data?.has_more
                )
            );

            setPage(
                Number(
                    data?.page
                ) ||
                selectedPage
            );
        } catch (err) {
            console.error(
                "JobsPage Error:",
                err
            );

            setJobs([]);

            setTotal(0);

            setHasMore(false);

            setError(
                err?.message ||
                "Unable to load jobs. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    // ======================================================
    // INITIAL / CATEGORY REFRESH
    // ======================================================

    useEffect(() => {
        if (!selectedCategory) {
            return;
        }

        const timeout =
            setTimeout(() => {
                loadJobs(
                    1,
                    selectedCategory
                );
            }, 0);

        return () => {
            clearTimeout(timeout);
        };

        // loadJobs intentionally excluded because
        // it depends on current search/filter/profile state.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        jobsRefreshKey,
        selectedCategory,
    ]);

    // ======================================================
    // CALCULATE JOB RECOMMENDATIONS
    // ======================================================

    const recommendedJobs =
        useMemo(() => {
            if (
                !jobs.length ||
                !student
            ) {
                return [];
            }

            return getRecommendedJobs(
                jobs,
                student,
                {
                    limit:
                        jobs.length,

                    minimumScore: 0,
                }
            ).map(
                (item) => ({
                    ...item.job,
                    match:
                        item.match,
                })
            );
        }, [
            jobs,
            student,
        ]);

    // ======================================================
    // CATEGORY HANDLER
    // ======================================================

    const handleCategorySelect =
        (categoryKey) => {
            setSelectedCategory(
                categoryKey
            );

            setSearch("");

            setPage(1);

            setJobs([]);

            setTotal(0);

            setHasMore(false);

            setError("");

            setAlertMessage("");

            setAlertError("");

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        };

    // ======================================================
    // SEARCH HANDLER
    // ======================================================

    const handleSearch =
        () => {
            if (
                !selectedCategory
            ) {
                setError(
                    "Please select a job category first."
                );

                return;
            }

            loadJobs(
                1,
                selectedCategory
            );
        };

    // ======================================================
    // FILTER HANDLER
    // ======================================================

    const handleApplyFilters =
        () => {
            if (
                !selectedCategory
            ) {
                setError(
                    "Please select a job category first."
                );

                return;
            }

            loadJobs(
                1,
                selectedCategory
            );
        };

    // ======================================================
    // CLEAR FILTERS
    // ======================================================

    const handleClearFilters =
        () => {
            setSearch("");

            setLocation("India");

            setExperience(
                "Any Experience"
            );

            setJobType(
                "Any Type"
            );

            setWorkMode("Any");

            setSalary(
                "Any Salary"
            );

            setAlertMessage("");

            setAlertError("");

            setError("");

            if (
                selectedCategory
            ) {
                setTimeout(() => {
                    loadJobs(
                        1,
                        selectedCategory
                    );
                }, 0);
            }
        };

    // ======================================================
    // SAVE CURRENT SEARCH AS JOB ALERT
    // ======================================================

    const handleSaveAsAlert =
        async () => {
            try {
                setSavingAlert(
                    true
                );

                setAlertMessage("");

                setAlertError("");

                // --------------------------------------------------
                // CATEGORY VALIDATION
                // --------------------------------------------------

                if (
                    !selectedCategory
                ) {
                    setAlertError(
                        "Select a job category before saving an alert."
                    );

                    return;
                }

                const keyword =
                    search.trim();

                // --------------------------------------------------
                // SEARCH KEYWORD VALIDATION
                // --------------------------------------------------

                if (!keyword) {
                    setAlertError(
                        "Enter a job keyword before saving an alert."
                    );

                    return;
                }

                // --------------------------------------------------
                // CREATE ALERT
                // --------------------------------------------------

                const response =
                    await api.post(
                        "/job-alerts",
                        {
                            keyword,

                            category:
                                selectedCategory,

                            location:
                                location.trim() ||
                                "India",

                            experience,

                            jobType,

                            workMode,

                            salary,

                            frequency:
                                "Daily",

                            enabled:
                                true,

                            active:
                                true,
                        }
                    );

                const data =
                    response.data;

                if (
                    !data?.success
                ) {
                    throw new Error(
                        data?.message ||
                        data?.error ||
                        "Failed to save job alert."
                    );
                }

                // --------------------------------------------------
                // SUCCESS
                // --------------------------------------------------

                setAlertMessage(
                    "Job alert saved successfully."
                );
            } catch (
                error
            ) {
                console.error(
                    "Save Job Alert Error:",
                    error
                );

                setAlertError(
                    error?.message ||
                    "Unable to save job alert."
                );
            } finally {
                setSavingAlert(
                    false
                );
            }
        };

    // ======================================================
    // VIEW JOB
    // ======================================================

    const handleViewJob =
        (job) => {
            if (!job?.id) {
                return;
            }

            navigate(
                `/jobs/${encodeURIComponent(
                    job.id
                )}`
            );
        };

    // ======================================================
    // PAGE NAVIGATION
    // ======================================================

    const handlePreviousPage =
        () => {
            if (
                page <= 1
            ) {
                return;
            }

            loadJobs(
                page - 1,
                selectedCategory
            );

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        };

    const handleNextPage =
        () => {
            if (
                !hasMore
            ) {
                return;
            }

            loadJobs(
                page + 1,
                selectedCategory
            );

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        };

    // ======================================================
    // ENTER KEY SEARCH
    // ======================================================

    const handleSearchKeyDown =
        (event) => {
            if (
                event.key ===
                "Enter"
            ) {
                handleSearch();
            }
        };

    // ======================================================
    // RECOMMENDATION PROFILE STATUS
    // ======================================================

    const hasRecommendationProfile =
        Boolean(
            student?.dreamCareer ||
            student?.targetRole ||
            student?.specialization ||
            student?.education ||
            student?.skills?.length
        );

    // ======================================================
    // RENDER
    // ======================================================

    return (
        <div className="min-h-screen bg-slate-100 py-10">

            {/* ==================================================
                JOB REFRESH STATUS
            ================================================== */}

            <JobRefreshStatus
                onJobsRefreshed={() =>
                    setJobsRefreshKey(
                        (value) =>
                            value + 1
                    )
                }
            />

            <div className="max-w-7xl mx-auto px-6">

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="mb-8">

                    <div className="flex items-center gap-3">

                        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center">

                            <BriefcaseBusiness
                                size={25}
                            />

                        </div>

                        <div>

                            <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                                Latest Jobs
                            </h1>

                            <p className="text-gray-500 mt-1">
                                Choose a career category to find jobs that match your goals.
                            </p>

                        </div>

                    </div>

                </div>

                {/* ==================================================
                    CATEGORY SELECTION
                ================================================== */}

                <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">

                        <div>

                            <h2 className="text-xl font-bold text-slate-800">
                                Explore Jobs by Category
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Select a category to view relevant job opportunities.
                            </p>

                        </div>

                        {selectedCategoryInfo && (
                            <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl font-semibold text-sm">

                                Selected:
                                {" "}
                                {
                                    selectedCategoryInfo.label
                                }

                            </div>
                        )}

                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

                        {JOB_CATEGORIES.map(
                            (category) => {
                                const isSelected =
                                    selectedCategory ===
                                    category.key;

                                return (
                                    <button
                                        key={
                                            category.key
                                        }
                                        type="button"
                                        onClick={() =>
                                            handleCategorySelect(
                                                category.key
                                            )
                                        }
                                        className={`
                                            text-left
                                            rounded-2xl
                                            border
                                            p-5
                                            transition
                                            group
                                            ${
                                                isSelected
                                                    ? "border-blue-500 bg-blue-50 shadow-md"
                                                    : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
                                            }
                                        `}
                                    >

                                        <div className="flex items-center justify-between gap-3">

                                            <div>

                                                <h3
                                                    className={`
                                                        font-bold
                                                        ${
                                                            isSelected
                                                                ? "text-blue-700"
                                                                : "text-slate-800"
                                                        }
                                                    `}
                                                >
                                                    {
                                                        category.label
                                                    }
                                                </h3>

                                            </div>

                                            <ChevronRight
                                                size={
                                                    19
                                                }
                                                className={`
                                                    transition-transform
                                                    ${
                                                        isSelected
                                                            ? "text-blue-600 translate-x-1"
                                                            : "text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1"
                                                    }
                                                `}
                                            />

                                        </div>

                                        <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                                            {
                                                category.description
                                            }
                                        </p>

                                    </button>
                                );
                            }
                        )}

                    </div>

                </div>

                {/* ==================================================
                    CATEGORY NOT SELECTED
                ================================================== */}

                {!selectedCategory && (
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-5 mb-8">

                        <div className="flex items-start gap-3">

                            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">

                                <BriefcaseBusiness
                                    size={19}
                                />

                            </div>

                            <div>

                                <p className="font-semibold text-blue-900">
                                    Select a category to start
                                </p>

                                <p className="text-sm text-blue-700 mt-1">
                                    CareerOS no longer loads a mixed “all jobs” list.
                                    Choose the category that matches the type of work you want.
                                </p>

                            </div>

                        </div>

                    </div>
                )}

                {/* ==================================================
                    SELECTED CATEGORY CONTENT
                ================================================== */}

                {selectedCategory && (
                    <>

                        {/* ==================================================
                            RECOMMENDATION STATUS
                        ================================================== */}

                        {hasRecommendationProfile && (
                            <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 mb-6">

                                <div className="flex items-start gap-3">

                                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">

                                        <BriefcaseBusiness
                                            size={18}
                                        />

                                    </div>

                                    <div>

                                        <p className="font-semibold text-blue-900">
                                            Personalized job recommendations enabled
                                        </p>

                                        <p className="text-sm text-blue-700 mt-1">
                                            Jobs are ranked using your CareerOS profile,
                                            skills, education, career goal, role, and experience.
                                        </p>

                                    </div>

                                </div>

                            </div>
                        )}

                        {!hasRecommendationProfile && (
                            <div className="bg-amber-50 border border-amber-100 rounded-2xl px-5 py-4 mb-6">

                                <p className="font-semibold text-amber-900">
                                    Complete your CareerOS profile for better recommendations
                                </p>

                                <p className="text-sm text-amber-700 mt-1">
                                    Add your career goal, education, skills, and experience
                                    to receive more accurate job matches.
                                </p>

                            </div>
                        )}

                        {/* ==================================================
                            SEARCH PANEL
                        ================================================== */}

                        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">

                            <div className="mb-5">

                                <h2 className="text-lg font-bold text-slate-800">

                                    {
                                        selectedCategoryInfo?.label
                                    }
                                    {" "}
                                    Jobs

                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Search within this category or use the filters below.
                                </p>

                            </div>

                            <div className="grid lg:grid-cols-[1fr_1fr_auto] gap-4">

                                {/* SEARCH */}

                                <div className="relative">

                                    <Search
                                        size={20}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type="text"
                                        value={
                                            search
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setSearch(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        onKeyDown={
                                            handleSearchKeyDown
                                        }
                                        placeholder="Search jobs, e.g. React Developer"
                                        className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />

                                </div>

                                {/* LOCATION */}

                                <div className="relative">

                                    <MapPin
                                        size={20}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type="text"
                                        value={
                                            location
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setLocation(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        onKeyDown={
                                            handleSearchKeyDown
                                        }
                                        placeholder="Location"
                                        className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />

                                </div>

                                {/* SEARCH BUTTON */}

                                <button
                                    type="button"
                                    onClick={
                                        handleSearch
                                    }
                                    disabled={
                                        loading
                                    }
                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-7 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
                                >

                                    {loading ? (
                                        <>
                                            <RefreshCw
                                                size={
                                                    18
                                                }
                                                className="animate-spin"
                                            />

                                            Searching...
                                        </>
                                    ) : (
                                        <>
                                            <Search
                                                size={
                                                    18
                                                }
                                            />

                                            Search
                                        </>
                                    )}

                                </button>

                            </div>

                            {/* ==================================================
                                FILTERS
                            ================================================== */}

                            <div className="flex items-center gap-2 mt-6 mb-4">

                                <SlidersHorizontal
                                    size={
                                        19
                                    }
                                    className="text-blue-600"
                                />

                                <h2 className="font-semibold text-slate-700">
                                    Job Filters
                                </h2>

                            </div>

                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">

                                {/* EXPERIENCE */}

                                <select
                                    value={
                                        experience
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setExperience(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    className="border border-gray-200 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                                >

                                    <option>
                                        Any Experience
                                    </option>

                                    <option>
                                        Fresher / 0 years
                                    </option>

                                    <option>
                                        0–1 years
                                    </option>

                                    <option>
                                        1–3 years
                                    </option>

                                    <option>
                                        3–5 years
                                    </option>

                                    <option>
                                        5+ years
                                    </option>

                                </select>

                                {/* JOB TYPE */}

                                <select
                                    value={
                                        jobType
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setJobType(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    className="border border-gray-200 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                                >

                                    <option>
                                        Any Type
                                    </option>

                                    <option>
                                        Full-time
                                    </option>

                                    <option>
                                        Part-time
                                    </option>

                                    <option>
                                        Contract
                                    </option>

                                    <option>
                                        Internship
                                    </option>

                                </select>

                                {/* WORK MODE */}

                                <select
                                    value={
                                        workMode
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setWorkMode(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    className="border border-gray-200 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                                >

                                    <option>
                                        Any
                                    </option>

                                    <option>
                                        Remote
                                    </option>

                                    <option>
                                        Hybrid
                                    </option>

                                    <option>
                                        On-site
                                    </option>

                                </select>

                                {/* SALARY */}

                                <select
                                    value={
                                        salary
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setSalary(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    className="border border-gray-200 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                                >

                                    <option>
                                        Any Salary
                                    </option>

                                    <option>
                                        ₹0–3 LPA
                                    </option>

                                    <option>
                                        ₹3–5 LPA
                                    </option>

                                    <option>
                                        ₹5–10 LPA
                                    </option>

                                    <option>
                                        ₹10–20 LPA
                                    </option>

                                    <option>
                                        ₹20+ LPA
                                    </option>

                                </select>

                            </div>

                            {/* ==================================================
                                FILTER BUTTONS
                            ================================================== */}

                            <div className="flex flex-wrap gap-3 mt-5">

                                <button
                                    type="button"
                                    onClick={
                                        handleApplyFilters
                                    }
                                    disabled={
                                        loading
                                    }
                                    className="bg-slate-800 hover:bg-slate-900 disabled:bg-slate-400 text-white px-5 py-2.5 rounded-xl font-semibold transition"
                                >
                                    Apply Filters
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleClearFilters
                                    }
                                    disabled={
                                        loading
                                    }
                                    className="border border-gray-200 hover:bg-gray-50 disabled:opacity-50 text-gray-700 px-5 py-2.5 rounded-xl font-semibold transition"
                                >
                                    Clear Filters
                                </button>

                                {/* SAVE AS ALERT */}

                                <button
                                    type="button"
                                    onClick={
                                        handleSaveAsAlert
                                    }
                                    disabled={
                                        savingAlert ||
                                        loading
                                    }
                                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition"
                                >

                                    {savingAlert ? (
                                        <>
                                            <RefreshCw
                                                size={
                                                    17
                                                }
                                                className="animate-spin"
                                            />

                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Bell
                                                size={
                                                    17
                                                }
                                            />

                                            Save as Alert
                                        </>
                                    )}

                                </button>

                            </div>

                            {/* ==================================================
                                ALERT SUCCESS
                            ================================================== */}

                            {alertMessage && (
                                <div className="mt-4 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3">

                                    <p className="font-semibold">
                                        {
                                            alertMessage
                                        }
                                    </p>

                                </div>
                            )}

                            {/* ==================================================
                                ALERT ERROR
                            ================================================== */}

                            {alertError && (
                                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3">

                                    <p className="font-semibold">
                                        {
                                            alertError
                                        }
                                    </p>

                                </div>
                            )}

                        </div>

                        {/* ==================================================
                            RESULTS HEADER
                        ================================================== */}

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">

                            <div>

                                <h2 className="text-xl font-bold text-slate-800">

                                    {
                                        selectedCategoryInfo?.label
                                    }
                                    {" "}
                                    Job Opportunities

                                </h2>

                                <p className="text-sm text-gray-500 mt-1">

                                    {loading
                                        ? "Finding the best matches..."
                                        : `${jobs.length} jobs loaded${
                                            total
                                                ? ` • ${total.toLocaleString(
                                                    "en-IN"
                                                )} total available`
                                                : ""
                                        }`}

                                </p>

                            </div>

                            {!loading &&
                                jobs.length >
                                    0 && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            loadJobs(
                                                page,
                                                selectedCategory
                                            )
                                        }
                                        className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                                    >

                                        <RefreshCw
                                            size={
                                                17
                                            }
                                        />

                                        Refresh

                                    </button>
                                )}

                        </div>

                        {/* ==================================================
                            PERSONALIZED RECOMMENDED JOBS
                        ================================================== */}

                        {!loading &&
                            !error &&
                            recommendedJobs.length >
                                0 &&
                            student && (
                                <RecommendedJobs
                                    jobs={
                                        jobs
                                    }
                                    student={
                                        student
                                    }
                                    onView={
                                        handleViewJob
                                    }
                                />
                            )}

                        {/* ==================================================
                            ERROR
                        ================================================== */}

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-5 mb-6">

                                <p className="font-semibold">
                                    Unable to load jobs
                                </p>

                                <p className="text-sm mt-1">
                                    {
                                        error
                                    }
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        loadJobs(
                                            page,
                                            selectedCategory
                                        )
                                    }
                                    className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"
                                >
                                    Try Again
                                </button>

                            </div>
                        )}

                        {/* ==================================================
                            LOADING
                        ================================================== */}

                        {loading && (
                            <div className="grid md:grid-cols-2 gap-6">

                                {Array.from(
                                    {
                                        length: 6,
                                    }
                                ).map(
                                    (
                                        _,
                                        index
                                    ) => (
                                        <div
                                            key={
                                                index
                                            }
                                            className="bg-white rounded-3xl shadow p-6 animate-pulse"
                                        >

                                            <div className="h-6 bg-gray-200 rounded w-3/4" />

                                            <div className="h-4 bg-gray-200 rounded w-1/2 mt-3" />

                                            <div className="space-y-3 mt-6">

                                                <div className="h-4 bg-gray-200 rounded" />

                                                <div className="h-4 bg-gray-200 rounded w-5/6" />

                                                <div className="h-4 bg-gray-200 rounded w-2/3" />

                                            </div>

                                            <div className="h-10 bg-gray-200 rounded-xl mt-6" />

                                        </div>
                                    )
                                )}

                            </div>
                        )}

                        {/* ==================================================
                            EMPTY
                        ================================================== */}

                        {!loading &&
                            !error &&
                            selectedCategory &&
                            jobs.length ===
                                0 && (
                                <div className="bg-white rounded-3xl shadow-lg p-12 text-center">

                                    <BriefcaseBusiness
                                        size={
                                            52
                                        }
                                        className="mx-auto text-gray-300"
                                    />

                                    <h2 className="text-2xl font-bold text-slate-800 mt-5">
                                        No jobs found
                                    </h2>

                                    <p className="text-gray-500 mt-2 max-w-md mx-auto">

                                        No jobs were found
                                        in the{" "}
                                        <strong>
                                            {
                                                selectedCategoryInfo?.label
                                            }
                                        </strong>{" "}
                                        category with your current search and filters.

                                    </p>

                                    <div className="flex flex-wrap items-center justify-center gap-3 mt-6">

                                        <button
                                            type="button"
                                            onClick={
                                                handleClearFilters
                                            }
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
                                        >
                                            Reset Filters
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setSelectedCategory(
                                                    ""
                                                )
                                            }
                                            className="border border-gray-200 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-xl font-semibold"
                                        >
                                            Change Category
                                        </button>

                                    </div>

                                </div>
                            )}

                        {/* ==================================================
                            JOB LIST
                        ================================================== */}

                        {!loading &&
                            recommendedJobs.length >
                                0 && (
                                <div className="grid md:grid-cols-2 gap-6">

                                    {recommendedJobs.map(
                                        (
                                            job,
                                            index
                                        ) => (
                                            <JobCard
                                                key={
                                                    job?.id ||
                                                    `${job?.title}-${index}`
                                                }
                                                job={
                                                    job
                                                }
                                                match={
                                                    job?.match
                                                }
                                                onView={() =>
                                                    handleViewJob(
                                                        job
                                                    )
                                                }
                                            />
                                        )
                                    )}

                                </div>
                            )}

                        {/* ==================================================
                            PAGINATION
                        ================================================== */}

                        {!loading &&
                            jobs.length >
                                0 && (
                                <div className="flex items-center justify-center gap-4 mt-10">

                                    <button
                                        type="button"
                                        onClick={
                                            handlePreviousPage
                                        }
                                        disabled={
                                            page <=
                                            1
                                        }
                                        className="px-5 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-semibold"
                                    >
                                        ← Previous
                                    </button>

                                    <div className="bg-white border border-gray-200 px-5 py-3 rounded-xl font-semibold text-slate-700">
                                        Page{" "}
                                        {
                                            page
                                        }
                                    </div>

                                    <button
                                        type="button"
                                        onClick={
                                            handleNextPage
                                        }
                                        disabled={
                                            !hasMore
                                        }
                                        className="px-5 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-semibold"
                                    >
                                        Next →
                                    </button>

                                </div>
                            )}

                    </>
                )}

            </div>

        </div>
    );
}

export default JobsPage;