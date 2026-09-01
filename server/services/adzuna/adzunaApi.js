const axios = require("axios");
const dns = require("dns");
const https = require("https");

// ======================================================
// NETWORK CONFIGURATION
// ======================================================

dns.setDefaultResultOrder("ipv4first");

const adzunaHttpsAgent = new https.Agent({
    family: 4,
    keepAlive: true,
});

// ======================================================
// CONSTANTS
// ======================================================

const ADZUNA_RESULTS_PER_PAGE = 50;
const MAX_REQUESTED_PAGE = 100;
const ADZUNA_TIMEOUT = 30000;

const ADZUNA_MAX_RETRIES = 2;

const ADZUNA_RETRY_DELAY = 2500;
const ADZUNA_MAX_RETRY_DELAY = 10000;

// ======================================================
// ADZUNA RESULT CACHE
// ======================================================

const ADZUNA_RESULT_CACHE_TTL =
    10 * 60 * 1000;

const adzunaResultCache = new Map();

const adzunaInFlightRequests = new Map();

// ======================================================
// QUERY NORMALIZER
// ======================================================

const MEDICAL_QUERY_MAP = {
    mbbs:
        "MBBS doctor medical doctor physician medical officer duty doctor resident doctor hospital doctor clinical doctor",

    "mbbs doctor":
        "MBBS doctor medical doctor physician medical officer duty doctor resident doctor hospital doctor clinical doctor",

    doctor:
        "doctor medical doctor physician medical officer duty doctor resident doctor hospital doctor clinical doctor",

    doctors:
        "doctor doctors medical doctor physician medical officer duty doctor resident doctor hospital doctor clinical doctor",

    physician:
        "physician medical doctor doctor clinical physician hospital physician",

    physicians:
        "physician physicians medical doctor doctor clinical physician hospital physician",

    "medical doctor":
        "medical doctor doctor physician MBBS medical officer duty medical officer resident doctor",

    "medical officer":
        "medical officer medical doctor MBBS doctor duty medical officer physician hospital doctor",

    "medical officers":
        "medical officer medical officers medical doctor MBBS doctor duty medical officer physician hospital doctor",

    "duty doctor":
        "duty doctor medical officer medical doctor MBBS doctor physician hospital doctor",

    "duty medical officer":
        "duty medical officer medical officer MBBS doctor physician hospital doctor",

    "resident doctor":
        "resident doctor resident physician medical doctor MBBS doctor hospital doctor",

    "resident physician":
        "resident physician resident doctor medical doctor MBBS doctor hospital",

    residency:
        "medical residency resident doctor resident physician MBBS doctor hospital",

    medical:
        "medical healthcare hospital doctor physician medical officer clinical healthcare",

    medicine:
        "medicine medical doctor physician MBBS medical officer hospital clinical",

    healthcare:
        "healthcare medical hospital doctor physician nursing clinical healthcare",

    "health care":
        "healthcare medical hospital doctor physician nursing clinical healthcare",

    hospital:
        "hospital healthcare medical doctor physician nurse nursing medical officer clinical",

    hospitals:
        "hospital hospitals healthcare medical doctor physician nurse nursing medical officer clinical",

    clinical:
        "clinical healthcare medical hospital doctor physician clinical officer clinical research",

    "clinical staff":
        "clinical staff healthcare hospital doctor nurse medical officer clinical",

    surgeon:
        "surgeon surgery surgical doctor medical doctor hospital physician",

    surgeons:
        "surgeon surgeons surgery surgical doctor medical doctor hospital physician",

    surgery:
        "surgery surgeon surgical doctor hospital physician medical doctor",

    cardiology:
        "cardiology cardiologist cardiac doctor heart specialist physician medical doctor",

    cardiologist:
        "cardiologist cardiology cardiac doctor heart specialist physician",

    neurology:
        "neurology neurologist neurological doctor physician medical specialist",

    neurologist:
        "neurologist neurology neurological doctor physician medical specialist",

    oncology:
        "oncology oncologist cancer specialist medical doctor physician",

    oncologist:
        "oncologist oncology cancer specialist medical doctor physician",

    pediatrics:
        "pediatrics pediatrician child doctor medical doctor physician hospital",

    pediatrician:
        "pediatrician pediatrics child doctor medical doctor physician hospital",

    dermatologist:
        "dermatologist dermatology skin doctor medical doctor physician",

    dermatology:
        "dermatology dermatologist skin doctor medical doctor physician",

    psychiatrist:
        "psychiatrist psychiatry mental health doctor physician medical doctor",

    psychiatry:
        "psychiatry psychiatrist mental health doctor physician medical doctor",

    gynecologist:
        "gynecologist gynecology obstetrics women's health doctor physician medical doctor",

    gynecology:
        "gynecology gynecologist obstetrics women's health doctor physician medical doctor",

    obstetrics:
        "obstetrics gynecology gynecologist obstetrician medical doctor physician",

    radiologist:
        "radiologist radiology imaging doctor medical specialist physician",

    radiology:
        "radiology radiologist medical imaging imaging technician radiographer hospital",

    anesthetist:
        "anesthetist anesthesiologist anesthesia doctor medical specialist hospital",

    anesthesiologist:
        "anesthesiologist anesthetist anesthesia doctor medical specialist hospital",

    bds:
        "BDS dentist dental surgeon dental doctor dental physician dental clinic hospital",

    dentist:
        "dentist dental doctor dental surgeon BDS dental clinic hospital",

    dentists:
        "dentist dentists dental doctor dental surgeon BDS dental clinic hospital",

    dental:
        "dental dentist BDS dental surgeon dental doctor dental clinic",

    "dental surgeon":
        "dental surgeon dentist BDS dental doctor dental clinic hospital",

    orthodontist:
        "orthodontist orthodontics dentist BDS dental specialist",

    bams:
        "BAMS ayurvedic doctor ayurveda physician medical doctor ayurvedic hospital",

    ayurveda:
        "ayurveda ayurvedic doctor BAMS physician medical doctor ayurvedic hospital",

    "ayurvedic doctor":
        "ayurvedic doctor ayurveda BAMS physician medical doctor",

    bhms:
        "BHMS homeopathic doctor homeopathy physician medical doctor homeopathic clinic",

    homeopathy:
        "homeopathy homeopathic doctor BHMS physician medical doctor",

    "homeopathic doctor":
        "homeopathic doctor homeopathy BHMS physician medical doctor",

    nursing:
        "nursing nurse staff nurse registered nurse clinical nurse hospital nurse healthcare",

    nurse:
        "nurse nursing staff nurse registered nurse clinical nurse hospital healthcare",

    nurses:
        "nurse nurses nursing staff nurse registered nurse clinical nurse hospital healthcare",

    "staff nurse":
        "staff nurse nurse nursing registered nurse clinical nurse hospital",

    "registered nurse":
        "registered nurse nurse nursing staff nurse clinical nurse hospital healthcare",

    "nursing officer":
        "nursing officer nurse staff nurse registered nurse hospital healthcare",

    "nurse practitioner":
        "nurse practitioner nurse nursing registered nurse healthcare clinical",

    pharmacy:
        "pharmacy pharmacist clinical pharmacist hospital pharmacist pharmaceutical healthcare",

    pharmacist:
        "pharmacist pharmacy clinical pharmacist hospital pharmacist pharmaceutical",

    pharmacists:
        "pharmacist pharmacists pharmacy clinical pharmacist hospital pharmacist pharmaceutical",

    "clinical pharmacist":
        "clinical pharmacist pharmacist pharmacy hospital pharmacist healthcare",

    "hospital pharmacist":
        "hospital pharmacist pharmacist pharmacy clinical pharmacist healthcare",

    bpt:
        "BPT physiotherapist physiotherapy physical therapist rehabilitation therapist hospital clinic",

    physiotherapy:
        "physiotherapy physiotherapist physical therapist rehabilitation therapist hospital clinic",

    physiotherapist:
        "physiotherapist physiotherapy physical therapist rehabilitation therapist hospital clinic",

    physiotherapists:
        "physiotherapist physiotherapists physiotherapy physical therapist rehabilitation",

    "physical therapist":
        "physical therapist physiotherapist physiotherapy rehabilitation therapist hospital",

    rehabilitation:
        "rehabilitation physiotherapist physical therapist occupational therapist healthcare hospital",

    "medical lab":
        "medical laboratory medical lab laboratory technician lab technician pathology technician healthcare hospital",

    "medical laboratory":
        "medical laboratory laboratory technician lab technician pathology technician hospital healthcare",

    "lab technician":
        "lab technician laboratory technician medical laboratory pathology technician hospital",

    "laboratory technician":
        "laboratory technician lab technician medical laboratory pathology technician hospital healthcare",

    pathology:
        "pathology pathologist pathology technician laboratory technician medical laboratory hospital",

    pathologist:
        "pathologist pathology pathology technician laboratory medical doctor hospital",

    "medical technician":
        "medical technician healthcare hospital laboratory technician medical technician clinical",

    "medical technologist":
        "medical technologist medical technician laboratory technician healthcare hospital",

    "radiology technician":
        "radiology technician radiographer radiology imaging technician hospital",

    radiographer:
        "radiographer radiology technician imaging technician medical imaging hospital",

    "x ray technician":
        "x ray technician radiology technician radiographer medical imaging hospital",

    "x-ray technician":
        "x ray technician radiology technician radiographer medical imaging hospital",

    optometry:
        "optometry optometrist eye care vision specialist healthcare hospital clinic",

    optometrist:
        "optometrist optometry eye care vision specialist healthcare clinic",

    "occupational therapist":
        "occupational therapist occupational therapy rehabilitation healthcare hospital clinic",

    "occupational therapy":
        "occupational therapy occupational therapist rehabilitation healthcare hospital",

    "medical coding":
        "medical coding medical coder healthcare hospital medical billing",

    "medical coder":
        "medical coder medical coding healthcare hospital medical billing",

    "medical billing":
        "medical billing medical coder healthcare hospital insurance medical",

    "medical billing executive":
        "medical billing medical billing executive medical coder healthcare hospital",

    "clinical research":
        "clinical research clinical research associate clinical trial research healthcare pharmaceutical medical",

    "clinical research associate":
        "clinical research associate clinical research clinical trial pharmaceutical healthcare medical",

    "clinical trial":
        "clinical trial clinical research clinical research associate pharmaceutical healthcare medical",

    "research associate":
        "research associate clinical research clinical trial healthcare pharmaceutical medical",

    pharmaceutical:
        "pharmaceutical pharma healthcare medical pharmacist clinical research",

    pharmaceuticals:
        "pharmaceutical pharmaceuticals pharma healthcare medical pharmacist clinical research",

    pharma:
        "pharma pharmaceutical healthcare medical pharmacist clinical research",

    "pharma jobs":
        "pharma pharmaceutical healthcare medical pharmacist clinical research",

    "medical representative":
        "medical representative pharma pharmaceutical healthcare medical sales",

    "medical sales":
        "medical sales medical representative pharmaceutical pharma healthcare",

    "public health":
        "public health healthcare medical health officer community health epidemiology",

    epidemiology:
        "epidemiology epidemiologist public health healthcare medical research",

    epidemiologist:
        "epidemiologist epidemiology public health healthcare medical research",

    "hospital administrator":
        "hospital administrator healthcare administration hospital management medical",

    "healthcare administrator":
        "healthcare administrator hospital administration healthcare management medical",

    "healthcare management":
        "healthcare management hospital administration healthcare administrator medical",

    "hospital management":
        "hospital management healthcare management hospital administrator healthcare",
};

