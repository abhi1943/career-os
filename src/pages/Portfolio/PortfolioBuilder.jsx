import {
    useEffect,
    useMemo,
    useState,
} from "react";

import PortfolioPreview from "./PortfolioPreview";

import {
    generatePortfolio,
} from "../../utils/portfolioGenerator";

import {
    useAuth,
} from "../../context/AuthContext";

import {
    savePortfolio,
    loadPortfolio,
    publishPortfolio,
    unpublishPortfolio,
} from "../../services/firestoreService";

function PortfolioBuilder({ resume }) {
    const { user } = useAuth();

    const [savedPortfolio, setSavedPortfolio] =
        useState(null);

    const [saving, setSaving] =
        useState(false);

    const [saveMessage, setSaveMessage] =
        useState("");

    const [isShared, setIsShared] =
        useState(false);

    const [shareMessage, setShareMessage] =
        useState("");

    const [sharing, setSharing] =
        useState(false);

    const [activeSection, setActiveSection] =
        useState("overview");

    // ======================================================
    // GENERATE PORTFOLIO FROM RESUME
    // ======================================================

    const generatedPortfolio = useMemo(() => {
        if (!resume) {
            return null;
        }

        return generatePortfolio(resume);
    }, [resume]);

    // ======================================================
    // EFFECTIVE PORTFOLIO
    // ======================================================

    const portfolio =
        savedPortfolio || generatedPortfolio;

    // ======================================================
    // PORTFOLIO COUNTS
    // ======================================================

    const skillsCount =
        portfolio?.skills?.length || 0;

    const projectsCount =
        portfolio?.projects?.length || 0;

    const experienceCount =
        portfolio?.experience?.length || 0;

    const hasEducation =
        Boolean(
            portfolio?.education?.college ||
            portfolio?.education?.degree ||
            portfolio?.education?.branch
        );

    const certificationsCount = portfolio?.certifications?.length || 0;
    const achievementsCount = portfolio?.achievements?.length || 0;
    const languagesCount = portfolio?.languages?.length || 0;

    // ======================================================
    // PROFILE COMPLETION
    // ======================================================

    const completionItems = [
        {
            label: "Professional name",
            completed: Boolean(
                portfolio?.hero?.name
            ),
        },
        {
            label: "Professional role",
            completed: Boolean(
                portfolio?.hero?.role
            ),
        },
        {
            label: "About summary",
            completed: Boolean(
                portfolio?.hero?.summary
            ),
        },
        {
            label: "Skills",
            completed: skillsCount > 0,
        },
        {
            label: "Projects",
            completed: projectsCount > 0,
        },
        {
            label: "Education",
            completed: hasEducation,
        },
        {
            label: "Experience",
            completed: experienceCount > 0,
        },
        {
            label: "Contact information",
            completed: Boolean(
                portfolio?.about?.email ||
                portfolio?.about?.phone ||
                portfolio?.about?.linkedin ||
                portfolio?.about?.github
            ),
        },
        { label: "Certifications", completed: certificationsCount > 0 },
        { label: "Achievements", completed: achievementsCount > 0 },
        { label: "Languages", completed: languagesCount > 0 },
    ];

    const completedItems =
        completionItems.filter(
            (item) => item.completed
        ).length;

    const completionPercentage =
        Math.round(
            (completedItems /
                completionItems.length) *
            100
        );

    // ======================================================
    // LOAD FROM FIRESTORE
    // ======================================================

    useEffect(() => {
        if (!user) {
            return;
        }

        let cancelled = false;

        const fetchPortfolio = async () => {
            try {
                const data =
                    await loadPortfolio(
                        user.uid
                    );

                if (
                    cancelled ||
                    !data
                ) {
                    return;
                }

                setSavedPortfolio(data);

                setIsShared(
                    data.published === true
                );
            } catch (error) {
                console.error(
                    "CareerOS load portfolio error:",
                    error
                );
            }
        };

        void fetchPortfolio();

        return () => {
            cancelled = true;
        };
    }, [user]);



    // ======================================================
    // MANUAL GENERATE
    // ======================================================

    const handleGeneratePortfolio = () => {
        if (!resume) {
            return;
        }

        const generated =
            generatePortfolio(resume);

        setSavedPortfolio(generated);

        setSaveMessage(
            "Portfolio regenerated successfully"
        );

        setActiveSection("overview");
    };

    // ======================================================
    // MANUAL SAVE
    // ======================================================

    const handleSavePortfolio = async () => {
        if (
            !user ||
            !portfolio
        ) {
            return;
        }

        try {
            setSaving(true);
            setSaveMessage("");

            await savePortfolio(
                user.uid,
                portfolio
            );

            setSavedPortfolio(
                portfolio
            );

            setSaveMessage(
                "Changes saved successfully"
            );
        } catch (error) {
            console.error(
                "CareerOS manual portfolio save error:",
                error
            );

            setSaveMessage(
                "Unable to save portfolio"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleSharePortfolio = async () => {
        if (
            !user ||
            !portfolio
        ) {
            return;
        }

        try {
            setSharing(true);
            setShareMessage("");

            // Always save the latest portfolio before publishing.
            await savePortfolio(
                user.uid,
                portfolio
            );

            await publishPortfolio(
                user.uid,
                portfolio
            );

            setIsShared(true);

            const shareUrl =
                `${window.location.origin}/portfolio/view/${user.uid}`;

            await navigator.clipboard.writeText(
                shareUrl
            );

            setShareMessage(
                "Portfolio shared! Link copied to clipboard."
            );
        } catch (error) {
            console.error(
                "CareerOS share portfolio error:",
                error
            );

            setShareMessage(
                "Unable to share portfolio"
            );
        } finally {
            setSharing(false);
        }
    };

    const handleUnsharePortfolio = async () => {
        if (!user) {
            return;
        }

        try {
            setSharing(true);
            setShareMessage("");

            await unpublishPortfolio(
                user.uid
            );

            setIsShared(false);

            setShareMessage(
                "Portfolio sharing disabled."
            );
        } catch (error) {
            console.error(
                "CareerOS unshare portfolio error:",
                error
            );

            setShareMessage(
                "Unable to disable portfolio sharing"
            );
        } finally {
            setSharing(false);
        }
    };

    // ======================================================
    // NO RESUME
    // ======================================================

    if (!resume && !portfolio) {
        return (
            <div className="min-h-[70vh] bg-slate-100 px-4 py-10">

                <div className="max-w-5xl mx-auto">

                    <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">

                        <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 px-8 sm:px-12 py-12 text-white">

                            <div className="text-5xl mb-5">
                                🌐
                            </div>

                            <p className="text-blue-100 font-semibold uppercase tracking-widest text-sm">
                                CareerOS Portfolio
                            </p>

                            <h1 className="text-3xl sm:text-4xl font-bold mt-2">
                                Build your professional portfolio
                            </h1>

                            <p className="text-blue-100 mt-4 max-w-2xl leading-relaxed">
                                Create a polished online portfolio
                                using the information from your
                                resume.
                            </p>

                        </div>

                        <div className="p-8 sm:p-12">

                            <div className="grid sm:grid-cols-3 gap-5">

                                <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">
                                    <div className="text-2xl">
                                        👤
                                    </div>

                                    <h3 className="font-bold mt-3">
                                        Professional Profile
                                    </h3>

                                    <p className="text-sm text-gray-500 mt-1">
                                        Showcase who you are.
                                    </p>
                                </div>

                                <div className="p-5 rounded-2xl bg-purple-50 border border-purple-100">
                                    <div className="text-2xl">
                                        🚀
                                    </div>

                                    <h3 className="font-bold mt-3">
                                        Projects
                                    </h3>

                                    <p className="text-sm text-gray-500 mt-1">
                                        Highlight your work.
                                    </p>
                                </div>

                                <div className="p-5 rounded-2xl bg-green-50 border border-green-100">
                                    <div className="text-2xl">
                                        💼
                                    </div>

                                    <h3 className="font-bold mt-3">
                                        Experience
                                    </h3>

                                    <p className="text-sm text-gray-500 mt-1">
                                        Present your journey.
                                    </p>
                                </div>

                            </div>

                            <div className="mt-8 rounded-2xl bg-amber-50 border border-amber-100 p-5">

                                <p className="font-semibold text-amber-800">
                                    📄 Resume required
                                </p>

                                <p className="text-sm text-amber-700 mt-1">
                                    Create or complete your resume
                                    first. CareerOS will use it to
                                    generate your portfolio.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        );
    }

    // ======================================================
    // MAIN UI
    // ======================================================

    return (
        <div className="min-h-screen bg-slate-100 py-8 sm:py-10">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ==================================================
                    HERO
                ================================================== */}

                <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-700 via-blue-700 to-purple-700 shadow-2xl">

                    <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

                    <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-purple-400/20 blur-3xl" />

                    <div className="relative px-6 sm:px-10 lg:px-12 py-10 sm:py-12">

                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

                            <div className="max-w-3xl">

                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-blue-100 text-sm font-semibold">
                                    ✨ CareerOS Portfolio Builder
                                </div>

                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-5">
                                    Build a portfolio that
                                    represents you.
                                </h1>

                                <p className="text-blue-100 text-base sm:text-lg mt-4 leading-relaxed">
                                    Turn your resume into a
                                    professional portfolio that
                                    highlights your skills,
                                    projects, education and
                                    experience.
                                </p>

                            </div>

                            <div className="flex flex-col sm:flex-row lg:flex-col gap-3">

                                <button
                                    type="button"
                                    onClick={
                                        handleGeneratePortfolio
                                    }
                                    disabled={!resume}
                                    className="
                                        px-6
                                        py-3.5
                                        rounded-xl
                                        bg-white
                                        text-blue-700
                                        font-bold
                                        shadow-lg
                                        hover:bg-blue-50
                                        disabled:opacity-50
                                        disabled:cursor-not-allowed
                                        transition
                                    "
                                >
                                    ✨ Regenerate Portfolio
                                </button>

                                <button
                                    type="button"
                                    onClick={handleSavePortfolio}
                                    disabled={
                                        !portfolio ||
                                        saving
                                    }
                                    className="
        px-6
        py-3.5
        rounded-xl
        bg-white/10
        border
        border-white/20
        text-white
        font-semibold
        hover:bg-white/20
        disabled:opacity-50
        transition
    "
                                >
                                    {saving
                                        ? "Saving..."
                                        : "💾 Save Changes"}
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        isShared
                                            ? handleUnsharePortfolio
                                            : handleSharePortfolio
                                    }
                                    disabled={
                                        !portfolio ||
                                        sharing
                                    }
                                    className="
        px-6
        py-3.5
        rounded-xl
        bg-emerald-500
        text-white
        font-bold
        shadow-lg
        hover:bg-emerald-600
        disabled:opacity-50
        transition
    "
                                >
                                    {sharing
                                        ? "Updating..."
                                        : isShared
                                            ? "🔒 Stop Sharing"
                                            : "🔗 Share Portfolio"}
                                </button>

                                {shareMessage && (
                                    <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm font-semibold text-emerald-700">
                                        {shareMessage}
                                    </div>
                                )}
                                {isShared && (
                                    <div className="mt-4 rounded-xl bg-white/10 border border-white/20 px-4 py-3">
                                        <p className="text-sm text-blue-100">
                                            🔗 Your portfolio is publicly shareable.
                                        </p>

                                        <p className="text-xs text-white/70 mt-1 break-all">
                                            {window.location.origin}
                                            /portfolio/view/
                                            {user?.uid}
                                        </p>
                                    </div>
                                )}

                            </div>

                        </div>

                    </div>

                </section>

                {/* ==================================================
                    STATUS BAR
                ================================================== */}

                <section className="mt-6">

                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-6">

                        <div className="flex flex-col lg:flex-row lg:items-center gap-5">

                            <div className="flex-1">

                                <div className="flex items-center justify-between mb-2">

                                    <div>

                                        <p className="text-sm font-semibold text-gray-500">
                                            Portfolio readiness
                                        </p>

                                        <p className="text-xl font-bold text-gray-900">
                                            {completionPercentage}%
                                            complete
                                        </p>

                                    </div>

                                    <div className="text-2xl">
                                        {completionPercentage >=
                                            80
                                            ? "🚀"
                                            : completionPercentage >=
                                                50
                                                ? "✨"
                                                : "📈"}
                                    </div>

                                </div>

                                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">

                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-700"
                                        style={{
                                            width: `${completionPercentage}%`,
                                        }}
                                    />

                                </div>

                            </div>

                            <div className="lg:border-l lg:border-gray-100 lg:pl-6">

                                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
                                    Save status
                                </p>

                                <p className="text-sm font-semibold text-gray-700 mt-1">
                                    {saving
                                        ? "Saving changes..."
                                        : saveMessage ||
                                        "All changes are saved"}
                                </p>

                            </div>

                        </div>

                    </div>

                </section>

                {/* ==================================================
                    QUICK STATS
                ================================================== */}

                <section className="mt-6">

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                            <p className="text-sm text-gray-500">
                                Skills
                            </p>

                            <p className="text-3xl font-bold text-blue-600 mt-2">
                                {skillsCount}
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                                Technical & professional
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                            <p className="text-sm text-gray-500">
                                Projects
                            </p>

                            <p className="text-3xl font-bold text-purple-600 mt-2">
                                {projectsCount}
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                                Featured work
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                            <p className="text-sm text-gray-500">
                                Experience
                            </p>

                            <p className="text-3xl font-bold text-green-600 mt-2">
                                {experienceCount}
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                                Professional roles
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                            <p className="text-sm text-gray-500">
                                Education
                            </p>

                            <p className="text-3xl font-bold text-orange-500 mt-2">
                                {hasEducation
                                    ? "✓"
                                    : "—"}
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                                Academic background
                            </p>
                        </div>

                    </div>

                </section>

                {/* ==================================================
                    SECTION NAVIGATION
                ================================================== */}

                <section className="mt-8">

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2">

                        <div className="flex flex-wrap gap-2">

                            {[
                                [
                                    "overview",
                                    "Overview",
                                ],
                                [
                                    "portfolio",
                                    "Portfolio Preview",
                                ],
                                [
                                    "checklist",
                                    "Completion Checklist",
                                ],
                            ].map(
                                ([
                                    id,
                                    label,
                                ]) => (
                                    <button
                                        key={id}
                                        type="button"
                                        onClick={() =>
                                            setActiveSection(
                                                id
                                            )
                                        }
                                        className={`
                                            px-4
                                            py-2.5
                                            rounded-xl
                                            text-sm
                                            font-semibold
                                            transition
                                            ${activeSection ===
                                                id
                                                ? "bg-blue-600 text-white shadow"
                                                : "text-gray-600 hover:bg-gray-100"
                                            }
                                        `}
                                    >
                                        {label}
                                    </button>
                                )
                            )}

                        </div>

                    </div>

                </section>

                {/* ==================================================
                    OVERVIEW
                ================================================== */}

                {activeSection ===
                    "overview" && (
                        <section className="mt-6">

                            <div className="grid lg:grid-cols-3 gap-6">

                                {/* PROFILE */}

                                <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-7">

                                    <div className="flex items-start justify-between gap-4">

                                        <div>

                                            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                                                Professional Identity
                                            </p>

                                            <h2 className="text-2xl font-bold text-gray-900 mt-1">
                                                {portfolio?.hero?.name ||
                                                    "Your Name"}
                                            </h2>

                                            <p className="text-blue-600 font-semibold mt-1">
                                                {portfolio?.hero?.role ||
                                                    "Professional"}
                                            </p>

                                        </div>

                                        <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl">
                                            👤
                                        </div>

                                    </div>

                                    <div className="mt-6 p-5 rounded-2xl bg-slate-50 border border-slate-100">

                                        <p className="text-sm font-semibold text-gray-700">
                                            About Me
                                        </p>

                                        <p className="text-gray-600 mt-2 leading-relaxed">
                                            {portfolio?.hero
                                                ?.summary ||
                                                "Add a professional summary to introduce yourself to recruiters and employers."}
                                        </p>

                                    </div>

                                    {/* CONTACT */}

                                    <div className="grid sm:grid-cols-2 gap-4 mt-5">

                                        {portfolio?.about
                                            ?.email && (
                                                <div className="p-4 rounded-2xl bg-gray-50">
                                                    <p className="text-xs text-gray-400 uppercase font-semibold">
                                                        Email
                                                    </p>

                                                    <p className="text-sm font-semibold text-gray-700 mt-1 break-all">
                                                        {
                                                            portfolio
                                                                .about
                                                                .email
                                                        }
                                                    </p>
                                                </div>
                                            )}

                                        {portfolio?.about
                                            ?.phone && (
                                                <div className="p-4 rounded-2xl bg-gray-50">
                                                    <p className="text-xs text-gray-400 uppercase font-semibold">
                                                        Phone
                                                    </p>

                                                    <p className="text-sm font-semibold text-gray-700 mt-1">
                                                        {
                                                            portfolio
                                                                .about
                                                                .phone
                                                        }
                                                    </p>
                                                </div>
                                            )}

                                        {portfolio?.about
                                            ?.location && (
                                                <div className="p-4 rounded-2xl bg-gray-50">
                                                    <p className="text-xs text-gray-400 uppercase font-semibold">
                                                        Location
                                                    </p>

                                                    <p className="text-sm font-semibold text-gray-700 mt-1">
                                                        {
                                                            portfolio
                                                                .about
                                                                .location
                                                        }
                                                    </p>
                                                </div>
                                            )}

                                        {portfolio?.about
                                            ?.linkedin && (
                                                <div className="p-4 rounded-2xl bg-gray-50">
                                                    <p className="text-xs text-gray-400 uppercase font-semibold">
                                                        LinkedIn
                                                    </p>

                                                    <p className="text-sm font-semibold text-blue-600 mt-1 truncate">
                                                        {
                                                            portfolio
                                                                .about
                                                                .linkedin
                                                        }
                                                    </p>
                                                </div>
                                            )}

                                    </div>

                                </div>

                                {/* READINESS */}

                                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7">

                                    <p className="text-sm font-semibold uppercase tracking-wide text-purple-600">
                                        Portfolio Quality
                                    </p>

                                    <h2 className="text-2xl font-bold text-gray-900 mt-1">
                                        Looking good
                                    </h2>

                                    <div className="mt-7 flex justify-center">

                                        <div
                                            className="h-36 w-36 rounded-full flex items-center justify-center"
                                            style={{
                                                background: `conic-gradient(#4f46e5 ${completionPercentage * 3.6}deg, #e5e7eb 0deg)`,
                                            }}
                                        >

                                            <div className="h-28 w-28 rounded-full bg-white flex flex-col items-center justify-center">

                                                <span className="text-3xl font-bold text-gray-900">
                                                    {
                                                        completionPercentage
                                                    }
                                                    %
                                                </span>

                                                <span className="text-xs text-gray-400">
                                                    Complete
                                                </span>

                                            </div>

                                        </div>

                                    </div>

                                    <p className="text-sm text-gray-500 text-center mt-6 leading-relaxed">
                                        Complete more sections to
                                        make your portfolio stronger
                                        for recruiters.
                                    </p>

                                </div>

                            </div>

                            {/* SKILLS */}

                            <div className="mt-6 bg-white rounded-3xl shadow-sm border border-gray-100 p-7">

                                <div className="flex items-center justify-between">

                                    <div>
                                        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                                            Expertise
                                        </p>

                                        <h2 className="text-2xl font-bold text-gray-900 mt-1">
                                            Skills
                                        </h2>
                                    </div>

                                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-bold">
                                        {skillsCount} skills
                                    </span>

                                </div>

                                {skillsCount > 0 ? (
                                    <div className="flex flex-wrap gap-3 mt-6">

                                        {portfolio.skills.map(
                                            (
                                                skill,
                                                index
                                            ) => (
                                                <span
                                                    key={`${skill}-${index}`}
                                                    className="
                                                    px-4
                                                    py-2.5
                                                    rounded-xl
                                                    bg-slate-50
                                                    border
                                                    border-gray-200
                                                    text-gray-700
                                                    font-medium
                                                    hover:border-blue-300
                                                    hover:bg-blue-50
                                                    transition
                                                "
                                                >
                                                    {skill}
                                                </span>
                                            )
                                        )}

                                    </div>
                                ) : (
                                    <div className="mt-5 p-5 rounded-2xl bg-amber-50 border border-amber-100">
                                        <p className="font-semibold text-amber-800">
                                            No skills added yet
                                        </p>

                                        <p className="text-sm text-amber-700 mt-1">
                                            Add skills to your resume
                                            to showcase your
                                            expertise here.
                                        </p>
                                    </div>
                                )}

                            </div>

                            
                            {/* PROJECTS */}

                            <div className="mt-6 bg-white rounded-3xl shadow-sm border border-gray-100 p-7">

                                <div className="flex items-center justify-between">

                                    <div>
                                        <p className="text-sm font-semibold uppercase tracking-wide text-purple-600">
                                            Featured Work
                                        </p>

                                        <h2 className="text-2xl font-bold text-gray-900 mt-1">
                                            Projects
                                        </h2>
                                    </div>

                                    <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-sm font-bold">
                                        {projectsCount} projects
                                    </span>

                                </div>

                                {projectsCount > 0 ? (
                                    <div className="grid md:grid-cols-2 gap-5 mt-6">

                                        {portfolio.projects.map(
                                            (project, index) => (
                                                <div
                                                    key={`${project.name || project.title || "project"}-${index}`}
                                                    className="
                                                        rounded-2xl
                                                        border
                                                        border-gray-100
                                                        bg-slate-50
                                                        p-5
                                                        hover:border-purple-200
                                                        hover:bg-purple-50/40
                                                        transition
                                                    "
                                                >

                                                    <div className="flex items-start justify-between gap-4">

                                                        <div className="flex-1">

                                                            <p className="text-xs font-semibold uppercase tracking-wide text-purple-500">
                                                                Project {index + 1}
                                                            </p>

                                                            <h3 className="text-lg font-bold text-gray-900 mt-1">
                                                                {project.name ||
                                                                    project.title ||
                                                                    "Untitled Project"}
                                                            </h3>

                                                        </div>

                                                        <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center text-lg">
                                                            🚀
                                                        </div>

                                                    </div>

                                                    {project.description && (
                                                        <p className="text-sm text-gray-600 mt-4 leading-relaxed line-clamp-3">
                                                            {project.description}
                                                        </p>
                                                    )}

                                                    {project.technologies?.length > 0 && (
                                                        <div className="flex flex-wrap gap-2 mt-4">

                                                            {project.technologies
                                                                .slice(0, 6)
                                                                .map(
                                                                    (
                                                                        technology,
                                                                        technologyIndex
                                                                    ) => (
                                                                        <span
                                                                            key={`${technology}-${technologyIndex}`}
                                                                            className="
                                                                                px-2.5
                                                                                py-1
                                                                                rounded-lg
                                                                                bg-white
                                                                                border
                                                                                border-gray-200
                                                                                text-xs
                                                                                font-medium
                                                                                text-gray-600
                                                                            "
                                                                        >
                                                                            {
                                                                                technology
                                                                            }
                                                                        </span>
                                                                    )
                                                                )}

                                                        </div>
                                                    )}

                                                    {project.link && (
                                                        <a
                                                            href={project.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="
                                                                inline-flex
                                                                items-center
                                                                gap-1
                                                                mt-4
                                                                text-sm
                                                                font-semibold
                                                                text-purple-600
                                                                hover:text-purple-700
                                                            "
                                                        >
                                                            View Project
                                                            <span>↗</span>
                                                        </a>
                                                    )}

                                                </div>
                                            )
                                        )}

                                    </div>
                                ) : (
                                    <div className="mt-5 p-5 rounded-2xl bg-amber-50 border border-amber-100">

                                        <p className="font-semibold text-amber-800">
                                            No projects added yet
                                        </p>

                                        <p className="text-sm text-amber-700 mt-1">
                                            Add projects to your resume
                                            to showcase your work here.
                                        </p>

                                    </div>
                                )}

                            </div>


                        </section>
                    )}

                {/* ==================================================
                    PORTFOLIO PREVIEW
                ================================================== */}

                {activeSection ===
                    "portfolio" && (
                        <section className="mt-6">

                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6">

                                <div className="px-2 sm:px-4 mb-6">

                                    <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
                                        Live Preview
                                    </p>

                                    <h2 className="text-2xl font-bold text-gray-900 mt-1">
                                        Your Portfolio Website
                                    </h2>

                                    <p className="text-gray-500 mt-1">
                                        This is how your generated
                                        portfolio currently looks.
                                    </p>

                                </div>

                                <PortfolioPreview
                                    portfolio={portfolio}
                                    onPortfolioChange={(updatedPortfolio) => {
                                        setSavedPortfolio(updatedPortfolio);
                                    }}
                                    initialTheme={portfolio?.theme || "professional"}
                                    initialAppearance={portfolio?.appearance || "light"}
                                    initialDevice={portfolio?.previewDevice || "desktop"}
                                />

                            </div>

                        </section>
                    )}

                {/* ==================================================
                    CHECKLIST
                ================================================== */}

                {activeSection ===
                    "checklist" && (
                        <section className="mt-6">

                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7">

                                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                                    Portfolio Checklist
                                </p>

                                <h2 className="text-2xl font-bold text-gray-900 mt-1">
                                    Make your portfolio stronger
                                </h2>

                                <p className="text-gray-500 mt-2">
                                    These sections are generated
                                    from your resume.
                                </p>

                                <div className="mt-7 space-y-3">

                                    {completionItems.map(
                                        (
                                            item,
                                            index
                                        ) => (
                                            <div
                                                key={
                                                    item.label
                                                }
                                                className="
                                                flex
                                                items-center
                                                gap-4
                                                p-4
                                                rounded-2xl
                                                border
                                                border-gray-100
                                                bg-gray-50
                                            "
                                            >

                                                <div
                                                    className={`
                                                    h-10
                                                    w-10
                                                    rounded-full
                                                    flex
                                                    items-center
                                                    justify-center
                                                    font-bold
                                                    ${item.completed
                                                            ? "bg-green-100 text-green-600"
                                                            : "bg-gray-200 text-gray-400"
                                                        }
                                                `}
                                                >
                                                    {item.completed
                                                        ? "✓"
                                                        : index +
                                                        1}
                                                </div>

                                                <div className="flex-1">

                                                    <p className="font-semibold text-gray-800">
                                                        {
                                                            item.label
                                                        }
                                                    </p>

                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        {item.completed
                                                            ? "Completed"
                                                            : "Missing from portfolio"}
                                                    </p>

                                                </div>

                                                <span
                                                    className={
                                                        item.completed
                                                            ? "text-green-600 text-sm font-bold"
                                                            : "text-gray-400 text-sm"
                                                    }
                                                >
                                                    {item.completed
                                                        ? "Ready"
                                                        : "Add"}
                                                </span>

                                            </div>
                                        )
                                    )}

                                </div>

                                <div className="mt-7 rounded-2xl bg-blue-50 border border-blue-100 p-5">

                                    <p className="font-semibold text-blue-800">
                                        💡 Tip
                                    </p>

                                    <p className="text-sm text-blue-700 mt-1 leading-relaxed">
                                        Your portfolio is generated
                                        from your Resume Builder
                                        information. Improving your
                                        resume will automatically give
                                        you a richer portfolio.
                                    </p>

                                </div>

                            </div>


                        </section>
                    )}


                {/* ==================================================
                    FOOTER INFORMATION
                ================================================== */}

                <div className="mt-8 text-center">

                    <p className="text-sm text-gray-400">
                        CareerOS Portfolio Builder
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                        Your portfolio is automatically synced
                        with your CareerOS account.
                    </p>

                </div>

            </div>

        </div>
    );
}

export default PortfolioBuilder;