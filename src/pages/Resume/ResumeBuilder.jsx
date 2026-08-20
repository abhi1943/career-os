import { useEffect, useRef, useState, useMemo } from "react";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";

import {
    getResumeVersions,
    saveResumeVersion,
    deleteResumeVersion,
} from "../../services/resumeVersionManager";

import ResumeForm from "../../components/resume/ResumeForm";
import ResumePreview from "../../components/resume/ResumePreview";
import ResumeAnalyzer from "../../components/resume/ResumeAnalyzer";
import ResumeScoreCard from "../../components/resume/ResumeScoreCard";
import ResumeSuggestions from "../../components/resume/ResumeSuggestions";
import ResumeDashboard from "../../components/resume/ResumeDashboard";
import ResumeOptimizer from "../../components/resume/ResumeOptimizer";

import JobDescriptionAnalyzer from "../../components/resume/JobDescriptionAnalyzer";
import JobDescriptionMatcher from "../../components/resume/JobDescriptionMatcher";

import InterviewGenerator from "../../components/resume/InterviewGenerator";
import MockInterview from "../../components/resume/MockInterview";
import PortfolioBuilder from "../Portfolio/PortfolioBuilder";
import CareerCoach from "../../components/resume/CareerCoach";

import { generateCoverLetter } from "../../services/coverLetterGenerator";
import { generateInterviewQuestions } from "../../services/interviewGenerator";
import { optimizeProject } from "../../services/resumeOptimizer";
import { saveResume, loadResume } from "../../services/firestoreService";

import { generateResume } from "../../utils/resumeGenerator";
import { analyzeResume } from "../../utils/resumeAnalyzer";
import { checkATSKeywords } from "../../utils/atsKeywordChecker";
import { calculateResumeCompletion } from "../../utils/resumeCompletion";
import { analyzeJobDescription } from "../../utils/jobDescriptionAnalyzer";
import { optimizeResume } from "../../services/resumeOptimizer";

import { useAuth } from "../../context/AuthContext";

// ======================================================
// INITIAL RESUME DATA
// ======================================================

const getInitialResumeData = () => {
    const saved = localStorage.getItem("careeros_resume");

    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (error) {
            console.error(
                "CareerOS: Failed to parse saved resume:",
                error
            );
        }
    }

    return {
        // Personal
        name: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        portfolio: "",

        // Target
        targetRole: "",

        // Summary
        summary: "",

        // Education
        college: "",
        degree: "",
        branch: "",
        cgpa: "",
        graduationYear: "",

        // Skills
        programming: "",
        frameworks: "",
        databases: "",
        tools: "",
        cloud: "",
        softSkills: "",

        // Experience
        experience: [],
        internships: [],

        // Projects
        projects: [],

        projectTitle: "",
        projectTech: "",
        projectGithub: "",
        projectLive: "",
        projectDescription: "",

        // Other
        certifications: [],
        achievements: [],
        languages: "",
        interests: "",
    };
};

// ======================================================
// RESUME BUILDER
// ======================================================

