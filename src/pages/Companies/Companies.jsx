import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import { CareerContext } from "../../context/CareerContext";

import { calculateJobMatch } from "../../utils/jobMatcher";

import JobCard from "../../components/jobs/JobCard";

import { getSavedJobs } from "../../services/savedJobsService";

// ======================================================
// STATES + CITIES
// ======================================================

const stateCities = {
  "Andhra Pradesh": [
    "Visakhapatnam",
    "Vijayawada",
    "Tirupati",
    "Guntur",
    "Kurnool",
    "Nellore",
    "Kadapa",
  ],

  Telangana: [
    "Hyderabad",
    "Warangal",
    "Karimnagar",
    "Nizamabad",
    "Khammam",
  ],

  Karnataka: [
    "Bengaluru",
    "Mysuru",
    "Mangaluru",
    "Hubli",
  ],

  "Tamil Nadu": [
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Salem",
    "Tiruchirappalli",
  ],

  Maharashtra: [
    "Mumbai",
    "Pune",
    "Nagpur",
    "Nashik",
    "Aurangabad",
  ],

  Delhi: [
    "New Delhi",
    "Delhi",
  ],

  Kerala: [
    "Kochi",
    "Thiruvananthapuram",
    "Kozhikode",
    "Thrissur",
  ],

  Gujarat: [
    "Ahmedabad",
    "Surat",
    "Vadodara",
    "Rajkot",
  ],

  "Uttar Pradesh": [
    "Noida",
    "Lucknow",
    "Kanpur",
    "Agra",
    "Varanasi",
  ],

  "West Bengal": [
    "Kolkata",
  ],

  Rajasthan: [
    "Jaipur",
    "Jodhpur",
    "Udaipur",
  ],
};

// ======================================================
// FILTER OPTIONS
// ======================================================

const experienceOptions = [
  "Any Experience",
  "Fresher / 0 years",
  "0–1 years",
  "1–3 years",
  "3–5 years",
  "5+ years",
];

const jobTypeOptions = [
  "Any Type",
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
];

const workModeOptions = [
  "Any",
  "Remote",
  "Hybrid",
  "On-site",
];

const salaryOptions = [
  "Any Salary",
  "₹0–3 LPA",
  "₹3–5 LPA",
  "₹5–10 LPA",
  "₹10–20 LPA",
  "₹20+ LPA",
];

// ======================================================
// COMPONENT
// ======================================================