const MEDICAL_KEYWORDS = Object.keys(
    MEDICAL_QUERY_MAP
);

const QUERY_MAP = {
    "react developer":
        "react developer frontend developer",

    "frontend developer":
        "frontend developer react javascript",

    "front end developer":
        "frontend developer react javascript",

    "backend developer":
        "backend developer node java spring boot",

    "full stack developer":
        "full stack developer react node java",

    "java developer":
        "java developer spring boot",

    "python developer":
        "python developer django flask",

    "data analyst":
        "data analyst sql python excel power bi",

    "data scientist":
        "data scientist python machine learning",

    "machine learning":
        "machine learning python",

    "ai engineer":
        "AI engineer artificial intelligence machine learning",

    "software engineer":
        "software engineer software developer",

    "software developer":
        "software developer software engineer",

    "web developer":
        "web developer frontend backend",

    "devops engineer":
        "devops engineer cloud aws azure",

    "cloud engineer":
        "cloud engineer aws azure",

    "cyber security":
        "cyber security cybersecurity information security",

    cybersecurity:
        "cybersecurity cyber security information security",

    "ui ux designer":
        "UI UX designer user experience designer",

    "mobile developer":
        "mobile developer android ios",

    "android developer":
        "android developer kotlin java",

    "ios developer":
        "ios developer swift",

    teacher:
        "teacher teaching educator school",

    teachers:
        "teacher teaching educator school",

    lecturer:
        "lecturer teaching professor education",

    professor:
        "professor lecturer teaching education university",

    teaching:
        "teaching teacher lecturer education school",

    accountant:
        "accountant accounting finance",

    accounting:
        "accounting accountant finance",

    finance:
        "finance financial analyst accounting",

    banking:
        "banking bank finance",

    sales:
        "sales sales executive business development",

    marketing:
        "marketing digital marketing sales",

    "customer service":
        "customer service customer support",

    hr:
        "human resources HR recruiter",

    "human resources":
        "human resources HR recruiter",

    recruiter:
        "recruiter recruitment human resources",

    logistics:
        "logistics supply chain warehouse",

    warehouse:
        "warehouse logistics inventory",

    construction:
        "construction civil engineer site engineer",

    "civil engineer":
        "civil engineer construction structural engineer",
};

