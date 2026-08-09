import { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
import { toPng } from "html-to-image";
import { getResumeVersions, saveResumeVersion, deleteResumeVersion, } from "../../services/resumeVersionManager";
import ResumeForm from "../../components/resume/ResumeForm";
import ResumePreview from "../../components/resume/ResumePreview";
import ResumeAnalyzer from "../../components/resume/ResumeAnalyzer";
import ResumeScoreCard from "../../components/resume/ResumeScoreCard";
import { generateCoverLetter } from "../../services/coverLetterGenerator";
import { generateResume } from "../../utils/resumeGenerator";
import { analyzeResume } from "../../utils/resumeAnalyzer";
import JobDescriptionAnalyzer from "../../components/resume/JobDescriptionAnalyzer";
import { checkATSKeywords } from "../../utils/atsKeywordChecker";
import { calculateResumeCompletion } from "../../utils/resumeCompletion";
import { useMemo } from "react";
import { optimizeProject } from "../../services/resumeOptimizer";
import JobDescriptionMatcher from "../../components/resume/JobDescriptionMatcher";
import ResumeOptimizer from "../../components/resume/ResumeOptimizer";
import { analyzeJobDescription } from "../../utils/jobDescriptionAnalyzer";
import { optimizeResume } from "../../services/resumeOptimizer";
import ResumeSuggestions from "../../components/resume/ResumeSuggestions";
import InterviewGenerator from "../../components/resume/InterviewGenerator";
import { generateInterviewQuestions } from "../../services/interviewGenerator";
import ResumeDashboard from "../../components/resume/ResumeDashboard";
import MockInterview from "../../components/resume/MockInterview";
import PortfolioBuilder from "../Portfolio/PortfolioBuilder";
import CareerCoach from "../../components/resume/CareerCoach";
import {
    saveResume,
    loadResume,
} from "../../services/firestoreService";

import { useAuth } from "../../context/AuthContext";
const getInitialResumeData = () => {
    const saved = localStorage.getItem("careeros_resume");

    if (saved) {
        return JSON.parse(saved);
    } return {

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

        interests: ""
    };

};

function ResumeBuilder() {

    const resumeRef = useRef(null);
    const { user } = useAuth();

    const [template, setTemplate] = useState("modern");

    const [downloading, setDownloading] = useState(false);

    const [history, setHistory] = useState([]);
    // const [versionName, setVersionName] = useState("");

    const [savedVersions, setSavedVersions] = useState([]);
    const [companyName, setCompanyName] = useState("");
    const [coverLetter, setCoverLetter] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [resumeData, setResumeData] = useState(getInitialResumeData);
    const [optimizedResume, setOptimizedResume] = useState(null);
    const [optimizing, setOptimizing] = useState(false);
    const [interviewQuestions, setInterviewQuestions] = useState(null);

    // Auto Save

    useEffect(() => {

        localStorage.setItem(
            "careeros_resume",
            JSON.stringify(resumeData)
        );

        if (!user) return;

        saveResume(
            user.uid,
            resumeData
        );

    }, [resumeData, user]);

    useEffect(() => {
        setSavedVersions(getResumeVersions());
    }, []);

    useEffect(() => {

        if (!user) return;

        async function fetchResume() {

            const data = await loadResume(user.uid);

            if (data) {

                setResumeData(data);

            }

        }

        fetchResume();

    }, [user]);

    const optimizedProjects = useMemo(
        () =>
            resumeData.projects.map(project =>
                optimizeProject(
                    project,
                    resumeData.targetRole
                )
            ),
        [resumeData.projects, resumeData.targetRole]
    );

    const previewData = useMemo(
        () =>
            generateResume({
                ...resumeData,
                projects: optimizedProjects,
            }),
        [resumeData, optimizedProjects]
    );

    const analysis = useMemo(
        () => analyzeResume(previewData),
        [previewData]
    );

    const atsKeywords = useMemo(
        () => checkATSKeywords(previewData),
        [previewData]
    );

    const completion = useMemo(
        () => calculateResumeCompletion(previewData),
        [previewData]
    );
    const jdAnalysis = useMemo(
        () =>
            analyzeJobDescription(
                jobDescription,
                resumeData
            ),
        [jobDescription, resumeData]
    );
    const downloadPDF = async () => {
        try {
            setDownloading(true);

            const image = await toPng(resumeRef.current, {
                cacheBust: true,
                pixelRatio: 3,
                backgroundColor: "#ffffff",
            });

            const pdf = new jsPDF("p", "mm", "a4");

            const pdfWidth = pdf.internal.pageSize.getWidth();

            const img = new Image();

            img.src = image;

            await new Promise((resolve) => {
                img.onload = resolve;
            });

            const pdfHeight = (img.height * pdfWidth) / img.width;

            pdf.addImage(
                image,
                "PNG",
                0,
                0,
                pdfWidth,
                pdfHeight
            );

            pdf.save(`${resumeData.name || "Resume"}.pdf`);
        } finally {
            setDownloading(false);
        }
    };

    const handleOptimize = () => {
        setOptimizing(true);

        setTimeout(() => {
            const optimized = optimizeResume(resumeData);

            setResumeData(optimized);

            setOptimizedResume(
                JSON.stringify(optimized, null, 2)
            );

            setOptimizing(false);
        }, 700);
    };

    return (

        <section className="min-h-screen bg-slate-100 py-10">

            <div className="max-w-7xl mx-auto px-6">

                <h1 className="text-5xl font-bold text-center mb-8">

                    Resume Builder

                </h1>

                {/* Top Buttons */}

                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">

                    <div className="flex gap-3">

                        <button
                            onClick={() => setTemplate("modern")}
                            className={`px-5 py-2 rounded-xl ${template === "modern"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200"
                                }`}
                        >

                            Modern

                        </button>

                        <button
                            onClick={() => setTemplate("classic")}
                            className={`px-5 py-2 rounded-xl ${template === "classic"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200"
                                }`}>Classic</button>

                        <button
                            onClick={() => setTemplate("minimal")}
                            className={`px-5 py-2 rounded-xl ${template === "minimal"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200"
                                }`}>Minimal</button>

                    </div>

                    <div className="flex gap-3">

                        <button onClick={() => {

                            if (history.length === 0) return;

                            setHistory((prev) => {

                                if (prev.length === 0) return prev;

                                const copy = [...prev];

                                const previous = copy.pop();

                                setResumeData(previous);

                                return copy;

                            });

                        }}

                            className="bg-yellow-500 text-white px-5 py-2 rounded-xl" >

                            ↩ Undo</button>

                        <button onClick={() => {
                            localStorage.removeItem("careeros_resume");
                            setResumeData(getInitialResumeData());
                            setHistory([]);
                        }} className="bg-red-600 text-white px-5 py-2 rounded-xl">Reset
                        </button>

                        <button
                            onClick={() => {
                                saveResumeVersion(resumeData.name || "My Resume", resumeData);

                                setSavedVersions(getResumeVersions());
                            }}
                            className="bg-indigo-600 text-white px-5 py-2 rounded-xl">
                            💾 Save Version
                        </button>

                        <button
                            disabled={downloading}
                            onClick={downloadPDF}

                            className="bg-green-600 text-white px-6 py-2 rounded-xl">

                            {downloading ? "Generating PDF..." : "📄 Download ATS Resume"}
                        </button>

                    </div>

                </div>

                <div className="grid lg:grid-cols-2 gap-8">

                    <ResumeForm

                        resumeData={resumeData}

                        setResumeData={(data) => {

                            if (JSON.stringify(data) !== JSON.stringify(resumeData)) {

                                setHistory((prev) => [
                                    ...prev.slice(-19),
                                    structuredClone(resumeData),
                                ]);

                            }

                            setResumeData(data);

                        }}

                    />

                    <div className="space-y-6 sticky top-4">

                        <ResumePreview
                            resume={previewData}
                            resumeRef={resumeRef}
                            template={template}
                        />
                        <ResumeDashboard
                            analysis={analysis}
                            completion={completion}
                            versions={savedVersions}
                            atsKeywords={atsKeywords}
                        />

                        <ResumeAnalyzer
                            analysis={analysis}
                            atsKeywords={atsKeywords}
                        />

                        <ResumeOptimizer
                            optimizedResume={optimizedResume}
                            loading={optimizing}
                            onOptimize={handleOptimize}
                        />

                        <ResumeScoreCard
                            analysis={analysis}
                        />

                        <ResumeSuggestions
                            analysis={analysis}
                        />

                        <div className="bg-white rounded-3xl shadow-lg p-8">

                            <h2 className="text-2xl font-bold mb-6">
                                Resume Versions
                            </h2>

                            {
                                savedVersions.length === 0 ? (

                                    <p className="text-gray-500">
                                        No saved versions yet.
                                    </p>

                                ) : (

                                    <div className="space-y-4">

                                        {
                                            savedVersions.map(version => (

                                                <div
                                                    key={version.id}
                                                    className="border rounded-xl p-4 flex justify-between items-center"
                                                >

                                                    <div>

                                                        <h3 className="font-semibold">
                                                            {version.name || "Untitled Resume"}
                                                        </h3>

                                                        <p className="text-sm text-gray-500">
                                                            {version.updatedAt}
                                                        </p>

                                                    </div>

                                                    <div className="flex gap-2">

                                                        <button
                                                            className="bg-blue-600 text-white px-3 py-1 rounded-lg"
                                                            onClick={() => {

                                                                setResumeData(version.resume);

                                                            }}
                                                        >
                                                            Load
                                                        </button>

                                                        <button
                                                            className="bg-red-600 text-white px-3 py-1 rounded-lg"
                                                            onClick={() => {

                                                                deleteResumeVersion(version.name);

                                                                setSavedVersions(getResumeVersions());

                                                            }}
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>

                                                </div>

                                            ))
                                        }

                                    </div>

                                )
                            }

                        </div>

                        {/* Resume Completion */}

                        <div className="bg-white rounded-3xl shadow-lg p-8">

                            <h2 className="text-2xl font-bold">

                                Resume Completion

                            </h2>

                            <div className="bg-gray-200 h-4 rounded-full mt-4">

                                <div

                                    className="bg-green-600 h-4 rounded-full"

                                    style={{

                                        width: `${completion.percentage}%`

                                    }} />

                            </div>

                            <p className="mt-3 font-bold">

                                {completion.percentage}% Complete

                            </p>

                            <div className="mt-6 space-y-2">

                                {

                                    (completion.sections || []).map(section => (

                                        <div

                                            key={section.name}

                                            className="flex justify-between">

                                            <span>

                                                {section.name}

                                            </span>

                                            <span>

                                                {section.completed ? "✅" : "❌"}

                                            </span>

                                        </div>

                                    ))

                                }

                            </div>

                        </div>

                        {/* ATS Keywords */}

                        <div className="bg-white rounded-3xl shadow-lg p-8">

                            <h2 className="text-2xl font-bold">

                                ATS Keywords

                            </h2>

                            <div className="mt-5">

                                <h3 className="font-semibold text-green-700">

                                    Matched

                                </h3>

                                <div className="flex flex-wrap gap-2 mt-2">

                                    {

                                        (atsKeywords.found || []).map(skill => (

                                            <span

                                                key={skill}

                                                className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"

                                            >

                                                {skill}

                                            </span>

                                        ))

                                    }

                                </div>

                            </div>

                            <div className="mt-6">

                                <h3 className="font-semibold text-red-700">

                                    Missing

                                </h3>

                                <div className="flex flex-wrap gap-2 mt-2">

                                    {

                                        (atsKeywords.missing || []).map(skill => (

                                            <span

                                                key={skill}

                                                className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm"

                                            >

                                                {skill}

                                            </span>

                                        ))

                                    }

                                </div>

                            </div>

                        </div>

                        <JobDescriptionAnalyzer
                            jobDescription={jobDescription}
                            setJobDescription={setJobDescription}
                            jdAnalysis={jdAnalysis}
                        />
                        <div className="bg-white rounded-3xl shadow-lg p-8">

                            <h2 className="text-2xl font-bold mb-5">
                                AI Cover Letter
                            </h2>

                            <input
                                type="text"
                                placeholder="Company Name"
                                value={companyName}
                                onChange={(e) =>
                                    setCompanyName(e.target.value)
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

                            {
                                coverLetter && (

                                    <textarea
                                        className="mt-5 w-full border rounded-lg p-4 h-80"
                                        value={coverLetter}
                                        readOnly />

                                )
                            }

                        </div>

                        <div className="bg-white rounded-3xl shadow-lg p-8">

                            <h2 className="text-2xl font-bold mb-5">
                                AI Interview Preparation
                            </h2>

                            <button
                                className="bg-blue-600 text-white px-5 py-3 rounded-xl"
                                onClick={() =>
                                    setInterviewQuestions(
                                        generateInterviewQuestions(previewData)
                                    )
                                }
                            >
                                🎤 Generate Interview Questions
                            </button>

                        </div>
                        <InterviewGenerator
                            questions={interviewQuestions}
                        />
                        <PortfolioBuilder
                            resume={previewData}
                        />
                        <CareerCoach
                            role={resumeData.targetRole}
                        />
                        <MockInterview
                            questions={interviewQuestions}
                        />
                        <JobDescriptionMatcher resumeData={previewData} />

                    </div>

                </div>

            </div>

        </section>

    );
}

export default ResumeBuilder;