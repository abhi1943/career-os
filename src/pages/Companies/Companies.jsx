import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  Search,
  MapPin,
  BriefcaseBusiness,
  Building2,
  RefreshCw,
  ArrowRight,
} from "lucide-react";

// ======================================================
// COMPANY HELPERS
// ======================================================

const getInitials = (name) => {
  const cleaned = String(
    name || "Company"
  ).trim();

  if (!cleaned) {
    return "CO";
  }

  const words = cleaned
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 1) {
    return words[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    words[0][0] +
    words[1][0]
  ).toUpperCase();
};

// ======================================================
// WARM-UP CONFIGURATION
// ======================================================

const WARM_POLL_INTERVAL = 1000;

// Maximum time Companies page waits for the
// background job-store warm-up.
const WARM_MAX_WAIT = 30000;

// ======================================================
// COMPONENT
// ======================================================

function Companies() {
  const navigate = useNavigate();

  // ====================================================
  // COMPANY STATE
  // ====================================================

  const [companies, setCompanies] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [locationFilter, setLocationFilter] =
    useState("All Locations");

  const [categoryFilter, setCategoryFilter] =
    useState("All Categories");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [hasLoaded, setHasLoaded] =
    useState(false);

  const [page, setPage] =
    useState(1);

  const [hasMore, setHasMore] =
    useState(false);

  const [loadingMore, setLoadingMore] =
    useState(false);

  const [totalCompanies, setTotalCompanies] =
    useState(0);

  const [totalJobsScanned, setTotalJobsScanned] =
    useState(0);

  // ====================================================
  // WARM-UP STATE
  // ====================================================

  const [warmingStore, setWarmingStore] =
    useState(false);

  const [warmMessage, setWarmMessage] =
    useState("");

  // ====================================================
  // REQUEST REFS
  // ====================================================

  const abortControllerRef =
    useRef(null);

  const warmAbortControllerRef =
    useRef(null);

  const requestIdRef =
    useRef(0);

  const warmRequestRef =
    useRef(false);

 


  // ====================================================
  // WAIT
  // ====================================================

  const wait =
    useCallback(
      (milliseconds, signal) =>
        new Promise(
          (resolve, reject) => {
            if (
              signal?.aborted
            ) {
              reject(
                new DOMException(
                  "Request aborted",
                  "AbortError"
                )
              );

              return;
            }

            const timeout =
              setTimeout(() => {
                if (
                  signal?.aborted
                ) {
                  reject(
                    new DOMException(
                      "Request aborted",
                      "AbortError"
                    )
                  );

                  return;
                }

                resolve();
              }, milliseconds);

            signal?.addEventListener(
              "abort",
              () => {
                clearTimeout(
                  timeout
                );

                reject(
                  new DOMException(
                    "Request aborted",
                    "AbortError"
                  )
                );
              },
              {
                once: true,
              }
            );
          }
        ),
      []
    );

  // ====================================================
  // ENSURE JOB STORE IS WARM
  // ====================================================
  //
  // This is the key Step 9 change.
  //
  // Direct Companies access:
  //
  // /companies
  //      ↓
  // /api/jobs/warm
  //      ↓
  // already warm → continue
  //      ↓
  // warming → wait
  //      ↓
  // cold → start background warm
  //      ↓
  // poll until warm
  //
  // ====================================================

  const ensureJobStoreWarm =
    useCallback(
      async () => {
        // ------------------------------------------------
        // PREVENT DUPLICATE FRONTEND WARM FLOW
        // ------------------------------------------------

        if (
          warmRequestRef.current
        ) {
          return true;
        }

        warmRequestRef.current =
          true;

        const controller =
          new AbortController();

        warmAbortControllerRef.current =
          controller;

        const startedAt =
          Date.now();

        setWarmingStore(true);

        setWarmMessage(
          "Checking the CareerOS job store..."
        );

        try {
          while (
            Date.now() -
              startedAt <
            WARM_MAX_WAIT
          ) {
            // ============================================
            // CHECK / START WARM
            // ============================================

            const response =
              await fetch(
                "https://career-os-api-1h85.onrender.com/api/jobs/warm",
                {
                  method: "GET",
                  signal:
                    controller.signal,
                  cache: "no-store",
                }
              );

            // ============================================
            // PARSE RESPONSE
            // ============================================

            let data;

            try {
              data =
                await response.json();
            } catch {
              throw new Error(
                "The server returned an invalid warm-up response."
              );
            }

            // ============================================
            // SERVER ERROR
            // ============================================

            if (
              !response.ok &&
              response.status !== 202
            ) {
              throw new Error(
                data.message ||
                  "Unable to initialize the CareerOS job store."
              );
            }

            // ============================================
            // ALREADY WARM
            // ============================================

            if (
              data?.warm === true ||
              data?.alreadyWarm === true
            ) {
              setWarmMessage(
                "Job store is ready. Loading companies..."
              );

              return true;
            }

            // ============================================
            // WARMING
            // ============================================

            if (
              data?.warming === true
            ) {
              setWarmingStore(true);

              const fetched =
                Number(
                  data?.warmState
                    ?.fetchedCount ||
                    0
                );

              const stored =
                Number(
                  data?.warmState
                    ?.storedCount ||
                    0
                );

              if (
                fetched > 0 ||
                stored > 0
              ) {
                setWarmMessage(
                  `Preparing company data... ${stored || fetched} jobs processed.`
                );
              } else {
                setWarmMessage(
                  "Preparing company data from the job source..."
                );
              }

              await wait(
                WARM_POLL_INTERVAL,
                controller.signal
              );

              continue;
            }

            // ============================================
            // STORE NOT WARM YET
            // ============================================

            setWarmingStore(true);

            setWarmMessage(
              "Preparing company data..."
            );

            await wait(
              WARM_POLL_INTERVAL,
              controller.signal
            );
          }

          // =================================================
          // TIMEOUT
          // =================================================

          throw new Error(
            "Job data is taking longer than expected to load. Please try again."
          );
        } catch (err) {
          if (
            err?.name ===
            "AbortError"
          ) {
            return false;
          }

          console.error(
            "CareerOS Companies Warm-Up Error:",
            err
          );

          throw err;
        } finally {
          if (
            warmAbortControllerRef.current ===
            controller
          ) {
            warmAbortControllerRef.current =
              null;
          }

          warmRequestRef.current =
            false;

          setWarmingStore(false);
        }
      },
      [wait]
    );

  // ====================================================
  // LOAD COMPANIES
  // ====================================================

  const loadCompanies = useCallback(
    async ({
      pageNumber = 1,
      append = false,
      ensureWarm = false,
    } = {}) => {
      // ------------------------------------------------
      // CANCEL PREVIOUS COMPANY REQUEST
      // ------------------------------------------------

      if (
        abortControllerRef.current
      ) {
        abortControllerRef.current.abort();
      }

      const controller =
        new AbortController();

      abortControllerRef.current =
        controller;

      const requestId =
        ++requestIdRef.current;

      // ------------------------------------------------
      // LOADING STATE
      // ------------------------------------------------

      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      setError("");

      try {
        // =================================================
        // DIRECT COMPANIES ACCESS
        // =================================================
        //
        // Only the initial Companies load uses warm-up.
        //
        // Refreshing the company list does not need to
        // start another warm flow because the backend
        // already protects against duplicate warming.
        //
        // =================================================

        if (
          ensureWarm
        ) {
          setWarmMessage(
            "Checking the CareerOS job store..."
          );

          const warmReady =
            await ensureJobStoreWarm();

          if (
            !warmReady
          ) {
            return;
          }
        }

        // =================================================
        // COMPANY API
        // =================================================
        //
        // This endpoint ONLY reads the existing CareerOS
        // job store.
        //
        // It does NOT trigger the Adzuna category search.
        //
        // =================================================

        const params =
          new URLSearchParams();

        params.set(
          "page",
          String(pageNumber)
        );

        const response =
          await fetch(
            `https://career-os-api-1h85.onrender.com/api/jobs/companies?${params.toString()}`,
            {
              signal:
                controller.signal,
              cache: "no-store",
            }
          );

        // ------------------------------------------------
        // PARSE RESPONSE
        // ------------------------------------------------

        let data;

        try {
          data =
            await response.json();
        } catch {
          throw new Error(
            "The server returned an invalid response."
          );
        }

        // ------------------------------------------------
        // VALIDATE RESPONSE
        // ------------------------------------------------

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Failed to load companies."
          );
        }

        // ------------------------------------------------
        // IGNORE STALE REQUEST
        // ------------------------------------------------

        if (
          requestId !==
          requestIdRef.current
        ) {
          return;
        }

        // =================================================
        // READ COMPANIES FROM BACKEND
        // =================================================

        const newCompanies =
          Array.isArray(
            data.companies
          )
            ? data.companies
            : [];

        // =================================================
        // APPEND / REPLACE
        // =================================================

        if (append) {
          setCompanies(
            (previousCompanies) => {
              const companyMap =
                new Map();

              // --------------------------------------------
              // EXISTING COMPANIES
              // --------------------------------------------

              previousCompanies.forEach(
                (company) => {
                  if (!company) {
                    return;
                  }

                  companyMap.set(
                    company.id,
                    company
                  );
                }
              );

              // --------------------------------------------
              // NEW COMPANIES
              // --------------------------------------------

              newCompanies.forEach(
                (company) => {
                  if (!company) {
                    return;
                  }

                  const existing =
                    companyMap.get(
                      company.id
                    );

                  if (!existing) {
                    companyMap.set(
                      company.id,
                      company
                    );

                    return;
                  }

                  // ----------------------------------------
                  // MERGE JOBS
                  // ----------------------------------------

                  const existingJobs =
                    Array.isArray(
                      existing.jobs
                    )
                      ? existing.jobs
                      : [];

                  const newJobs =
                    Array.isArray(
                      company.jobs
                    )
                      ? company.jobs
                      : [];

                  const existingJobIds =
                    new Set(
                      existingJobs.map(
                        (job) =>
                          String(
                            job?.id ||
                              job?.redirect_url ||
                              ""
                          )
                      )
                    );

                  const mergedJobs = [
                    ...existingJobs,
                  ];

                  newJobs.forEach(
                    (job) => {
                      const jobId =
                        String(
                          job?.id ||
                            job?.redirect_url ||
                            ""
                        );

                      if (
                        !existingJobIds.has(
                          jobId
                        )
                      ) {
                        existingJobIds.add(
                          jobId
                        );

                        mergedJobs.push(
                          job
                        );
                      }
                    }
                  );

                  companyMap.set(
                    company.id,
                    {
                      ...existing,

                      ...company,

                      jobs:
                        mergedJobs,

                      jobCount:
                        mergedJobs.length,
                    }
                  );
                }
              );

              return Array.from(
                companyMap.values()
              );
            }
          );
        } else {
          setCompanies(
            newCompanies
          );
        }

        // =================================================
        // PAGINATION STATE
        // =================================================

        setPage(
          pageNumber
        );

        setHasLoaded(
          true
        );

        setTotalCompanies(
          Number(
            data.total ||
              newCompanies.length
          )
        );

        setTotalJobsScanned(
          Number(
            data.jobs_scanned ||
              0
          )
        );

        setHasMore(
          Boolean(
            data.has_more
          )
        );

        setWarmMessage("");
      } catch (err) {
        // ------------------------------------------------
        // ABORTED REQUEST
        // ------------------------------------------------

        if (
          err.name ===
          "AbortError"
        ) {
          return;
        }

        console.error(
          "CareerOS Companies Error:",
          err
        );

        // ------------------------------------------------
        // ERROR STATE
        // ------------------------------------------------

        if (!append) {
          setCompanies([]);

          setTotalCompanies(0);

          setTotalJobsScanned(0);

          setHasMore(false);
        }

        setError(
          err.message ||
            "Unable to load companies. Please try again."
        );
      } finally {
        if (
          requestId ===
          requestIdRef.current
        ) {
          setLoading(false);

          setLoadingMore(false);
        }
      }
    },
    [ensureJobStoreWarm]
  );

  // ====================================================
  // INITIAL LOAD
  // ====================================================
  //
  // IMPORTANT:
  //
  // Companies can now be opened directly.
  //
  // It first ensures the job store is warm and then
  // reads companies from the cached store.
  //
  // ====================================================

  useEffect(() => {
  let cancelled = false;

  const initializeCompanies = async () => {
    if (cancelled) {
      return;
    }

    await loadCompanies({
      pageNumber: 1,
      append: false,
      ensureWarm: true,
    });
  };

  initializeCompanies();

  return () => {
    cancelled = true;

    if (
      abortControllerRef.current
    ) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    if (
      warmAbortControllerRef.current
    ) {
      warmAbortControllerRef.current.abort();
      warmAbortControllerRef.current = null;
    }

    warmRequestRef.current = false;
  };
}, [loadCompanies]);

  // ====================================================
  // CATEGORY OPTIONS
  // ====================================================

  const categoryOptions =
    useMemo(() => {
      const values =
        new Set();

      companies.forEach(
        (company) => {
          if (
            company?.category
          ) {
            values.add(
              company.category
            );
          }
        }
      );

      return [
        "All Categories",
        ...Array.from(values).sort(
          (a, b) =>
            String(a).localeCompare(
              String(b)
            )
        ),
      ];
    }, [companies]);

  // ====================================================
  // LOCATION OPTIONS
  // ====================================================

  const locationOptions =
    useMemo(() => {
      const values =
        new Set();

      companies.forEach(
        (company) => {
          if (
            company?.location
          ) {
            values.add(
              company.location
            );
          }
        }
      );

      return [
        "All Locations",
        ...Array.from(values).sort(
          (a, b) =>
            String(a).localeCompare(
              String(b)
            )
        ),
      ];
    }, [companies]);

  // ====================================================
  // FILTERED COMPANIES
  // ====================================================

  const filteredCompanies =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      return companies
        .filter((company) => {
          // --------------------------------------------
          // SEARCH
          // --------------------------------------------

          if (
            normalizedSearch
          ) {
            const searchableText =
              [
                company?.name,
                company?.category,
                company?.location,
              ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            if (
              !searchableText.includes(
                normalizedSearch
              )
            ) {
              return false;
            }
          }

          // --------------------------------------------
          // LOCATION
          // --------------------------------------------

          if (
            locationFilter !==
              "All Locations" &&
            company?.location !==
              locationFilter
          ) {
            return false;
          }

          // --------------------------------------------
          // CATEGORY
          // --------------------------------------------

          if (
            categoryFilter !==
              "All Categories" &&
            company?.category !==
              categoryFilter
          ) {
            return false;
          }

          return true;
        })
        .sort((a, b) => {
          const aCount =
            Number(
              a?.jobCount || 0
            );

          const bCount =
            Number(
              b?.jobCount || 0
            );

          // More jobs first.
          if (
            bCount !==
            aCount
          ) {
            return (
              bCount -
              aCount
            );
          }

          return String(
            a?.name || ""
          ).localeCompare(
            String(
              b?.name || ""
            )
          );
        });
    }, [
      companies,
      search,
      locationFilter,
      categoryFilter,
    ]);

  // ====================================================
  // COMPANY OPEN
  // ====================================================

  const handleCompanyClick =
    useCallback(
      (company) => {
        if (!company) {
          return;
        }

        navigate(
          `/companies/${encodeURIComponent(
            company.name
          )}`,
          {
            state: {
              company,
            },
          }
        );
      },
      [navigate]
    );

  // ====================================================
  // CLEAR FILTERS
  // ====================================================

  const clearFilters =
    useCallback(() => {
      setSearch("");

      setLocationFilter(
        "All Locations"
      );

      setCategoryFilter(
        "All Categories"
      );
    }, []);

  // ====================================================
  // REFRESH COMPANIES
  // ====================================================

  const handleRefresh =
    useCallback(() => {
      setError("");

      setHasLoaded(false);

      loadCompanies({
        pageNumber: 1,
        append: false,
        ensureWarm: false,
      });
    }, [loadCompanies]);

  // ====================================================
  // RETRY
  // ====================================================

  const handleRetry =
    useCallback(() => {
      setError("");

      setHasLoaded(false);

      loadCompanies({
        pageNumber: 1,
        append: false,
        ensureWarm: true,
      });
    }, [loadCompanies]);

  // ====================================================
  // LOAD MORE
  // ====================================================

  const canLoadMore =
    !loading &&
    !loadingMore &&
    hasMore &&
    companies.length > 0;

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="text-center">

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Explore Companies
        </h1>

        <p className="text-gray-500 mt-4 text-lg">
          Discover companies hiring across India
          and explore their available opportunities.
        </p>

      </div>

      {/* ==================================================
          SEARCH + FILTERS
      ================================================== */}

      <div className="mt-10 bg-white rounded-2xl shadow-md border p-6">

        <div className="flex flex-col lg:flex-row gap-3">

          {/* SEARCH */}

          <div className="flex-1 relative">

            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search companies..."
              className="w-full border border-gray-300 rounded-xl pl-11 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

          </div>

          {/* LOCATION */}

          <select
            value={locationFilter}
            onChange={(event) =>
              setLocationFilter(
                event.target.value
              )
            }
            className="border border-gray-300 rounded-xl px-4 py-3.5 bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >

            {locationOptions.map(
              (location) => (
                <option
                  key={location}
                  value={location}
                >
                  {location}
                </option>
              )
            )}

          </select>

          {/* CATEGORY */}

          <select
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(
                event.target.value
              )
            }
            className="border border-gray-300 rounded-xl px-4 py-3.5 bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >

            {categoryOptions.map(
              (category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              )
            )}

          </select>

          {/* REFRESH */}

          <button
            type="button"
            onClick={
              handleRefresh
            }
            disabled={
              loading ||
              warmingStore
            }
            className="flex items-center justify-center gap-2 border border-blue-600 text-blue-600 hover:bg-blue-50 disabled:opacity-50 px-6 py-3.5 rounded-xl font-semibold transition"
          >

            <RefreshCw
              size={18}
              className={
                loading ||
                warmingStore
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh

          </button>

        </div>

        {/* FILTER STATUS */}

        <div className="flex flex-wrap items-center justify-between gap-3 mt-4">

          <p className="text-sm text-gray-500">

            {filteredCompanies.length.toLocaleString(
              "en-IN"
            )}{" "}
            companies shown

          </p>

          {(search ||
            locationFilter !==
              "All Locations" ||
            categoryFilter !==
              "All Categories") && (
            <button
              type="button"
              onClick={
                clearFilters
              }
              className="text-sm text-gray-500 hover:text-blue-600 font-medium"
            >
              ✕ Clear Filters
            </button>
          )}

        </div>

      </div>

      {/* ==================================================
          JOB STORE WARMING
      ================================================== */}

      {loading &&
        warmingStore && (
          <div className="text-center py-16">

            <div className="flex justify-center mb-4">

              <RefreshCw
                size={42}
                className="text-blue-600 animate-spin"
              />

            </div>

            <p className="text-gray-700 font-semibold text-lg">
              Preparing companies...
            </p>

            <p className="text-gray-500 mt-2">
              {warmMessage ||
                "Preparing job data for the Companies page."}
            </p>

            <p className="text-sm text-gray-400 mt-2">
              This happens automatically when
              Companies is opened directly.
            </p>

          </div>
        )}

      {/* ==================================================
          NORMAL LOADING
      ================================================== */}

      {loading &&
        !warmingStore && (
          <div className="text-center py-16">

            <div className="text-4xl mb-3">
              🔄
            </div>

            <p className="text-gray-500">
              Loading companies...
            </p>

            <p className="text-sm text-gray-400 mt-2">
              Reading companies from the CareerOS
              job store.
            </p>

          </div>
        )}

      {/* ==================================================
          ERROR
      ================================================== */}

      {!loading &&
        error && (
          <div className="mt-8 bg-red-50 border border-red-200 rounded-2xl p-8 text-center">

            <div className="text-4xl mb-3">
              ⚠️
            </div>

            <h2 className="font-bold text-red-700 text-xl">
              Unable to load companies
            </h2>

            <p className="text-red-600 mt-2">
              {error}
            </p>

            <button
              type="button"
              onClick={
                handleRetry
              }
              className="mt-5 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-semibold"
            >
              Try Again
            </button>

          </div>
        )}

      {/* ==================================================
          RESULTS
      ================================================== */}

      {!loading &&
        !error &&
        hasLoaded && (
          <div className="mt-10">

            {/* ==================================================
                EMPTY STORE
            ================================================== */}

            {companies.length === 0 ? (
              <div className="bg-gray-50 border rounded-2xl text-center p-12">

                <Building2
                  size={52}
                  className="mx-auto text-gray-400"
                />

                <h2 className="text-2xl font-bold text-gray-800 mt-5">
                  No companies available yet
                </h2>

                <p className="text-gray-500 mt-2 max-w-xl mx-auto">
                  No companies were found in the
                  CareerOS job store yet. Try refreshing
                  the page to load the latest job data.
                </p>

                <button
                  type="button"
                  onClick={
                    handleRetry
                  }
                  className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold"
                >
                  Refresh Companies
                </button>

              </div>
            ) : (
              <>
                {/* ==================================================
                    RESULTS HEADER
                ================================================== */}

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                  <div>

                    <h2 className="text-2xl font-bold text-gray-900">
                      Companies Hiring Now
                    </h2>

                    <p className="text-gray-500 mt-1">

                      Showing{" "}

                      <span className="font-semibold text-gray-700">
                        {filteredCompanies.length.toLocaleString(
                          "en-IN"
                        )}
                      </span>{" "}

                      companies from{" "}

                      <span className="font-semibold text-gray-700">
                        {totalCompanies.toLocaleString(
                          "en-IN"
                        )}
                      </span>{" "}

                      discovered

                    </p>

                  </div>

                  <div className="text-sm text-gray-400">

                    {totalJobsScanned.toLocaleString(
                      "en-IN"
                    )}{" "}
                    jobs in store

                  </div>

                </div>

                {/* ==================================================
                    COMPANY CARDS
                ================================================== */}

                {filteredCompanies.length > 0 ? (
                  <>

                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

                      {filteredCompanies.map(
                        (company) => (
                          <div
                            key={
                              company.id
                            }
                            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-blue-200 transition"
                          >

                            {/* COMPANY HEADER */}

                            <div className="flex items-start gap-4">

                              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">

                                <span className="font-bold text-lg">
                                  {getInitials(
                                    company.name
                                  )}
                                </span>

                              </div>

                              <div className="min-w-0">

                                <h3 className="text-xl font-bold text-gray-900 truncate">
                                  {company.name}
                                </h3>

                                <p className="text-sm text-gray-500 mt-1">
                                  {company.category ||
                                    "Other"}
                                </p>

                              </div>

                            </div>

                            {/* COMPANY INFO */}

                            <div className="mt-6 space-y-3">

                              <div className="flex items-center gap-2 text-gray-600">

                                <MapPin
                                  size={18}
                                  className="text-gray-400"
                                />

                                <span className="text-sm">
                                  {company.location ||
                                    "India"}
                                </span>

                              </div>

                              <div className="flex items-center gap-2 text-gray-600">

                                <BriefcaseBusiness
                                  size={18}
                                  className="text-gray-400"
                                />

                                <span className="text-sm">

                                  {Number(
                                    company.jobCount ||
                                      0
                                  ).toLocaleString(
                                    "en-IN"
                                  )}{" "}

                                  open{" "}

                                  {Number(
                                    company.jobCount ||
                                      0
                                  ) === 1
                                    ? "job"
                                    : "jobs"}

                                </span>

                              </div>

                            </div>

                            {/* ACTION */}

                            <div className="flex gap-3 mt-6">

                              <button
                                type="button"
                                onClick={() =>
                                  handleCompanyClick(
                                    company
                                  )
                                }
                                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold transition"
                              >

                                View Company

                                <ArrowRight
                                  size={17}
                                />

                              </button>

                            </div>

                          </div>
                        )
                      )}

                    </div>

                    {/* ==================================================
                        LOAD MORE
                    ================================================== */}

                    {canLoadMore && (
                      <div className="flex flex-col items-center mt-10">

                        <button
                          type="button"
                          onClick={() =>
                            loadCompanies({
                              pageNumber:
                                page + 1,
                              append: true,
                              ensureWarm: false,
                            })
                          }
                          disabled={
                            loadingMore
                          }
                          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-xl font-semibold transition"
                        >

                          {loadingMore
                            ? "Loading more companies..."
                            : "Load More Companies →"}

                        </button>

                        <p className="text-sm text-gray-400 mt-3">
                          More companies are available
                          in the CareerOS job store.
                        </p>

                      </div>
                    )}

                  </>
                ) : (
                  /* ==================================================
                     FILTERED NO RESULTS
                  ================================================== */

                  <div className="bg-gray-50 border rounded-2xl text-center p-12">

                    <Building2
                      size={52}
                      className="mx-auto text-gray-400"
                    />

                    <h2 className="text-2xl font-bold text-gray-800 mt-5">
                      No companies found
                    </h2>

                    <p className="text-gray-500 mt-2">
                      Try changing your company search
                      or filters.
                    </p>

                    <button
                      type="button"
                      onClick={
                        clearFilters
                      }
                      className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold"
                    >
                      Clear Filters
                    </button>

                  </div>
                )}

              </>
            )}

          </div>
        )}

    </div>
  );
}

export default Companies;