function normalizeQuery(query = "") {
    const value = String(query)
        .trim()
        .toLowerCase();

    if (!value) {
        return "all jobs";
    }

    if (MEDICAL_QUERY_MAP[value]) {
        return MEDICAL_QUERY_MAP[value];
    }

    if (
        MEDICAL_KEYWORDS.some(
            (keyword) =>
                value === keyword ||
                value.includes(keyword)
        )
    ) {
        for (const [
            keyword,
            expansion,
        ] of Object.entries(
            MEDICAL_QUERY_MAP
        )) {
            if (
                value.includes(keyword)
            ) {
                return `${String(
                    query
                ).trim()} ${expansion}`;
            }
        }

        return `${String(
            query
        ).trim()} medical healthcare hospital clinical doctor physician`;
    }

    return (
        QUERY_MAP[value] ||
        String(query).trim()
    );
}

// ======================================================
// CACHE
// ======================================================

function getAdzunaCacheKey({
    query,
    location,
    page,
    category,
}) {
    return JSON.stringify({
        query: normalizeQuery(query),

        location: String(
            location || "India"
        )
            .trim()
            .toLowerCase(),

        page: Number(page) || 1,

        category: String(
            category || ""
        )
            .trim()
            .toLowerCase(),
    });
}

function getCachedAdzunaResult(
    cacheKey
) {
    const cached =
        adzunaResultCache.get(
            cacheKey
        );

    if (!cached) {
        return null;
    }

    if (
        Date.now() >=
        cached.expiresAt
    ) {
        adzunaResultCache.delete(
            cacheKey
        );

        return null;
    }

    return cached.data;
}

