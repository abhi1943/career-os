
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
  ArrowDownUp,
} from "lucide-react";

import JobCard from "../../components/jobs/JobCard";
import JobRefreshStatus from "../../components/jobs/JobRefreshStatus";

import { getJobs } from "../../services/jobService";
import api from "../../services/api";

import { getSavedJobs } from "../../services/savedJobsService";

import { CareerContext } from "../../context/CareerContext";
import { AuthContext } from "../../context/AuthContext";

import { calculateJobMatch } from "../../utils/jobMatcher";

// ==================================================
// JOB CATEGORIES
// ==================================================

const JOB_CATEGORIES = [
  {
    id: "IT",
    name: "IT & Software",
    description:
      "Software, web, data, cloud and technology jobs",
  },
  {
    id: "Non-IT",
    name: "Non-IT",
    description:
      "Business, sales, HR, operations and other roles",
  },
  {
    id: "Medical",
    name: "Medical & Healthcare",
    description:
      "Doctors, nurses, pharmacists and healthcare jobs",
  },
  {
    id: "Mechanical",
    name: "Mechanical",
    description:
      "Mechanical, automobile and manufacturing jobs",
  },
  {
    id: "Education",
    name: "Education",
    description:
      "Teaching, training and academic jobs",
  },
  {
    id: "Finance",
    name: "Finance & Banking",
    description:
      "Accounting, banking, finance and insurance jobs",
  },
  {
    id: "Government",
    name: "Government",
    description:
      "Government and public-sector opportunities",
  },
  {
    id: "Other",
    name: "Other Careers",
    description:
      "Jobs from other professional categories",
  },
];

// ==================================================
// LOCATION OPTIONS
// ==================================================

const LOCATION_OPTIONS = [
  "India",
  "Remote",
  "Hyderabad",
  "Bangalore",
  "Bengaluru",
  "Chennai",
  "Mumbai",
  "Delhi",
  "New Delhi",
  "Pune",
  "Kolkata",
  "Noida",
  "Gurgaon",
  "Gurugram",
  "Ahmedabad",
  "Jaipur",
  "Chandigarh",
  "Kochi",
  "Coimbatore",
  "Visakhapatnam",
  "Vijayawada",
  "Tirupati",
  "Kadapa",
  "Kurnool",
  "Nellore",
  "Warangal",
  "Mysore",
  "Mysuru",
  "Thiruvananthapuram",
  "Bhubaneswar",
  "Lucknow",
  "Indore",
  "Bhopal",
  "Nagpur",
  "Surat",
  "Vadodara",
  "Patna",
  "Ranchi",
  "Dehradun",
  "Guwahati",
  "Mangaluru",
  "Madurai",
  "Trichy",
  "Salem",
  "Hubli",
  "Rajahmundry",
  "Anantapur",
  "Srikakulam",
  "Kakinada",
  "Ongole",
];

// ==================================================
// CONSTANTS
// ==================================================

const RESULTS_PER_PAGE = 50;

// ==================================================
// JOBS PAGE
// ==================================================