function ResumeBuilder() {
    const resumeRef = useRef(null);

    const { user } = useAuth();

    const [template, setTemplate] = useState("modern");

    const [downloading, setDownloading] = useState(false);

    const [history, setHistory] = useState([]);

    // FIX:
    // Initialize saved versions directly instead of
    // calling setSavedVersions() inside useEffect.
    const [savedVersions, setSavedVersions] = useState(
        () => getResumeVersions()
    );

    const [companyName, setCompanyName] = useState("");

    const [coverLetter, setCoverLetter] = useState("");

    const [jobDescription, setJobDescription] = useState("");

    const [resumeData, setResumeData] = useState(
        getInitialResumeData
    );

    const [optimizedResume, setOptimizedResume] = useState(null);

    const [optimizing, setOptimizing] = useState(false);

    const [interviewQuestions, setInterviewQuestions] =
        useState(null);

    // ======================================================
    // AUTO SAVE
    // ======================================================

    useEffect(() => {
        localStorage.setItem(
            "careeros_resume",
            JSON.stringify(resumeData)
        );

        if (!user) {
            return;
        }

        saveResume(
            user.uid,
            resumeData
        );
    }, [resumeData, user]);

    // ======================================================
    // LOAD FIRESTORE RESUME
    // ======================================================

    useEffect(() => {
        if (!user) {
            return;
        }

        async function fetchResume() {
            try {
                const data = await loadResume(
                    user.uid
                );

                if (data) {
                    setResumeData(data);
                }
            } catch (error) {
                console.error(
                    "CareerOS: Failed to load resume:",
                    error
                );
            }
        }

        fetchResume();
    }, [user]);

    // ======================================================
    // OPTIMIZED PROJECTS
    // ======================================================

    const optimizedProjects = useMemo(
        () =>
            (resumeData.projects || []).map(
                (project) =>
                    optimizeProject(
                        project,
                        resumeData.targetRole
                    )
            ),
        [
            resumeData.projects,
            resumeData.targetRole,
        ]
    );

    // ======================================================
    // RESUME PREVIEW DATA
    // ======================================================

    const previewData = useMemo(
        () =>
            generateResume({
                ...resumeData,
                projects: optimizedProjects,
            }),
        [
            resumeData,
            optimizedProjects,
        ]
    );

    // ======================================================
    // RESUME ANALYSIS
    // ======================================================

    const analysis = useMemo(
        () => analyzeResume(previewData),
        [previewData]
    );

    // ======================================================
    // ATS KEYWORDS
    // ======================================================

    const atsKeywords = useMemo(
        () =>
            checkATSKeywords(
                previewData
            ),
        [previewData]
    );

    // ======================================================
    // RESUME COMPLETION
    // ======================================================

    const completion = useMemo(
        () =>
            calculateResumeCompletion(
                previewData
            ),
        [previewData]
    );

    // ======================================================
    // JOB DESCRIPTION ANALYSIS
    // ======================================================

    const jdAnalysis = useMemo(
        () =>
            analyzeJobDescription(
                jobDescription,
                resumeData
            ),
        [
            jobDescription,
            resumeData,
        ]
    );

    // ======================================================
    // DOWNLOAD PDF
    // ======================================================

    const downloadPDF = async () => {
        try {
            setDownloading(true);

            if (!resumeRef.current) {
                throw new Error(
                    "Resume preview is not available."
                );
            }

            const image = await toPng(
                resumeRef.current,
                {
                    cacheBust: true,
                    pixelRatio: 3,
                    backgroundColor: "#ffffff",
                }
            );

            const pdf = new jsPDF(
                "p",
                "mm",
                "a4"
            );

            const pdfWidth =
                pdf.internal.pageSize.getWidth();

            const img = new Image();

            img.src = image;

            await new Promise(
                (resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                }
            );

            const pdfHeight =
                (img.height * pdfWidth) /
                img.width;

            pdf.addImage(
                image,
                "PNG",
                0,
                0,
                pdfWidth,
                pdfHeight
            );

            pdf.save(
                `${
                    resumeData.name ||
                    "Resume"
                }.pdf`
            );
        } catch (error) {
            console.error(
                "CareerOS: Resume PDF generation failed:",
                error
            );
        } finally {
            setDownloading(false);
        }
    };

    // ======================================================
    // OPTIMIZE RESUME
    // ======================================================

    const handleOptimize = () => {
        setOptimizing(true);

        setTimeout(() => {
            try {
                const optimized =
                    optimizeResume(
                        resumeData
                    );

                setResumeData(
                    optimized
                );

                setOptimizedResume(
                    JSON.stringify(
                        optimized,
                        null,
                        2
                    )
                );
            } catch (error) {
                console.error(
                    "CareerOS: Resume optimization failed:",
                    error
                );
            } finally {
                setOptimizing(false);
            }
        }, 700);
    };

    // ======================================================
    // RENDER
    // ======================================================

    return (
        <section className="min-h-screen bg-slate-100 py-10">
            <div className="max-w-7xl mx-auto px-6">

                {/* ======================================================
                    TITLE
                ====================================================== */}

                <h1 className="text-5xl font-bold text-center mb-8">
                    Resume Builder
                </h1>

                {/* ======================================================
                    TOP BUTTONS
                ====================================================== */}

                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">

                    {/* TEMPLATE BUTTONS */}

                    <div className="flex gap-3">

                        <button
                            onClick={() =>
                                setTemplate(
                                    "modern"
                                )
                            }
                            className={`px-5 py-2 rounded-xl ${
                                template ===
                                "modern"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200"
                            }`}
                        >
                            Modern
                        </button>

                        <button
                            onClick={() =>
                                setTemplate(
                                    "classic"
                                )
                            }
                            className={`px-5 py-2 rounded-xl ${
                                template ===
                                "classic"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200"
                            }`}
                        >
                            Classic
                        </button>

                        <button
                            onClick={() =>
                                setTemplate(
                                    "minimal"
                                )
                            }
                            className={`px-5 py-2 rounded-xl ${
                                template ===
                                "minimal"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200"
                            }`}
                        >
                            Minimal
                        </button>

                    </div>

                    {/* ACTION BUTTONS */}

                    <div className="flex gap-3">

                        {/* UNDO */}

                        <button
                            onClick={() => {
                                if (
                                    history.length ===
                                    0
                                ) {
                                    return;
                                }

                                setHistory(
                                    (prev) => {
                                        if (
                                            prev.length ===
                                            0
                                        ) {
                                            return prev;
                                        }

                                        const copy =
                                            [
                                                ...prev,
                                            ];

                                        const previous =
                                            copy.pop();

                                        setResumeData(
                                            previous
                                        );

                                        return copy;
                                    }
                                );
                            }}
                            className="bg-yellow-500 text-white px-5 py-2 rounded-xl"
                        >
                            ↩ Undo
                        </button>

                        {/* RESET */}

                        <button
                            onClick={() => {
                                localStorage.removeItem(
                                    "careeros_resume"
                                );

                                setResumeData(
                                    getInitialResumeData()
                                );

                                setHistory([]);
                            }}
                            className="bg-red-600 text-white px-5 py-2 rounded-xl"
                        >
                            Reset
                        </button>

                        {/* SAVE VERSION */}

                        <button
                            onClick={() => {
                                saveResumeVersion(
                                    resumeData.name ||
                                        "My Resume",
                                    resumeData
                                );

                                setSavedVersions(
                                    getResumeVersions()
                                );
                            }}
                            className="bg-indigo-600 text-white px-5 py-2 rounded-xl"
                        >
                            💾 Save Version
                        </button>

                        {/* DOWNLOAD */}

                        <button
                            disabled={
                                downloading
                            }
                            onClick={
                                downloadPDF
                            }
                            className="bg-green-600 text-white px-6 py-2 rounded-xl"
                        >
                            {downloading
                                ? "Generating PDF..."
                                : "📄 Download ATS Resume"}
                        </button>

                    </div>

                </div>

                {/* ======================================================
                    MAIN GRID
                ====================================================== */}

                <div className="grid lg:grid-cols-2 gap-8">

                    {/* ======================================================
                        LEFT - RESUME FORM
                    ====================================================== */}

                    <ResumeForm
                        resumeData={
                            resumeData
                        }
                        setResumeData={
                            (data) => {
                                if (
                                    JSON.stringify(
                                        data
                                    ) !==
                                    JSON.stringify(
                                        resumeData
                                    )
                                ) {
                                    setHistory(
                                        (prev) => [
                                            ...prev.slice(
                                                -19
                                            ),
                                            structuredClone(
                                                resumeData
                                            ),
                                        ]
                                    );
                                }

                                setResumeData(
                                    data
                                );
                            }
                        }
                    />

                    {/* ======================================================
                        RIGHT SIDE
                    ====================================================== */}

                    <div className="space-y-6 sticky top-4">

                        {/* RESUME PREVIEW */}

                        <ResumePreview
                            resume={
                                previewData
                            }
                            resumeRef={
                                resumeRef
                            }
                            template={
                                template
                            }
                        />

                        {/* DASHBOARD */}

                        <ResumeDashboard
                            analysis={
                                analysis
                            }
                            completion={
                                completion
                            }
                            versions={
                                savedVersions
                            }
                            atsKeywords={
                                atsKeywords
                            }
                        />

                        {/* ANALYZER */}

                        <ResumeAnalyzer
                            analysis={
                                analysis
                            }
                            atsKeywords={
                                atsKeywords
                            }
                        />

                        {/* OPTIMIZER */}

                        <ResumeOptimizer
                            optimizedResume={
                                optimizedResume
                            }
                            loading={
                                optimizing
                            }
                            onOptimize={
                                handleOptimize
                            }
                        />

                        {/* SCORE */}

                        <ResumeScoreCard
                            analysis={
                                analysis
                            }
                        />

                        {/* SUGGESTIONS */}

                        <ResumeSuggestions
                            analysis={
                                analysis
                            }
                        />

                        {/* ======================================================
                            RESUME VERSIONS
                        ====================================================== */}

                        <div className="bg-white rounded-3xl shadow-lg p-8">

                            <h2 className="text-2xl font-bold mb-6">
                                Resume Versions
                            </h2>

                            {savedVersions.length ===
                            0 ? (
                                <p className="text-gray-500">
                                    No saved versions yet.
                                </p>
                            ) : (
                                <div className="space-y-4">

                                    {savedVersions.map(
                                        (
                                            version
                                        ) => (
                                            <div
                                                key={
                                                    version.id
                                                }
                                                className="border rounded-xl p-4 flex justify-between items-center"
                                            >

                                                <div>

                                                    <h3 className="font-semibold">
                                                        {version.name ||
                                                            "Untitled Resume"}
                                                    </h3>

                                                    <p className="text-sm text-gray-500">
                                                        {
                                                            version.updatedAt
                                                        }
                                                    </p>

                                                </div>

                                                <div className="flex gap-2">

                                                    {/* LOAD */}

                                                    <button
                                                        className="bg-blue-600 text-white px-3 py-1 rounded-lg"
                                                        onClick={() => {
                                                            setResumeData(
                                                                version.resume
                                                            );
                                                        }}
                                                    >
                                                        Load
                                                    </button>

                                                    {/* DELETE */}

                                                    <button
                                                        className="bg-red-600 text-white px-3 py-1 rounded-lg"
                                                        onClick={() => {
                                                            deleteResumeVersion(
                                                                version.name
                                                            );

                                                            setSavedVersions(
                                                                getResumeVersions()
                                                            );
                                                        }}
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </div>
                                        )
                                    )}

                                </div>
                            )}

                        </div>

                        {/* ======================================================
                            RESUME COMPLETION
                        ====================================================== */}

                        <div className="bg-white rounded-3xl shadow-lg p-8">

                            <h2 className="text-2xl font-bold">
                                Resume Completion
                            </h2>

                            <div className="bg-gray-200 h-4 rounded-full mt-4">

                                <div
                                    className="bg-green-600 h-4 rounded-full"
                                    style={{
                                        width: `${completion.percentage}%`,
                                    }}
                                />

                            </div>

                            <p className="mt-3 font-bold">
                                {
                                    completion.percentage
                                }%
                                {" "}
                                Complete
                            </p>

                            <div className="mt-6 space-y-2">

                                {(
                                    completion.sections ||
                                    []
                                ).map(
                                    (
                                        section
                                    ) => (
                                        <div
                                            key={
                                                section.name
                                            }
                                            className="flex justify-between"
                                        >
                                            <span>
                                                {
                                                    section.name
                                                }
                                            </span>

                                            <span>
                                                {section.completed
                                                    ? "✅"
                                                    : "❌"}
                                            </span>
                                        </div>
                                    )
                                )}

                            </div>

                        </div>

                        {/* ======================================================
                            ATS KEYWORDS
                        ====================================================== */}

                        <div className="bg-white rounded-3xl shadow-lg p-8">

                            <h2 className="text-2xl font-bold">
                                ATS Keywords
                            </h2>

                            {/* MATCHED */}

                            <div className="mt-5">

                                <h3 className="font-semibold text-green-700">
                                    Matched
                                </h3>

                                <div className="flex flex-wrap gap-2 mt-2">

                                    {(
                                        atsKeywords.found ||
                                        []
                                    ).map(
                                        (
                                            skill
                                        ) => (
                                            <span
                                                key={
                                                    skill
                                                }
                                                className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                                            >
                                                {
                                                    skill
                                                }
                                            </span>
                                        )
                                    )}

                                </div>

                            </div>

                            {/* MISSING */}

                            <div className="mt-6">

                                <h3 className="font-semibold text-red-700">
                                    Missing
                                </h3>

                                <div className="flex flex-wrap gap-2 mt-2">

                                    {(
                                        atsKeywords.missing ||
                                        []
                                    ).map(
                                        (
                                            skill
                                        ) => (
                                            <span
                                                key={
                                                    skill
                                                }
                                                className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm"
                                            >
                                                {
                                                    skill
                                                }
                                            </span>
                                        )
                                    )}

                                </div>

                            </div>

                        </div>

                        {/* ======================================================
                            JOB DESCRIPTION ANALYZER
                        ====================================================== */}

                        <JobDescriptionAnalyzer
                            jobDescription={
                                jobDescription
                            }
                            setJobDescription={
                                setJobDescription
                            }
                            jdAnalysis={
                                jdAnalysis
                            }
                        />

                        {/* ======================================================
                            AI COVER LETTER
                        ====================================================== */}

                        <div className="bg-white rounded-3xl shadow-lg p-8">

                            <h2 className="text-2xl font-bold mb-5">
                                AI Cover Letter
                            </h2>

                            <input
                                type="text"
                                placeholder="Company Name"
                                value={
                                    companyName
                                }
                                onChange={(
                                    e
                                ) =>
                                    setCompanyName(
                                        e.target
                                            .value
                                    )
                                }
                                className="w-full border rounded-lg p-3 mb-4"
                            />

                            <button
                                className="bg-purple-600 text-white px-5 py-2 rounded-xl"
                                onClick={() =>
                                    setCoverLetter(
                                        generateCoverLetter(
                                            previewData,
                                            companyName,
                                            previewData.targetRole
                                        )
                                    )
                                }
                            >
                                ✨ Generate Cover Letter
                            </button>

                            {coverLetter && (
                                <textarea
                                    className="mt-5 w-full border rounded-lg p-4 h-80"
                                    value={
                                        coverLetter
                                    }
                                    readOnly
                                />
                            )}

                        </div>

                        {/* ======================================================
                            AI INTERVIEW PREPARATION
                        ====================================================== */}

                        <div className="bg-white rounded-3xl shadow-lg p-8">

                            <h2 className="text-2xl font-bold mb-5">
                                AI Interview Preparation
                            </h2>

                            <button
                                className="bg-blue-600 text-white px-5 py-3 rounded-xl"
                                onClick={() =>
                                    setInterviewQuestions(
                                        generateInterviewQuestions(
                                            previewData
                                        )
                                    )
                                }
                            >
                                🎤 Generate Interview Questions
                            </button>

                        </div>

                        {/* INTERVIEW GENERATOR */}

                        <InterviewGenerator
                            questions={
                                interviewQuestions
                            }
                        />

                        {/* PORTFOLIO */}

                        <PortfolioBuilder
                            resume={
                                previewData
                            }
                        />

                        {/* CAREER COACH */}

                        <CareerCoach
                            role={
                                resumeData.targetRole
                            }
                        />

                        {/* MOCK INTERVIEW */}

                        <MockInterview
                            questions={
                                interviewQuestions
                            }
                        />

                        {/* JOB DESCRIPTION MATCHER */}

                        <JobDescriptionMatcher
                            resumeData={
                                previewData
                            }
                        />

                    </div>

                </div>

            </div>
        </section>
    );
}

export default ResumeBuilder;