function setCachedAdzunaResult(
    cacheKey,
    data
) {
    const now = Date.now();

    adzunaResultCache.set(
        cacheKey,
        {
            data,
            cachedAt: now,
            expiresAt:
                now +
                ADZUNA_RESULT_CACHE_TTL,
        }
    );
}

// ======================================================
// RETRY HELPERS
// ======================================================

function shouldRetryAdzunaError(
    error
) {
    if (!error) {
        return false;
    }

    const status =
        error.response?.status;

    const code =
        error.code;

    if (
        status === 429 ||
        status === 502 ||
        status === 503 ||
        status === 504
    ) {
        return true;
    }

    const retryableCodes = [
        "ETIMEDOUT",
        "ECONNABORTED",
        "ECONNRESET",
        "EAI_AGAIN",
        "ENETUNREACH",
        "EHOSTUNREACH",
    ];

    return retryableCodes.includes(
        code
    );
}

function getRetryAfterDelay(
    error
) {
    const retryAfter =
        error?.response?.headers?.[
            "retry-after"
        ];

    if (
        retryAfter === undefined ||
        retryAfter === null
    ) {
        return 0;
    }

    const numericValue =
        Number(retryAfter);

    if (
        Number.isFinite(
            numericValue
        ) &&
        numericValue >= 0
    ) {
        return Math.min(
            numericValue * 1000,
            ADZUNA_MAX_RETRY_DELAY
        );
    }

    const retryDate =
        Date.parse(
            String(retryAfter)
        );

    if (
        Number.isFinite(
            retryDate
        )
    ) {
        return Math.max(
            0,
            Math.min(
                retryDate - Date.now(),
                ADZUNA_MAX_RETRY_DELAY
            )
        );
    }

    return 0;
}