function Jobs() {
  const navigate = useNavigate();

  const { student } = useContext(CareerContext);
  const { user, authLoading } = useContext(AuthContext);

  // ==================================================
  // SEARCH INPUT
  // ==================================================

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  // ==================================================
  // APPLIED SEARCH
  // ==================================================

  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedLocation, setAppliedLocation] =
    useState("India");

  // ==================================================
  // CATEGORY
  // ==================================================

  const [selectedCategory, setSelectedCategory] =
    useState("");

  const [appliedCategory, setAppliedCategory] =
    useState("");

  // ==================================================
  // FILTERS
  // ==================================================

  const [experience, setExperience] =
    useState("Any Experience");

  const [jobType, setJobType] =
    useState("Any Type");

  const [workMode, setWorkMode] =
    useState("Any");

  const [salary, setSalary] =
    useState("Any Salary");

  // ==================================================
  // APPLIED FILTERS
  // ==================================================

  const [appliedExperience, setAppliedExperience] =
    useState("Any Experience");

  const [appliedJobType, setAppliedJobType] =
    useState("Any Type");

  const [appliedWorkMode, setAppliedWorkMode] =
    useState("Any");

  const [appliedSalary, setAppliedSalary] =
    useState("Any Salary");

  // ==================================================
  // SORT
  // ==================================================

  const [sortBy, setSortBy] =
    useState("recommended");

  // ==================================================
  // JOB STATE
  // ==================================================

  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] =
    useState(false);

  /*
   * IMPORTANT:
   * The initial value is true because jobs are intentionally
   * not loaded until the user selects a category.
   *
   * This removes the unnecessary mount effect that previously
   * called setJobs(), setTotalJobs(), setHasMore(), etc.
   */
  const [initialJobsLoaded, setInitialJobsLoaded] =
    useState(true);

  const [loadingMore, setLoadingMore] =
    useState(false);

  const [error, setError] =
    useState("");

  // ==================================================
  // SAVED JOBS
  // ==================================================

  const [savedJobs, setSavedJobs] =
    useState([]);

  const [savedJobsLoading, setSavedJobsLoading] =
    useState(false);

  const [savedJobsError, setSavedJobsError] =
    useState("");

  // ==================================================
  // JOB SECTION TAB
  // ==================================================

  const [activeTab, setActiveTab] =
    useState("explore");

  // ==================================================
  // PAGINATION
  // ==================================================

  const [page, setPage] =
    useState(1);

  const [hasMore, setHasMore] =
    useState(false);

  const [totalJobs, setTotalJobs] =
    useState(0);

  // ==================================================
  // ALERT STATE
  // ==================================================

  const [savingAlert, setSavingAlert] =
    useState(false);

  const [alertMessage, setAlertMessage] =
    useState("");

  const [alertError, setAlertError] =
    useState("");

  // ==================================================
  // REFRESH STATE
  // ==================================================

  const [refreshKey, setRefreshKey] =
    useState(0);

  // ==================================================
  // REQUEST TRACKING
  // ==================================================

  const requestIdRef =
    useRef(0);

  // ==================================================
  // GET STABLE JOB ID
  // ==================================================

  const getJobId = useCallback((job) => {
    if (!job) {
      return "";
    }

    const company =
      typeof job.company === "string"
        ? job.company
        : job.company?.display_name ||
        job.company?.name ||
        "";

    const locationName =
      typeof job.location === "string"
        ? job.location
        : job.location?.display_name ||
        job.location?.name ||
        "";

    return String(
      job.redirect_url ||
      job.redirectUrl ||
      job.url ||
      job.id ||
      job.job_id ||
      job.jobId ||
      `${job.title || ""}-${company}-${locationName}`
    ).trim();
  }, []);

  // ==================================================
  // REMOVE DUPLICATE JOBS
  // ==================================================

  const removeDuplicateJobs = useCallback(
    (jobsList = []) => {
      const seen = new Set();

      return jobsList.filter((job) => {
        const id = getJobId(job);

        if (!id) {
          return true;
        }

        if (seen.has(id)) {
          return false;
        }

        seen.add(id);

        return true;
      });
    },
    [getJobId]
  );

  // ==================================================
  // LOAD SAVED JOBS
  // ==================================================

  const fetchSavedJobs = useCallback(async () => {
    if (authLoading) {
      return;
    }

    if (!user?.uid) {
      setSavedJobs([]);
      setSavedJobsLoading(false);
      setSavedJobsError("");
      return;
    }

    setSavedJobsLoading(true);
    setSavedJobsError("");

    try {
      const result = await getSavedJobs();

      setSavedJobs(
        Array.isArray(result)
          ? result
          : []
      );
    } catch (err) {
      console.error(
        "CareerOS Saved Jobs Error:",
        err
      );

      setSavedJobs([]);

      setSavedJobsError(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to load saved jobs."
      );
    } finally {
      setSavedJobsLoading(false);
    }
  }, [authLoading, user?.uid]);

  // ==================================================
  // AUTH → SAVED JOBS
  //
  // IMPORTANT:
  // Schedule the async operation instead of invoking the
  // state-changing callback synchronously from the effect.
  // ==================================================

  useEffect(() => {
    if (authLoading) {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      void fetchSavedJobs();
    }, 0);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [
    authLoading,
    user?.uid,
    fetchSavedJobs,
  ]);

  // ==================================================
  // GLOBAL SAVED JOB SYNCHRONIZATION
  // ==================================================

  useEffect(() => {
    const handleSavedJobsChanged = (event) => {
      const detail = event?.detail || {};

      const changedUserId =
        detail?.userId;

      const changedJobId =
        detail?.jobId;

      const changedSaved =
        detail?.saved;

      const changedJob =
        detail?.job;

      // ==================================================
      // IGNORE OTHER USERS
      // ==================================================

      if (
        changedUserId &&
        String(changedUserId) !==
        String(user?.uid || "")
      ) {
        return;
      }

      if (!changedJobId) {
        return;
      }

      // ==================================================
      // SAVE
      // ==================================================

      if (changedSaved === true) {
        setSavedJobs((previousJobs) => {
          const alreadyExists =
            previousJobs.some(
              (savedJob) =>
                getJobId(savedJob) ===
                String(changedJobId)
            );

          if (alreadyExists) {
            return previousJobs;
          }

          if (!changedJob) {
            return previousJobs;
          }

          return [
            ...previousJobs,
            {
              ...changedJob,
              id: String(changedJobId),
            },
          ];
        });

        return;
      }

      // ==================================================
      // REMOVE
      // ==================================================

      if (changedSaved === false) {
        setSavedJobs((previousJobs) =>
          previousJobs.filter(
            (savedJob) =>
              getJobId(savedJob) !==
              String(changedJobId)
          )
        );
      }
    };

    window.addEventListener(
      "careerOS:savedJobsChanged",
      handleSavedJobsChanged
    );

    return () => {
      window.removeEventListener(
        "careerOS:savedJobsChanged",
        handleSavedJobsChanged
      );
    };
  }, [
    user?.uid,
    getJobId,
  ]);

  // ==================================================
  // GET JOBS FROM API
  //
  // IMPORTANT:
  // Jobs are loaded ONLY after selecting a category.
  // There is NO all-jobs request.
  // ==================================================

  const fetchJobs = useCallback(
    async (
      requestedPage = 1,
      append = false,
      searchValue = appliedSearch,
      locationValue = appliedLocation,
      experienceValue = appliedExperience,
      jobTypeValue = appliedJobType,
      workModeValue = appliedWorkMode,
      salaryValue = appliedSalary,
      categoryValue =
        appliedCategory || selectedCategory
    ) => {
      // ==================================================
      // CATEGORY IS REQUIRED
      // ==================================================

      if (!categoryValue) {
        setJobs([]);
        setTotalJobs(0);
        setHasMore(false);
        setLoading(false);
        setLoadingMore(false);
        return;
      }

      // ==================================================
      // REQUEST ID
      // ==================================================

      const currentRequest =
        ++requestIdRef.current;

      // ==================================================
      // LOADING STATE
      // ==================================================

      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setError("");
      }

      try {
        // ==================================================
        // REQUEST
        // ==================================================

        const response = await getJobs({
          career:
            searchValue?.trim() || "",

          category:
            categoryValue,

          location:
            locationValue?.trim() || "India",

          page:
            requestedPage,

          experience:
            experienceValue,

          jobType:
            jobTypeValue,

          workMode:
            workModeValue,

          salary:
            salaryValue,
        });

        // ==================================================
        // IGNORE STALE REQUEST
        // ==================================================

        if (
          currentRequest !==
          requestIdRef.current
        ) {
          return;
        }

        

        // ==================================================
        // NORMALIZE RESPONSE
        // ==================================================

        const responseJobs =
          Array.isArray(response)
            ? response
            : Array.isArray(response?.jobs)
              ? response.jobs
              : Array.isArray(response?.results)
                ? response.results
                : Array.isArray(response?.data)
                  ? response.data
                  : [];

        // ==================================================
        // REMOVE DUPLICATES
        // ==================================================

        const uniqueJobs =
          removeDuplicateJobs(
            responseJobs
          );

        // ==================================================
        // UPDATE JOBS
        // ==================================================

        setJobs((previousJobs) => {
          if (!append) {
            return uniqueJobs;
          }

          return removeDuplicateJobs([
            ...previousJobs,
            ...uniqueJobs,
          ]);
        });

        // ==================================================
        // TOTAL
        // ==================================================

        const responseTotal =
          Number(
            response?.total ??
            response?.totalJobs ??
            response?.total_jobs ??
            response?.storeTotal ??
            response?.storedTotal ??
            response?.careerOSTotal ??
            response?.careerosTotal ??
            response?.availableJobs ??
            response?.available_jobs ??
            uniqueJobs.length
          );

        setTotalJobs(
          Number.isFinite(responseTotal)
            ? responseTotal
            : uniqueJobs.length
        );

        // ==================================================
        // HAS MORE
        // ==================================================

        const explicitHasMore =
          response?.hasMore ??
          response?.has_more ??
          response?.pagination?.hasMore ??
          response?.pagination?.has_more;

        if (
          typeof explicitHasMore ===
          "boolean"
        ) {
          setHasMore(
            explicitHasMore
          );
        } else {
          setHasMore(
            uniqueJobs.length >=
            RESULTS_PER_PAGE
          );
        }

        // ==================================================
        // PAGE
        // ==================================================

        setPage(
          requestedPage
        );

        setInitialJobsLoaded(
          true
        );

        setError("");
      } catch (err) {
        // Ignore stale request errors.
        if (
          currentRequest !==
          requestIdRef.current
        ) {
          return;
        }

        console.error(
          "CareerOS Jobs Error:",
          err
        );

        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Unable to load jobs."
        );

        if (!append) {
          setJobs([]);
          setTotalJobs(0);
          setHasMore(false);
        }
      } finally {
        if (
          currentRequest ===
          requestIdRef.current
        ) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [
      appliedSearch,
      appliedLocation,
      appliedExperience,
      appliedJobType,
      appliedWorkMode,
      appliedSalary,
      appliedCategory,
      selectedCategory,
      removeDuplicateJobs,
    ]
  );

  // ==================================================
  // REFRESH AFTER BACKEND JOB UPDATE
  // ==================================================

  useEffect(() => {
    if (refreshKey === 0) {
      return undefined;
    }

    const timerId =
      window.setTimeout(() => {
        if (
          selectedCategory
        ) {
          void fetchJobs(
            1,
            false,
            appliedSearch,
            appliedLocation,
            appliedExperience,
            appliedJobType,
            appliedWorkMode,
            appliedSalary,
            appliedCategory ||
            selectedCategory
          );
        }
      }, 0);

    return () => {
      window.clearTimeout(
        timerId
      );
    };
  }, [
    refreshKey,
    selectedCategory,
    appliedSearch,
    appliedLocation,
    appliedExperience,
    appliedJobType,
    appliedWorkMode,
    appliedSalary,
    appliedCategory,
    fetchJobs,
  ]);

  // ==================================================
  // SELECT JOB CATEGORY
  // ==================================================

  const handleCategorySelect =
    (categoryId) => {
      const nextCategory =
        categoryId || "";

      setSelectedCategory(
        nextCategory
      );

      setAppliedCategory(
        nextCategory
      );

      setPage(1);

      setAlertMessage("");
      setAlertError("");
      setError("");

      // Invalidate previous request.
      requestIdRef.current += 1;

      // ==================================================
      // NO CATEGORY
      // ==================================================

      if (!nextCategory) {
        setJobs([]);
        setTotalJobs(0);
        setHasMore(false);
        setInitialJobsLoaded(
          true
        );
        setLoading(false);
        setLoadingMore(false);

        return;
      }

      // ==================================================
      // LOAD SELECTED CATEGORY ONLY
      // ==================================================

      void fetchJobs(
        1,
        false,
        appliedSearch,
        appliedLocation,
        appliedExperience,
        appliedJobType,
        appliedWorkMode,
        appliedSalary,
        nextCategory
      );
    };

  // ==================================================
  // SEARCH
  // ==================================================

  const handleSearch = () => {
    if (!selectedCategory) {
      return;
    }

    const nextSearch =
      search.trim();

    const nextLocation =
      location.trim() ||
      "India";

    const nextExperience =
      experience;

    const nextJobType =
      jobType;

    const nextWorkMode =
      workMode;

    const nextSalary =
      salary;

    setAppliedSearch(
      nextSearch
    );

    setAppliedLocation(
      nextLocation
    );

    setAppliedExperience(
      nextExperience
    );

    setAppliedJobType(
      nextJobType
    );

    setAppliedWorkMode(
      nextWorkMode
    );

    setAppliedSalary(
      nextSalary
    );

    setPage(1);

    void fetchJobs(
      1,
      false,
      nextSearch,
      nextLocation,
      nextExperience,
      nextJobType,
      nextWorkMode,
      nextSalary,
      selectedCategory
    );
  };

  // ==================================================
  // ENTER KEY SEARCH
  // ==================================================

  const handleSearchKeyDown =
    (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleSearch();
      }
    };

  // ==================================================
  // APPLY FILTERS
  // ==================================================

  const handleApplyFilters =
    () => {
      if (!selectedCategory) {
        return;
      }

      const nextSearch =
        search.trim();

      const nextLocation =
        location.trim() ||
        "India";

      const nextExperience =
        experience;

      const nextJobType =
        jobType;

      const nextWorkMode =
        workMode;

      const nextSalary =
        salary;

      setAppliedSearch(
        nextSearch
      );

      setAppliedLocation(
        nextLocation
      );

      setAppliedExperience(
        nextExperience
      );

      setAppliedJobType(
        nextJobType
      );

      setAppliedWorkMode(
        nextWorkMode
      );

      setAppliedSalary(
        nextSalary
      );

      setPage(1);

      void fetchJobs(
        1,
        false,
        nextSearch,
        nextLocation,
        nextExperience,
        nextJobType,
        nextWorkMode,
        nextSalary,
        selectedCategory
      );
    };

  // ==================================================
  // LOAD MORE
  // ==================================================

  const loadMoreJobs =
    async () => {
      if (
        !selectedCategory ||
        loading ||
        loadingMore ||
        !hasMore
      ) {
        return;
      }

      const nextPage =
        page + 1;

      await fetchJobs(
        nextPage,
        true
      );
    };

  // ==================================================
  // CALCULATE MATCH SCORES
  // ==================================================

  const jobsWithMatches =
    useMemo(() => {
      if (!jobs.length) {
        return [];
      }

      return jobs.map(
        (job) => {
          const match = student
            ? calculateJobMatch(
              job,
              student
            )
            : null;

          return {
            ...job,
            match,
          };
        }
      );
    }, [
      jobs,
      student,
    ]);

  // ==================================================
  // GET SALARY VALUE
  // ==================================================

  const getSalaryValue =
    useCallback((job) => {
      const salaryValue =
        Number(
          job?.salary ??
          job?.salaryValue ??
          job?.salary_min ??
          job?.salaryMin ??
          job?.minSalary ??
          0
        );

      if (
        Number.isFinite(
          salaryValue
        ) &&
        salaryValue > 0
      ) {
        return salaryValue;
      }

      const salaryText =
        String(
          job?.salaryDisplay ||
          job?.salary_display ||
          job?.salary ||
          ""
        );

      const numbers =
        salaryText.match(
          /\d+(?:\.\d+)?/g
        );

      if (!numbers?.length) {
        return 0;
      }

      return Math.max(
        ...numbers.map(Number)
      );
    }, []);

  // ==================================================
  // GET JOB DATE
  // ==================================================

  const getJobDate =
    useCallback((job) => {
      const dateValue =
        job?.created ||
        job?.created_at ||
        job?.createdAt ||
        job?.date ||
        job?.postedAt ||
        job?.posted_at ||
        job?.publicationDate ||
        job?.publication_date ||
        "";

      const timestamp =
        Date.parse(
          String(dateValue)
        );

      return Number.isNaN(
        timestamp
      )
        ? 0
        : timestamp;
    }, []);

  // ==================================================
  // SORT JOBS
  // ==================================================

  const recommendedJobs =
    useMemo(() => {
      if (
        !jobsWithMatches.length
      ) {
        return [];
      }

      const sortedJobs = [
        ...jobsWithMatches,
      ];

      switch (sortBy) {
        case "recommended":
          sortedJobs.sort(
            (a, b) => {
              const scoreA =
                Number(
                  a?.match?.score
                ) || 0;

              const scoreB =
                Number(
                  b?.match?.score
                ) || 0;

              return (
                scoreB - scoreA
              );
            }
          );
          break;

        case "newest":
          sortedJobs.sort(
            (a, b) =>
              getJobDate(b) -
              getJobDate(a)
          );
          break;

        case "salaryHigh":
          sortedJobs.sort(
            (a, b) =>
              getSalaryValue(b) -
              getSalaryValue(a)
          );
          break;

        case "salaryLow":
          sortedJobs.sort(
            (a, b) =>
              getSalaryValue(a) -
              getSalaryValue(b)
          );
          break;

        case "title":
          sortedJobs.sort(
            (a, b) =>
              String(
                a?.title || ""
              ).localeCompare(
                String(
                  b?.title || ""
                )
              )
          );
          break;

        default:
          break;
      }

      return sortedJobs;
    }, [
      jobsWithMatches,
      sortBy,
      getSalaryValue,
      getJobDate,
    ]);

  // ==================================================
  // PROFILE STATUS
  // ==================================================

  const hasRecommendationProfile =
    Boolean(
      student?.dreamCareer ||
      student?.targetRole ||
      student?.specialization ||
      student?.education ||
      student?.skills?.length
    );

  // ==================================================
  // CLEAR FILTERS / BACK TO CATEGORIES
  // ==================================================

  const resetFilters = () => {
    // Invalidate active request.
    requestIdRef.current += 1;

    setSearch("");
    setLocation("");

    setSelectedCategory("");
    setAppliedCategory("");

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

    setSortBy(
      "recommended"
    );

    setAppliedSearch("");

    setAppliedLocation(
      "India"
    );

    setAppliedExperience(
      "Any Experience"
    );

    setAppliedJobType(
      "Any Type"
    );

    setAppliedWorkMode(
      "Any"
    );

    setAppliedSalary(
      "Any Salary"
    );

    setAlertMessage("");
    setAlertError("");
    setError("");

    setJobs([]);
    setTotalJobs(0);
    setHasMore(false);
    setPage(1);

    setInitialJobsLoaded(
      true
    );

    setLoading(false);
    setLoadingMore(false);
  };

  // ==================================================
  // JOBS REFRESHED
  // ==================================================

  const handleJobsRefreshed =
    () => {
      setRefreshKey(
        (value) =>
          value + 1
      );
    };

  // ==================================================
  // MANUAL REFRESH
  // ==================================================

  const handleManualRefresh =
    () => {
      if (!selectedCategory) {
        return;
      }

      setPage(1);

      void fetchJobs(
        1,
        false,
        appliedSearch,
        appliedLocation,
        appliedExperience,
        appliedJobType,
        appliedWorkMode,
        appliedSalary,
        appliedCategory ||
        selectedCategory
      );
    };

  // ==================================================
  // SAVE SEARCH AS ALERT
  // ==================================================

  const handleSaveAsAlert =
    async () => {
      try {
        setSavingAlert(true);

        setAlertMessage("");
        setAlertError("");

        if (authLoading) {
          setAlertError(
            "Please wait while your account is being verified."
          );

          return;
        }

        if (!user?.uid) {
          setAlertError(
            "Please sign in before saving a job alert."
          );

          return;
        }

        if (!selectedCategory) {
          setAlertError(
            "Select a job category before saving an alert."
          );

          return;
        }

        const keyword =
          search.trim();

        if (!keyword) {
          setAlertError(
            "Enter a job keyword before saving an alert."
          );

          return;
        }

        const response =
          await api.post(
            "/job-alerts",
            {
              keyword,

              location:
                location.trim() ||
                "India",

              category:
                selectedCategory,

              experience,

              jobType,

              workMode,

              salary,

              frequency: "Daily",

              enabled: true,

              active: true,
            },
            {
              headers: {
                "x-user-id":
                  user.uid,
              },
            }
          );

        const data =
          response?.data;

        if (!data?.success) {
          throw new Error(
            data?.message ||
            data?.error ||
            "Failed to save job alert."
          );
        }

        setAlertMessage(
          "Job alert saved successfully."
        );
      } catch (err) {
        console.error(
          "Save Job Alert Error:",
          err
        );

        setAlertError(
          err?.response?.data
            ?.message ||
          err?.message ||
          "Unable to save job alert."
        );
      } finally {
        setSavingAlert(false);
      }
    };

  // ==================================================
  // VIEW JOB DETAILS
  // ==================================================

  const handleViewJob =
    (job) => {
      const jobId =
        getJobId(job);

      if (!jobId) {
        return;
      }

      navigate(
        `/jobs/${encodeURIComponent(
          jobId
        )}`,
        {
          state: {
            job,
          },
        }
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

  // ==================================================
  // SELECTED CATEGORY NAME
  // ==================================================

  const selectedCategoryName =
    useMemo(() => {
      if (!selectedCategory) {
        return "";
      }

      return (
        JOB_CATEGORIES.find(
          (category) =>
            category.id ===
            selectedCategory
        )?.name ||
        "Job Opportunities"
      );
    }, [
      selectedCategory,
    ]);

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <div className="min-h-screen bg-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-8">
          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <BriefcaseBusiness
                size={25}
              />
            </div>

            <div>
              <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide">
                CareerOS Jobs
              </p>

              <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                Latest Jobs
              </h1>

              <p className="text-gray-500 mt-1">
                Explore opportunities across
                different career fields.
              </p>
            </div>

          </div>
        </div>

        {/* ==================================================
            JOB REFRESH STATUS
        ================================================== */}

        <JobRefreshStatus
          onJobsRefreshed={
            handleJobsRefreshed
          }
        />

        {/* ==================================================
            JOB SECTION TABS
        ================================================== */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mb-6">

          <div className="flex flex-wrap gap-2">

            {/* EXPLORE JOBS */}

            <button
              type="button"
              onClick={() =>
                setActiveTab(
                  "explore"
                )
              }
              className={`flex-1 min-w-[160px] px-5 py-3 rounded-xl font-semibold transition ${
                activeTab === "explore"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <BriefcaseBusiness
                  size={18}
                />
                Explore Jobs
              </div>
            </button>

            {/* SAVED JOBS */}

            <button
              type="button"
              onClick={() => {
                setActiveTab(
                  "saved"
                );

                void fetchSavedJobs();
              }}
              className={`flex-1 min-w-[160px] px-5 py-3 rounded-xl font-semibold transition ${
                activeTab === "saved"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center justify-center gap-2">

                <span>♡</span>

                Saved Jobs

                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    activeTab === "saved"
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {savedJobs.length}
                </span>

              </div>
            </button>

          </div>

        </div>

        {/* ==================================================
            SAVED JOBS TAB
        ================================================== */}

        {activeTab === "saved" && (
          <div className="mb-8">

            <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8">

              <div className="flex items-center justify-between gap-4 mb-6">

                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    Saved Jobs
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Jobs you saved for later.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    void fetchSavedJobs()
                  }
                  disabled={
                    savedJobsLoading
                  }
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold disabled:text-blue-300"
                >
                  <RefreshCw
                    size={17}
                    className={
                      savedJobsLoading
                        ? "animate-spin"
                        : ""
                    }
                  />
                  Refresh
                </button>

              </div>

              {savedJobsError && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5">
                  {savedJobsError}
                </div>
              )}

              {savedJobsLoading ? (
                <div className="grid md:grid-cols-2 gap-6">

                  {Array.from({
                    length: 4,
                  }).map(
                    (_, index) => (
                      <div
                        key={index}
                        className="bg-slate-50 rounded-2xl p-6 animate-pulse"
                      >
                        <div className="h-6 bg-gray-200 rounded w-3/4" />

                        <div className="h-4 bg-gray-200 rounded w-1/2 mt-4" />

                        <div className="h-10 bg-gray-200 rounded-xl mt-6" />
                      </div>
                    )
                  )}

                </div>
              ) : savedJobs.length === 0 ? (
                <div className="text-center py-12">

                  <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <BriefcaseBusiness
                      size={32}
                    />
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 mt-5">
                    No Saved Jobs
                  </h3>

                  <p className="text-gray-500 mt-2">
                    Save interesting jobs from
                    Explore Jobs and they will
                    appear here.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveTab(
                        "explore"
                      )
                    }
                    className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
                  >
                    Explore Jobs
                  </button>

                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">

                  {savedJobs.map(
                    (job, index) => {
                      const jobId =
                        getJobId(job);

                      return (
                        <JobCard
                          key={
                            jobId ||
                            `saved-${index}`
                          }
                          job={job}
                          match={
                            student
                              ? calculateJobMatch(
                                job,
                                student
                              )
                              : null
                          }
                          onView={() =>
                            handleViewJob(
                              job
                            )
                          }
                          onSavedChange={(
                            changedJob,
                            saved
                          ) => {
                            const changedJobId =
                              getJobId(changedJob);

                            if (!changedJobId) {
                              return;
                            }

                            if (saved) {
                              setSavedJobs((previousJobs) => {
                                const alreadyExists =
                                  previousJobs.some(
                                    (savedJob) =>
                                      getJobId(savedJob) ===
                                      changedJobId
                                  );

                                if (alreadyExists) {
                                  return previousJobs;
                                }

                                return [
                                  ...previousJobs,
                                  changedJob,
                                ];
                              });

                              return;
                            }

                            setSavedJobs((previousJobs) =>
                              previousJobs.filter(
                                (savedJob) =>
                                  getJobId(savedJob) !==
                                  changedJobId
                              )
                            );
                          }}
                        />
                      );
                    }
                  )}

                </div>
              )}

            </div>

          </div>
        )}

        {/* ==================================================
            PROFILE STATUS
        ================================================== */}

        {hasRecommendationProfile ? (
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
                  Jobs are ranked using your
                  CareerOS profile, skills,
                  education, career goal,
                  role, and experience.
                </p>
              </div>

            </div>

          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-100 rounded-2xl px-5 py-4 mb-6">

            <p className="font-semibold text-amber-900">
              Complete your CareerOS profile for
              better recommendations
            </p>

            <p className="text-sm text-amber-700 mt-1">
              Add your career goal, education,
              skills, and experience to receive
              more accurate job matches.
            </p>

          </div>
        )}

        {/* ==================================================
            EXPLORE TAB
        ================================================== */}

        {activeTab === "explore" && (
          <>

            {/* ==================================================
                JOB CATEGORY DASHBOARD
            ================================================== */}

            <div className="mb-8">

              <div className="flex items-center justify-between mb-4">

                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    Explore Jobs by Category
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Choose a career field to discover
                    relevant opportunities.
                  </p>
                </div>

              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">

                {JOB_CATEGORIES.map(
                  (category) => {
                    const isSelected =
                      selectedCategory ===
                      category.id;

                    return (
                      <button
                        key={
                          category.id
                        }
                        type="button"
                        onClick={() =>
                          handleCategorySelect(
                            category.id
                          )
                        }
                        className={`text-left rounded-2xl border p-5 transition ${
                          isSelected
                            ? "bg-blue-600 border-blue-600 text-white shadow-lg"
                            : "bg-white border-gray-200 text-slate-800 hover:border-blue-300 hover:shadow-md"
                        }`}
                      >

                        <div className="flex items-center justify-between">

                          <BriefcaseBusiness
                            size={24}
                          />

                          {isSelected && (
                            <span className="text-xs font-bold">
                              SELECTED
                            </span>
                          )}

                        </div>

                        <div className="mt-4">

                          <h3 className="font-bold">
                            {category.name}
                          </h3>

                        </div>

                        <p
                          className={`text-sm mt-2 ${
                            isSelected
                              ? "text-blue-100"
                              : "text-gray-500"
                          }`}
                        >
                          {
                            category.description
                          }
                        </p>

                        <div
                          className={`text-xs font-semibold mt-4 ${
                            isSelected
                              ? "text-blue-100"
                              : "text-gray-400"
                          }`}
                        >
                          EXPLORE JOBS
                        </div>

                      </button>
                    );
                  }
                )}

              </div>
            </div>

            {/* ==================================================
                SEARCH + FILTERS
            ================================================== */}

            {selectedCategory && (
              <div className="bg-white rounded-3xl shadow-lg p-5 sm:p-6 mb-8">

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
                          event.target
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
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10"
                    />

                    <input
                      type="text"
                      value={
                        location
                      }
                      list="career-os-locations"
                      onChange={(
                        event
                      ) =>
                        setLocation(
                          event.target
                            .value
                        )
                      }
                      onKeyDown={
                        handleSearchKeyDown
                      }
                      placeholder="Search location"
                      autoComplete="off"
                      className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />

                    <datalist id="career-os-locations">
                      {LOCATION_OPTIONS.map(
                        (
                          locationOption
                        ) => (
                          <option
                            key={
                              locationOption
                            }
                            value={
                              locationOption
                            }
                          />
                        )
                      )}
                    </datalist>

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
                    <Search
                      size={18}
                    />
                    Search
                  </button>

                </div>

                {/* FILTER TITLE */}

                <div className="flex items-center gap-2 mt-6 mb-4">

                  <SlidersHorizontal
                    size={19}
                    className="text-blue-600"
                  />

                  <h2 className="font-semibold text-slate-700">
                    Job Filters
                  </h2>

                </div>

                {/* FILTERS */}

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">

                  {/* EXPERIENCE */}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience
                    </label>

                    <select
                      value={
                        experience
                      }
                      onChange={(
                        event
                      ) =>
                        setExperience(
                          event.target
                            .value
                        )
                      }
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
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
                  </div>

                  {/* JOB TYPE */}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Type
                    </label>

                    <select
                      value={
                        jobType
                      }
                      onChange={(
                        event
                      ) =>
                        setJobType(
                          event.target
                            .value
                        )
                      }
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
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
                  </div>

                  {/* WORK MODE */}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Work Mode
                    </label>

                    <select
                      value={
                        workMode
                      }
                      onChange={(
                        event
                      ) =>
                        setWorkMode(
                          event.target
                            .value
                        )
                      }
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
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
                  </div>

                  {/* SALARY */}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salary
                    </label>

                    <select
                      value={
                        salary
                      }
                      onChange={(
                        event
                      ) =>
                        setSalary(
                          event.target
                            .value
                        )
                      }
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
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

                </div>

                {/* ACTION BUTTONS */}

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
                      resetFilters
                    }
                    disabled={
                      loading
                    }
                    className="border border-gray-200 hover:bg-gray-50 disabled:opacity-50 text-gray-700 px-5 py-2.5 rounded-xl font-semibold transition"
                  >
                    Back to Categories
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleSaveAsAlert
                    }
                    disabled={
                      savingAlert ||
                      loading ||
                      authLoading
                    }
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition"
                  >
                    {savingAlert ? (
                      <>
                        <RefreshCw
                          size={17}
                          className="animate-spin"
                        />
                        Saving...
                      </>
                    ) : authLoading ? (
                      "Checking account..."
                    ) : (
                      <>
                        <Bell
                          size={17}
                        />
                        Save as Alert
                      </>
                    )}
                  </button>

                </div>

                {/* ALERT MESSAGE */}

                {alertMessage && (
                  <div className="mt-4 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3">
                    <p className="font-semibold">
                      {alertMessage}
                    </p>
                  </div>
                )}

                {alertError && (
                  <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3">
                    <p className="font-semibold">
                      {alertError}
                    </p>
                  </div>
                )}

              </div>
            )}

            {/* ==================================================
                RESULTS HEADER
            ================================================== */}

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

              <div>

                <h2 className="text-xl font-bold text-slate-800">
                  {selectedCategory
                    ? selectedCategoryName
                    : "Select a Job Category"}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {!selectedCategory
                    ? "Select a category above to explore jobs."
                    : loading
                      ? "Loading jobs..."
                      : `${jobs.length.toLocaleString(
                        "en-IN"
                      )} jobs loaded of ${totalJobs.toLocaleString(
                        "en-IN"
                      )} jobs`}
                </p>

              </div>

              {selectedCategory && (
                <div className="flex flex-wrap items-center gap-4">

                  {/* SORT */}

                  <div className="flex items-center gap-2">

                    <ArrowDownUp
                      size={17}
                      className="text-blue-600"
                    />

                    <label
                      htmlFor="job-sort"
                      className="text-sm font-medium text-gray-700"
                    >
                      Sort by
                    </label>

                    <select
                      id="job-sort"
                      value={
                        sortBy
                      }
                      onChange={(
                        event
                      ) =>
                        setSortBy(
                          event.target
                            .value
                        )
                      }
                      className="border border-gray-200 rounded-xl px-4 py-2.5 bg-white text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="recommended">
                        Recommended
                      </option>

                      <option value="newest">
                        Newest
                      </option>

                      <option value="salaryHigh">
                        Salary: High to Low
                      </option>

                      <option value="salaryLow">
                        Salary: Low to High
                      </option>

                      <option value="title">
                        Job Title: A–Z
                      </option>
                    </select>

                  </div>

                  {/* REFRESH */}

                  {!loading &&
                    recommendedJobs.length >
                    0 && (
                      <button
                        type="button"
                        onClick={
                          handleManualRefresh
                        }
                        disabled={
                          loading
                        }
                        className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 disabled:text-blue-300 font-semibold"
                      >
                        <RefreshCw
                          size={17}
                        />
                        Refresh
                      </button>
                    )}

                </div>
              )}

            </div>

            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-5 mb-6">

                <p className="font-semibold">
                  Unable to load jobs
                </p>

                <p className="text-sm mt-1">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    void fetchJobs(
                      1,
                      false
                    )
                  }
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"
                >
                  Try Again
                </button>

              </div>
            )}

            {/* ==================================================
                NO CATEGORY SELECTED
            ================================================== */}

            {!error &&
              !selectedCategory && (
                <div className="bg-white rounded-3xl shadow-lg p-8 sm:p-10">

                  <div className="text-center">

                    <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">

                      <BriefcaseBusiness
                        size={32}
                      />

                    </div>

                    <h2 className="text-2xl font-bold text-slate-800 mt-5">
                      Choose Your Career Category
                    </h2>

                    <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
                      Select a career field above to
                      discover relevant job opportunities.
                      CareerOS will load jobs only for the
                      category you choose.
                    </p>

                  </div>

                </div>
              )}

            {/* ==================================================
                JOB RESULTS AREA
            ================================================== */}

            {!error &&
              selectedCategory && (
                <>

                  {/* LOADING */}

                  {loading && (
                    <div className="grid md:grid-cols-2 gap-6">

                      {Array.from({
                        length: 6,
                      }).map(
                        (_, index) => (
                          <div
                            key={index}
                            className="bg-white rounded-3xl shadow-lg p-6 animate-pulse"
                          >

                            <div className="h-6 bg-gray-200 rounded-lg w-3/4" />

                            <div className="h-4 bg-gray-200 rounded w-1/2 mt-4" />

                            <div className="h-4 bg-gray-200 rounded w-2/5 mt-3" />

                            <div className="space-y-3 mt-6">

                              <div className="h-4 bg-gray-200 rounded" />

                              <div className="h-4 bg-gray-200 rounded w-5/6" />

                              <div className="h-4 bg-gray-200 rounded w-2/3" />

                            </div>

                            <div className="flex gap-3 mt-6">

                              <div className="h-7 bg-gray-200 rounded-full w-20" />

                              <div className="h-7 bg-gray-200 rounded-full w-24" />

                              <div className="h-7 bg-gray-200 rounded-full w-20" />

                            </div>

                            <div className="h-10 bg-gray-200 rounded-xl mt-6" />

                          </div>
                        )
                      )}

                    </div>
                  )}

                  {/* EMPTY RESULTS */}

                  {!loading &&
                    initialJobsLoaded &&
                    recommendedJobs.length ===
                    0 && (
                      <div className="bg-white rounded-3xl shadow-lg p-8 sm:p-10">

                        <div className="text-center">

                          <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">

                            <BriefcaseBusiness
                              size={32}
                            />

                          </div>

                          <h2 className="text-2xl font-bold text-slate-800 mt-5">
                            No Jobs Found
                          </h2>

                          <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
                            No jobs currently match the
                            selected category and filters.
                            Try changing your search or
                            filters.
                          </p>

                        </div>

                        <div className="flex flex-wrap justify-center gap-3 mt-8">

                          <button
                            type="button"
                            onClick={
                              resetFilters
                            }
                            className="border border-gray-200 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-xl font-semibold"
                          >
                            Back to Categories
                          </button>

                          <button
                            type="button"
                            onClick={
                              handleManualRefresh
                            }
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
                          >
                            Refresh Jobs
                          </button>

                        </div>

                      </div>
                    )}

                  {/* ACTUAL JOB CARDS */}

                  {!loading &&
                    recommendedJobs.length >
                    0 && (
                      <div className="grid md:grid-cols-2 gap-6">

                        {recommendedJobs.map(
                          (
                            job,
                            index
                          ) => {
                            const jobId =
                              getJobId(
                                job
                              );

                            return (
                              <JobCard
                                key={
                                  jobId ||
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
                            );
                          }
                        )}

                      </div>
                    )}

                </>
              )}

            {/* ==================================================
                LOAD MORE
            ================================================== */}

            {!loading &&
              !error &&
              selectedCategory &&
              hasMore && (
                <div className="flex flex-col items-center mt-10">

                  <button
                    type="button"
                    onClick={
                      loadMoreJobs
                    }
                    disabled={
                      loadingMore
                    }
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-8 py-3 rounded-xl font-semibold transition flex items-center gap-2"
                  >

                    {loadingMore ? (
                      <>
                        <RefreshCw
                          size={18}
                          className="animate-spin"
                        />
                        Loading more jobs...
                      </>
                    ) : (
                      "Load More Jobs"
                    )}

                  </button>

                  <p className="text-sm text-gray-500 mt-3">

                    <span className="font-semibold">
                      {jobs.length.toLocaleString(
                        "en-IN"
                      )}
                    </span>

                    {" "}jobs loaded of{" "}

                    <span className="font-semibold">
                      {totalJobs.toLocaleString(
                        "en-IN"
                      )}
                    </span>

                    {" "}jobs

                  </p>

                </div>
              )}

            {/* ==================================================
                ALL JOBS LOADED
            ================================================== */}

            {!loading &&
              !error &&
              selectedCategory &&
              jobs.length > 0 &&
              !hasMore && (
                <div className="text-center mt-10">

                  <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 px-5 py-3 rounded-xl font-semibold">
                    ✓ All available jobs loaded
                  </div>

                </div>
              )}

          </>
        )}

      </div>
    </div>
  );
}

export default Jobs;
  