function Companies() {
  const navigate = useNavigate();

  const { student } = useContext(CareerContext);

  // ====================================================
  // SEARCH + FILTER STATE
  // ====================================================

  const [search, setSearch] = useState(
    "software engineer"
  );

  const [state, setState] = useState(
    "All States"
  );

  const [city, setCity] = useState(
    "All Cities"
  );

  const [experience, setExperience] =
    useState("Any Experience");

  const [jobType, setJobType] =
    useState("Any Type");

  const [workMode, setWorkMode] =
    useState("Any");

  const [salary, setSalary] =
    useState("Any Salary");

  // ====================================================
  // JOB STATE
  // ====================================================

  const [jobs, setJobs] = useState([]);

  const [page, setPage] = useState(1);

  const [filteredTotal, setFilteredTotal] =
    useState(0);

  const [hasMore, setHasMore] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [newJobsCount, setNewJobsCount] =
    useState(0);

  const [checkingForNewJobs, setCheckingForNewJobs] =
    useState(false);

  const [loadingMore, setLoadingMore] =
    useState(false);

  const [error, setError] =
    useState("");

  const [hasSearched, setHasSearched] =
    useState(false);

  // ====================================================
  // SAVED JOBS
  // ====================================================

  const [savedJobs, setSavedJobs] =
    useState([]);

  const [showSavedJobs, setShowSavedJobs] =
    useState(false);

  // ====================================================
  // LOAD SAVED JOBS
  // ====================================================

  const loadSavedJobs = useCallback(
    async () => {
      try {
        const result =
          await getSavedJobs();

        setSavedJobs(
          Array.isArray(result)
            ? result
            : []
        );
      } catch (error) {
        console.error(
          "CareerOS failed to load saved jobs:",
          error
        );

        setSavedJobs([]);
      }
    },
    []
  );

  // ====================================================
  // INITIAL SAVED JOB LOAD
  // ====================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      loadSavedJobs();
    }, 0);

    return () => {
      clearTimeout(timer);
    };
  }, [loadSavedJobs]);

  // ====================================================
  // SAVED JOB CHANGE
  // ====================================================

  const handleSavedChange =
    useCallback(async () => {
      await loadSavedJobs();
    }, [loadSavedJobs]);

  // ====================================================
  // REQUEST CONTROL
  // ====================================================

  const requestIdRef =
    useRef(0);

  const abortControllerRef =
    useRef(null);

  // ====================================================
  // STATE OPTIONS
  // ====================================================

  const stateOptions = useMemo(
    () => Object.keys(stateCities),
    []
  );

  // ====================================================
  // CITY OPTIONS
  // ====================================================

  const cityOptions = useMemo(() => {
    if (state === "All States") {
      return [];
    }

    const cities =
      stateCities[state];

    if (!Array.isArray(cities)) {
      return [];
    }

    return [
      "All Cities",
      ...cities,
      "Other Cities",
    ];
  }, [state]);

  // ====================================================
  // API LOCATION
  // ====================================================

  const getApiLocation =
    useCallback(() => {
      if (state === "All States") {
        return "India";
      }

      if (city === "Other Cities") {
        return state;
      }

      if (
        city &&
        city !== "All Cities"
      ) {
        return city;
      }

      return state;
    }, [state, city]);

  // ====================================================
  // SEARCH JOBS
  // ====================================================

  const searchJobs =
    useCallback(
      async ({
        pageNumber = 1,
        append = false,
      } = {}) => {
        if (!search.trim()) {
          setError(
            "Please enter a job title, skill or keyword."
          );

          return;
        }

        // ----------------------------------------------
        // Cancel previous request
        // ----------------------------------------------

        if (
          abortControllerRef.current
        ) {
          abortControllerRef.current.abort();
        }

        const controller =
          new AbortController();

        abortControllerRef.current =
          controller;

        const currentRequestId =
          ++requestIdRef.current;

        // ----------------------------------------------
        // Loading
        // ----------------------------------------------

        if (append) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }

        setError("");
        setHasSearched(true);

        try {
          const apiLocation =
            getApiLocation();

          const params =
            new URLSearchParams();

          params.set(
            "query",
            search.trim()
          );

          params.set(
            "location",
            apiLocation
          );

          params.set(
            "page",
            String(pageNumber)
          );

          params.set(
            "experience",
            experience
          );

          params.set(
            "jobType",
            jobType
          );

          params.set(
            "workMode",
            workMode
          );

          params.set(
            "salary",
            salary
          );

          // --------------------------------------------
          // LOCATION FILTER
          // --------------------------------------------

          if (
            city === "Other Cities"
          ) {
            params.set(
              "cityFilter",
              "other"
            );

            params.set(
              "state",
              state
            );
          } else if (
            city !== "All Cities" &&
            state !== "All States"
          ) {
            params.set(
              "cityFilter",
              "city"
            );

            params.set(
              "state",
              state
            );

            params.set(
              "city",
              city
            );
          } else if (
            state !== "All States"
          ) {
            params.set(
              "cityFilter",
              "all"
            );

            params.set(
              "state",
              state
            );
          }

          // --------------------------------------------
          // API REQUEST
          // --------------------------------------------

          const response =
            await fetch(
              `http://localhost:5000/api/jobs?${params.toString()}`,
              {
                signal:
                  controller.signal,
              }
            );

          let data;

          try {
            data =
              await response.json();
          } catch {
            throw new Error(
              "The server returned an invalid response."
            );
          }

          if (
            !response.ok ||
            !data.success
          ) {
            throw new Error(
              data.message ||
                "Failed to fetch jobs."
            );
          }

          // --------------------------------------------
          // Ignore old request
          // --------------------------------------------

          if (
            currentRequestId !==
            requestIdRef.current
          ) {
            return;
          }

          const newJobs =
            Array.isArray(data.jobs)
              ? data.jobs
              : [];

          // --------------------------------------------
          // ADD / REPLACE JOBS
          // --------------------------------------------

          if (append) {
            setJobs(
              (previousJobs) => {
                const existingIds =
                  new Set(
                    previousJobs.map(
                      (item) =>
                        String(item.id)
                    )
                  );

                const uniqueJobs =
                  newJobs.filter(
                    (item) =>
                      !existingIds.has(
                        String(item.id)
                      )
                  );

                return [
                  ...previousJobs,
                  ...uniqueJobs,
                ];
              }
            );
          } else {
            setJobs(newJobs);
          }

          // --------------------------------------------
          // METADATA
          // --------------------------------------------

          setFilteredTotal(
            Number(
              data.filtered_total ??
                newJobs.length
            )
          );

          setPage(pageNumber);

          // --------------------------------------------
          // PAGINATION
          // --------------------------------------------

          if (
            typeof data.has_more ===
            "boolean"
          ) {
            setHasMore(
              data.has_more &&
                newJobs.length > 0
            );
          } else {
            setHasMore(
              newJobs.length >= 50
            );
          }
        } catch (err) {
          if (
            err.name ===
            "AbortError"
          ) {
            return;
          }

          console.error(
            "CareerOS Jobs Error:",
            err
          );

          if (!append) {
            setJobs([]);
            setFilteredTotal(0);
            setHasMore(false);
          }

          setError(
            err.message ||
              "Unable to load jobs. Please try again."
          );
        } finally {
          if (
            currentRequestId ===
            requestIdRef.current
          ) {
            setLoading(false);
            setLoadingMore(false);
          }
        }
      },
      [
        search,
        experience,
        jobType,
        workMode,
        salary,
        getApiLocation,
        state,
        city,
      ]
    );

  // ====================================================
  // INITIAL SEARCH
  // ====================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      searchJobs({
        pageNumber: 1,
        append: false,
      });
    }, 0);

    return () => {
      clearTimeout(timer);

      if (
        abortControllerRef.current
      ) {
        abortControllerRef.current.abort();
      }
    };
  }, [searchJobs]);

  // ====================================================
  // AUTOMATIC FILTER SEARCH
  // ====================================================

  useEffect(() => {
    const timer =
      setTimeout(() => {
        if (!hasSearched) {
          return;
        }

        searchJobs({
          pageNumber: 1,
          append: false,
        });
      }, 250);

    return () =>
      clearTimeout(timer);
  }, [
    state,
    city,
    experience,
    jobType,
    workMode,
    salary,
    hasSearched,
    searchJobs,
  ]);

  // ====================================================
  // AUTOMATIC JOB REFRESH CHECK
  // ====================================================

  useEffect(() => {
    if (
      !hasSearched ||
      showSavedJobs
    ) {
      return;
    }

    const checkForNewJobs =
      async () => {
        if (
          checkingForNewJobs
        ) {
          return;
        }

        setCheckingForNewJobs(
          true
        );

        try {
          const apiLocation =
            getApiLocation();

          const params =
            new URLSearchParams();

          params.set(
            "query",
            search.trim()
          );

          params.set(
            "location",
            apiLocation
          );

          params.set(
            "page",
            "1"
          );

          params.set(
            "experience",
            experience
          );

          params.set(
            "jobType",
            jobType
          );

          params.set(
            "workMode",
            workMode
          );

          params.set(
            "salary",
            salary
          );

          // ------------------------------------------
          // LOCATION FILTER
          // ------------------------------------------

          if (
            city === "Other Cities"
          ) {
            params.set(
              "cityFilter",
              "other"
            );

            params.set(
              "state",
              state
            );
          } else if (
            city !== "All Cities" &&
            state !== "All States"
          ) {
            params.set(
              "cityFilter",
              "city"
            );

            params.set(
              "state",
              state
            );

            params.set(
              "city",
              city
            );
          } else if (
            state !== "All States"
          ) {
            params.set(
              "cityFilter",
              "all"
            );

            params.set(
              "state",
              state
            );
          }

          // ------------------------------------------
          // CHECK LATEST JOBS
          // ------------------------------------------

          const response =
            await fetch(
              `http://localhost:5000/api/jobs?${params.toString()}`
            );

          if (!response.ok) {
            return;
          }

          const data =
            await response.json();

          if (!data.success) {
            return;
          }

          const latestJobs =
            Array.isArray(
              data.jobs
            )
              ? data.jobs
              : [];

          // ------------------------------------------
          // FIND NEW JOBS
          // ------------------------------------------

          const existingIds =
            new Set(
              jobs.map((job) =>
                String(job.id)
              )
            );

          const newJobs =
            latestJobs.filter(
              (job) =>
                !existingIds.has(
                  String(job.id)
                )
            );

          if (
            newJobs.length > 0
          ) {
            setNewJobsCount(
              newJobs.length
            );
          }
        } catch (error) {
          console.error(
            "CareerOS automatic job check error:",
            error
          );
        } finally {
          setCheckingForNewJobs(
            false
          );
        }
      };

    // Check every 15 minutes.
    const refreshInterval =
      setInterval(
        checkForNewJobs,
        15 * 60 * 1000
      );

    return () => {
      clearInterval(
        refreshInterval
      );
    };
  }, [
    hasSearched,
    showSavedJobs,
    search,
    experience,
    jobType,
    workMode,
    salary,
    state,
    city,
    getApiLocation,
    jobs,
    checkingForNewJobs,
  ]);

  // ====================================================
  // FORM SUBMIT
  // ====================================================

  const handleSubmit = (
    event
  ) => {
    event.preventDefault();

    setShowSavedJobs(false);
    setNewJobsCount(0);
    setPage(1);

    searchJobs({
      pageNumber: 1,
      append: false,
    });
  };

  // ====================================================
  // STATE CHANGE
  // ====================================================

  const handleStateChange = (
    event
  ) => {
    const newState =
      event.target.value;

    setState(newState);
    setCity("All Cities");
    setShowSavedJobs(false);
  };

  // ====================================================
  // CITY CHANGE
  // ====================================================

  const handleCityChange = (
    event
  ) => {
    setCity(
      event.target.value
    );

    setShowSavedJobs(false);
  };

  // ====================================================
  // CLEAR FILTERS
  // ====================================================

  const clearFilters = () => {
    setSearch(
      "software engineer"
    );

    setState(
      "All States"
    );

    setCity(
      "All Cities"
    );

    setExperience(
      "Any Experience"
    );

    setJobType(
      "Any Type"
    );

    setWorkMode(
      "Any"
    );

    setSalary(
      "Any Salary"
    );

    setPage(1);
    setNewJobsCount(0);
    setError("");
    setShowSavedJobs(false);
  };

  // ====================================================
  // SHOW / HIDE SAVED JOBS
  // ====================================================

  const handleSavedJobsToggle =
    useCallback(
      async () => {
        const nextValue =
          !showSavedJobs;

        if (nextValue) {
          await loadSavedJobs();
        }

        setShowSavedJobs(
          nextValue
        );
      },
      [
        showSavedJobs,
        loadSavedJobs,
      ]
    );

  // ====================================================
  // DISPLAY JOBS
  // ====================================================

  const displayedJobs =
    useMemo(() => {
      return showSavedJobs
        ? savedJobs
        : jobs;
    }, [
      showSavedJobs,
      savedJobs,
      jobs,
    ]);

  // ====================================================
  // LOAD MORE
  // ====================================================

  const canLoadMore =
    !showSavedJobs &&
    hasMore &&
    jobs.length > 0;

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="text-center">

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Live Job Opportunities
        </h1>

        <p className="text-gray-500 mt-4 text-lg">
          Find jobs matching your skills,
          experience and location.
        </p>

      </div>

      {/* =================================================
          SEARCH + FILTERS
      ================================================= */}

      <form
        onSubmit={handleSubmit}
        className="mt-10 bg-white rounded-2xl shadow-md border p-6"
      >

        {/* SEARCH */}

        <div className="flex flex-col md:flex-row gap-3">

          <div className="flex-1 relative">

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              🔎
            </span>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Software Engineer, React, Data Analyst..."
              className="w-full border border-gray-300 rounded-xl pl-11 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-7 py-3.5 rounded-xl font-semibold transition"
          >
            {loading
              ? "Searching..."
              : "🔎 Search Jobs"}
          </button>

        </div>

        {/* FILTERS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mt-5">

          {/* STATE */}

          <select
            value={state}
            onChange={
              handleStateChange
            }
            className="border border-gray-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >

            <option value="All States">
              All States
            </option>

            {stateOptions.map(
              (item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              )
            )}

          </select>

          {/* CITY */}

          <select
            value={city}
            onChange={
              handleCityChange
            }
            disabled={
              state ===
              "All States"
            }
            className={`border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 ${
              state === "All States"
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700"
            }`}
          >

            {state ===
            "All States" ? (
              <option value="All Cities">
                Select a state first
              </option>
            ) : (
              cityOptions.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )
            )}

          </select>

          {/* EXPERIENCE */}

          <select
            value={experience}
            onChange={(event) =>
              setExperience(
                event.target.value
              )
            }
            className="border border-gray-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >

            {experienceOptions.map(
              (item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              )
            )}

          </select>

          {/* JOB TYPE */}

          <select
            value={jobType}
            onChange={(event) =>
              setJobType(
                event.target.value
              )
            }
            className="border border-gray-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >

            {jobTypeOptions.map(
              (item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              )
            )}

          </select>

          {/* WORK MODE */}

          <select
            value={workMode}
            onChange={(event) =>
              setWorkMode(
                event.target.value
              )
            }
            className="border border-gray-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >

            {workModeOptions.map(
              (item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              )
            )}

          </select>

          {/* SALARY */}

          <select
            value={salary}
            onChange={(event) =>
              setSalary(
                event.target.value
              )
            }
            className="border border-gray-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >

            {salaryOptions.map(
              (item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              )
            )}

          </select>

        </div>

        {/* FILTER STATUS */}

        <div className="flex flex-wrap items-center justify-between gap-3 mt-4">

          <div className="text-sm text-gray-500">

            {state !==
              "All States" && (
              <span>
                📍 {state}

                {city !==
                  "All Cities" &&
                  city !==
                    "Other Cities" &&
                  ` • ${city}`}

                {city ===
                  "Other Cities" &&
                  " • Other Cities"}
              </span>
            )}

          </div>

          <button
            type="button"
            onClick={
              clearFilters
            }
            className="text-sm text-gray-500 hover:text-blue-600 font-medium transition"
          >
            ✕ Clear Filters
          </button>

        </div>

      </form>

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (
        <div className="text-center py-14">

          <div className="text-4xl mb-3">
            🔄
          </div>

          <p className="text-gray-500">
            Finding the latest
            opportunities...
          </p>

        </div>
      )}

      {/* =================================================
          ERROR
      ================================================= */}

      {!loading &&
        error && (
          <div className="mt-8 bg-red-50 border border-red-200 rounded-2xl p-6 text-center">

            <div className="text-3xl mb-2">
              ⚠️
            </div>

            <h2 className="font-bold text-red-700">
              Unable to load jobs
            </h2>

            <p className="text-red-600 mt-2">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                searchJobs({
                  pageNumber: 1,
                  append: false,
                })
              }
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl"
            >
              Try Again
            </button>

          </div>
        )}

      {/* =================================================
          RESULTS
      ================================================= */}

      {!loading &&
        !error &&
        hasSearched && (
          <div className="mt-10">

            {/* RESULTS HEADER */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

              <div>

                <h2 className="text-2xl font-bold text-gray-900">
                  {showSavedJobs
                    ? "Saved Jobs"
                    : "Latest Job Openings"}
                </h2>

                <p className="text-gray-500 mt-1">

                  {showSavedJobs ? (
                    <>
                      {savedJobs.length.toLocaleString(
                        "en-IN"
                      )}{" "}
                      saved{" "}
                      {savedJobs.length ===
                      1
                        ? "job"
                        : "jobs"}
                    </>
                  ) : (
                    <>
                      Showing{" "}
                      {displayedJobs.length.toLocaleString(
                        "en-IN"
                      )}{" "}
                      {displayedJobs.length ===
                      1
                        ? "job"
                        : "jobs"}

                      {filteredTotal >
                        0 && (
                        <>
                          {" "}
                          of{" "}
                          {filteredTotal.toLocaleString(
                            "en-IN"
                          )}{" "}
                          matching jobs
                        </>
                      )}
                    </>
                  )}

                </p>

              </div>

              <div className="flex items-center gap-3 flex-wrap">

                {/* NEW JOBS */}

                {newJobsCount > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setNewJobsCount(
                        0
                      );

                      searchJobs({
                        pageNumber: 1,
                        append: false,
                      });
                    }}
                    className="bg-green-50 border border-green-200 text-green-700 px-5 py-2 rounded-xl font-semibold hover:bg-green-100 transition"
                  >
                    🟢 {newJobsCount} new{" "}
                    {newJobsCount ===
                    1
                      ? "job"
                      : "jobs"}{" "}
                    found — View New Jobs
                  </button>
                )}

                {/* SAVED */}

                <button
                  type="button"
                  onClick={
                    handleSavedJobsToggle
                  }
                  className={
                    showSavedJobs
                      ? "bg-yellow-500 text-white px-5 py-2 rounded-xl font-semibold transition"
                      : "border border-yellow-500 text-yellow-600 hover:bg-yellow-50 px-5 py-2 rounded-xl font-semibold transition"
                  }
                >
                  {showSavedJobs
                    ? "← All Jobs"
                    : `★ Saved Jobs (${savedJobs.length})`}
                </button>

                {/* REFRESH */}

                <button
                  type="button"
                  onClick={() =>
                    searchJobs({
                      pageNumber: 1,
                      append: false,
                    })
                  }
                  disabled={loading}
                  className="border border-blue-600 text-blue-600 hover:bg-blue-50 disabled:opacity-50 px-5 py-2 rounded-xl font-semibold transition"
                >
                  🔄 Refresh Jobs
                </button>

              </div>

            </div>

            {/* =================================================
                JOB CARDS
            ================================================= */}

            {displayedJobs.length >
            0 ? (
              <>

                <div className="grid lg:grid-cols-2 gap-6">

                  {displayedJobs.map(
                    (job) => {
                      const match =
                        student
                          ? calculateJobMatch(
                              job,
                              student
                            )
                          : null;

                      const jobKey =
                        job.id ||
                        job.redirect_url ||
                        `${
                          job.title ||
                          "job"
                        }-${
                          typeof job.company ===
                          "string"
                            ? job.company
                            : job.company
                                ?.display_name ||
                              "company"
                        }`;

                      return (
                        <JobCard
                          key={jobKey}
                          job={job}
                          match={match}
                          onView={() =>
                            navigate(
                              `/companies/job/${job.id}`,
                              {
                                state: {
                                  job,
                                },
                              }
                            )
                          }
                          onSavedChange={
                            handleSavedChange
                          }
                        />
                      );
                    }
                  )}

                </div>

                {/* =================================================
                    LOAD MORE
                ================================================= */}

                {canLoadMore && (
                  <div className="flex flex-col items-center mt-10">

                    <button
                      type="button"
                      onClick={() =>
                        searchJobs({
                          pageNumber:
                            page + 1,
                          append: true,
                        })
                      }
                      disabled={
                        loadingMore ||
                        loading
                      }
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-xl font-semibold transition"
                    >
                      {loadingMore
                        ? "Loading more jobs..."
                        : "Load More Jobs →"}
                    </button>

                    {filteredTotal >
                      0 && (
                      <p className="text-sm text-gray-400 mt-3">
                        Showing{" "}
                        {jobs.length.toLocaleString(
                          "en-IN"
                        )}{" "}
                        of{" "}
                        {filteredTotal.toLocaleString(
                          "en-IN"
                        )}{" "}
                        jobs found in the
                        current search pool
                      </p>
                    )}

                  </div>
                )}

              </>
            ) : (

              /* =================================================
                 NO RESULTS
              ================================================= */

              <div className="bg-gray-50 border rounded-2xl text-center p-12">

                <div className="text-5xl mb-4">
                  🔍
                </div>

                <h2 className="text-2xl font-bold text-gray-800">
                  {showSavedJobs
                    ? "No saved jobs yet"
                    : "No matching jobs found"}
                </h2>

                <p className="text-gray-500 mt-2">
                  {showSavedJobs
                    ? "Save jobs you are interested in and they will appear here."
                    : "Try changing your filters or searching for another job title."}
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-3 mt-5">

                  {showSavedJobs ? (
                    <button
                      type="button"
                      onClick={() =>
                        setShowSavedJobs(
                          false
                        )
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold"
                    >
                      ← Browse Jobs
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={
                        clearFilters
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold"
                    >
                      Clear Filters
                    </button>
                  )}

                </div>

              </div>
            )}

          </div>
        )}

      {/* =================================================
          INITIAL EMPTY STATE
      ================================================= */}

      {!loading &&
        !error &&
        !hasSearched && (
          <div className="mt-10 text-center bg-gray-50 rounded-2xl p-12">

            <div className="text-5xl mb-4">
              💼
            </div>

            <h2 className="text-2xl font-bold text-gray-800">
              Find Your Next Opportunity
            </h2>

            <p className="text-gray-500 mt-2">
              Search for a job title,
              technology or location.
            </p>

          </div>
        )}

    </div>
  );
}

export default Companies;