function getAdzunaRetryDelay(
    attempt,
    error
) {
    const retryAfterDelay =
        getRetryAfterDelay(error);

    if (retryAfterDelay > 0) {
        const jitter =
            Math.floor(
                Math.random() * 500
            );

        return Math.min(
            retryAfterDelay + jitter,
            ADZUNA_MAX_RETRY_DELAY
        );
    }

    const exponentialDelay =
        Math.min(
            ADZUNA_RETRY_DELAY *
                Math.pow(
                    2,
                    attempt - 1
                ),
            ADZUNA_MAX_RETRY_DELAY
        );

    const jitter =
        Math.floor(
            Math.random() * 500
        );

    return Math.min(
        exponentialDelay + jitter,
        ADZUNA_MAX_RETRY_DELAY
    );
}

function wait(ms) {
    return new Promise(
        (resolve) =>
            setTimeout(
                resolve,
                ms
            )
    );
}

// ======================================================
// FETCH ONE ADZUNA PAGE
// ======================================================

async function fetchAdzunaPage({
    appId,
    appKey,
    query,
    location,
    page,
    category,
}) {
    const pageNumber =
        Math.min(
            Math.max(
                Number(page) || 1,
                1
            ),
            MAX_REQUESTED_PAGE
        );

    const cacheKey =
        getAdzunaCacheKey({
            query,
            location,
            page: pageNumber,
            category,
        });

    const cachedResult =
        getCachedAdzunaResult(
            cacheKey
        );

    if (cachedResult) {
        

        return cachedResult;
    }

    const existingRequest =
        adzunaInFlightRequests.get(
            cacheKey
        );

    if (existingRequest) {
        

        return existingRequest;
    }

    const url =
        `https://api.adzuna.com/v1/api/jobs/in/search/${pageNumber}`;

    const requestPromise =
        (async () => {
            let lastError = null;

            for (
                let attempt = 1;
                attempt <=
                ADZUNA_MAX_RETRIES;
                attempt++
            ) {
                try {
                    const normalizedQuery =
                        normalizeQuery(
                            query
                        );

                    

                    if (
                        attempt > 1
                    ) {
                        console.log(
                            `🔁 Adzuna retry attempt ${attempt}/${ADZUNA_MAX_RETRIES}`
                        );
                    }

                    const params = {
                        app_id: appId,
                        app_key: appKey,
                        results_per_page:
                            ADZUNA_RESULTS_PER_PAGE,
                        what:
                            normalizedQuery,
                        where:
                            location ||
                            "India",
                    };

                    if (category) {
                        params.category =
                            category;
                    }

                    const response =
                        await axios.get(
                            url,
                            {
                                timeout:
                                    ADZUNA_TIMEOUT,

                                httpsAgent:
                                    adzunaHttpsAgent,

                                headers: {
                                    Accept:
                                        "application/json",

                                    "User-Agent":
                                        "CareerOS/1.0",
                                },

                                params,
                            }
                        );


                    setCachedAdzunaResult(
                        cacheKey,
                        response.data
                    );

                    

                    return response.data;
                } catch (
                    error
                ) {
                    lastError = error;

                    const status =
                        error.response
                            ?.status;

                    const retryable =
                        shouldRetryAdzunaError(
                            error
                        );

                    console.error(
                        "❌ Adzuna request failed:",
                        {
                            attempt,
                            maxRetries:
                                ADZUNA_MAX_RETRIES,
                            code:
                                error.code,
                            message:
                                error.message,
                            status,
                            statusText:
                                error
                                    .response
                                    ?.statusText,
                            category,
                            query,
                            url,
                        }
                    );

                    if (!retryable) {
                        throw error;
                    }

                    if (
                        attempt ===
                        ADZUNA_MAX_RETRIES
                    ) {
                        break;
                    }

                    const delay =
                        getAdzunaRetryDelay(
                            attempt,
                            error
                        );

                    

                    await wait(
                        delay
                    );
                }
            }

            console.error(
                `❌ Adzuna failed after ${ADZUNA_MAX_RETRIES} attempts.`
            );

            throw lastError;
        })();

    adzunaInFlightRequests.set(
        cacheKey,
        requestPromise
    );

    try {
        return await requestPromise;
    } finally {
        if (
            adzunaInFlightRequests.get(
                cacheKey
            ) === requestPromise
        ) {
            adzunaInFlightRequests.delete(
                cacheKey
            );
        }
    }
}

module.exports = {
    fetchAdzunaPage,
    normalizeQuery,
};