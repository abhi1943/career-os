import {
    useEffect,
    useState,
    useRef,
} from "react";

import {
    Edit3,
    Eye,
    Save,
    X,
    Plus,
    Trash2,
    Mail,
    Phone,
    MapPin,
    ExternalLink,
    GraduationCap,
    Briefcase,
    Code2,
    User,
    Sparkles,
    Award,
    Trophy,
    Languages,
    Target,
    Globe,
    Upload,
    CalendarDays,
    Download,
    Monitor,
    Tablet,
    Smartphone,
    Sun,
    Moon,
    Palette,
} from "lucide-react";

import {
    useAuth,
} from "../../context/AuthContext";

import {
    savePortfolio,
} from "../../services/firestoreService";

import { jsPDF } from "jspdf";
import { toPng } from "html-to-image";

function PortfolioPreview({
    portfolio,
    onPortfolioChange,
    initialTheme = "professional",
    initialAppearance = "light",
    initialDevice = "desktop",
}) {
    const { user } = useAuth();

    const [
        isEditing,
        setIsEditing,
    ] = useState(false);

    const [
        draftPortfolio,
        setDraftPortfolio,
    ] = useState(null);

    const [
        saving,
        setSaving,
    ] = useState(false);

    const [
        savedMessage,
        setSavedMessage,
    ] = useState("");

    const [theme, setTheme] = useState(
        portfolio?.theme || initialTheme
    );

    const [appearance, setAppearance] = useState(
        portfolio?.appearance || initialAppearance
    );

    const [previewDevice, setPreviewDevice] = useState(
        portfolio?.previewDevice || initialDevice
    );

    const portfolioRef = useRef(null);

    // ======================================================
    // LOAD PORTFOLIO INTO EDITOR
    // ======================================================

    useEffect(() => {
    if (!portfolio) {
        return;
    }

    const copy = JSON.parse(
        JSON.stringify(portfolio)
    );

    copy.theme =
        copy.theme || initialTheme;

    copy.appearance =
        copy.appearance || initialAppearance;

    copy.previewDevice =
        copy.previewDevice || initialDevice;

    const timerId = window.setTimeout(() => {
        setDraftPortfolio(copy);
        setTheme(copy.theme);
        setAppearance(copy.appearance);
        setPreviewDevice(copy.previewDevice);
    }, 0);

    return () => {
        window.clearTimeout(timerId);
    };
}, [
    portfolio,
    initialTheme,
    initialAppearance,
    initialDevice,
]);

    // ======================================================
    // SAFE DEFAULTS
    // ======================================================

    const currentPortfolio =
        portfolio ? draftPortfolio || portfolio : null;

    if (!currentPortfolio) {
        return (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
                <div className="text-5xl mb-4">
                    🌐
                </div>

                <h3 className="text-xl font-bold text-gray-900">
                    Your portfolio will appear here
                </h3>

                <p className="text-gray-500 mt-2">
                    Generate your portfolio to see the
                    professional preview.
                </p>
            </div>
        );
    }

    // ======================================================
    // HELPERS
    // ======================================================

    const updatePortfolio = (
        section,
        field,
        value
    ) => {
        setDraftPortfolio((previous) => ({
            ...previous,

            [section]: {
                ...(previous?.[section] || {}),
                [field]: value,
            },
        }));
    };

    const updateRootField = (
        field,
        value
    ) => {
        setDraftPortfolio((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    const updateArrayItem = (
        section,
        index,
        field,
        value
    ) => {
        setDraftPortfolio((previous) => {
            const items = [
                ...(previous?.[section] || []),
            ];

            items[index] = {
                ...items[index],
                [field]: value,
            };

            return {
                ...previous,
                [section]: items,
            };
        });
    };

    const removeArrayItem = (
        section,
        index
    ) => {
        setDraftPortfolio((previous) => {
            const items = [
                ...(previous?.[section] || []),
            ];

            items.splice(index, 1);

            return {
                ...previous,
                [section]: items,
            };
        });
    };

    // ======================================================
    // SKILLS
    // ======================================================

    const addSkill = () => {
        setDraftPortfolio((previous) => ({
            ...previous,

            skills: [
                ...(previous?.skills || []),
                "New Skill",
            ],
        }));
    };

    const updateSkill = (
        index,
        value
    ) => {
        setDraftPortfolio((previous) => {
            const skills = [
                ...(previous?.skills || []),
            ];

            skills[index] = value;

            return {
                ...previous,
                skills,
            };
        });
    };

    const removeSkill = (
        index
    ) => {
        setDraftPortfolio((previous) => {
            const skills = [
                ...(previous?.skills || []),
            ];

            skills.splice(index, 1);

            return {
                ...previous,
                skills,
            };
        });
    };

    // ======================================================
    // PROJECTS
    // ======================================================

    const addProject = () => {
        setDraftPortfolio((previous) => ({
            ...previous,

            projects: [
                ...(previous?.projects || []),

                {
                    name: "New Project",
                    title: "New Project",
                    description:
                        "Describe your project here.",
                    technologies: [],
                    techStack: [],
                    link: "",
                    github: "",
                    liveDemo: "",
                    startDate: "",
                    endDate: "",
                },
            ],
        }));
    };

    // ======================================================
    // EXPERIENCE
    // ======================================================

    const addExperience = () => {
        setDraftPortfolio((previous) => ({
            ...previous,

            experience: [
                ...(previous?.experience || []),

                {
                    company: "Company Name",
                    role: "Job Role",
                    title: "Job Role",
                    duration: "",
                    location: "",
                    description:
                        "Describe your responsibilities and achievements.",
                },
            ],
        }));
    };

    // ======================================================
    // SAVE
    // ======================================================

    const handleSave = async () => {
        if (!draftPortfolio) {
            return;
        }

        try {
            setSaving(true);
            setSavedMessage("");

            // ------------------------------------------------
            // Update parent when available
            // ------------------------------------------------

            const finalPortfolio = {
                ...draftPortfolio,
                theme,
                appearance,
                previewDevice,
            };

            if (
                typeof onPortfolioChange ===
                "function"
            ) {
                onPortfolioChange(
                    finalPortfolio
                );
            }

            // ------------------------------------------------
            // Save directly to Firestore as well
            // ------------------------------------------------

            if (user?.uid) {
                await savePortfolio(
                    user.uid,
                    finalPortfolio
                );
            }

            setIsEditing(false);

            setSavedMessage(
                "Portfolio changes saved successfully."
            );

            setTimeout(() => {
                setSavedMessage("");
            }, 3000);
        } catch (error) {
            console.error(
                "CareerOS save portfolio error:",
                error
            );

            setSavedMessage(
                "Unable to save portfolio. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    // ======================================================
    // CANCEL
    // ======================================================

    const handleCancel = () => {
        setDraftPortfolio(
            JSON.parse(
                JSON.stringify(
                    portfolio
                )
            )
        );

        setTheme(portfolio?.theme || initialTheme);
        setAppearance(portfolio?.appearance || initialAppearance);
        setPreviewDevice(portfolio?.previewDevice || initialDevice);
        setIsEditing(false);
        setSavedMessage("");
    };

    // ======================================================
    // VALUES
    // ======================================================

    const hero =
        currentPortfolio.hero || {};

    const about =
        currentPortfolio.about || {};

    const education =
        currentPortfolio.education || {};

    const skills =
        currentPortfolio.skills || [];

    const projects =
        currentPortfolio.projects || [];

    const experience =
        currentPortfolio.experience || [];

    const certifications =
        currentPortfolio.certifications || [];

    const achievements =
        currentPortfolio.achievements || [];

    const languages =
        currentPortfolio.languages || [];

    const careerObjective =
        currentPortfolio.careerObjective || "";

    // ======================================================
    // NORMALIZE PROJECT DATA
    // ======================================================

    const getProjectName = (
        project
    ) =>
        project?.name ||
        project?.title ||
        "Untitled Project";

    const getProjectDescription = (
        project
    ) =>
        project?.description ||
        project?.summary ||
        "No project description added.";

    const getProjectTechnologies = (
        project
    ) => {
        if (
            Array.isArray(
                project?.technologies
            )
        ) {
            return project.technologies;
        }

        if (
            Array.isArray(
                project?.techStack
            )
        ) {
            return project.techStack;
        }

        if (
            typeof project?.technologies ===
            "string"
        ) {
            return project.technologies
                .split(",")
                .map((item) =>
                    item.trim()
                )
                .filter(Boolean);
        }

        return [];
    };

    const addCertification = () => {
        setDraftPortfolio((previous) => ({
            ...previous,

            certifications: [
                ...(previous?.certifications || []),
                {
                    name: "Certification Name",
                    issuer: "Issuing Organization",
                    date: "",
                    url: "",
                },
            ],
        }));
    };

    const addAchievement = () => {
        setDraftPortfolio((previous) => ({
            ...previous,

            achievements: [
                ...(previous?.achievements || []),
                {
                    title: "Achievement",
                    description: "",
                    date: "",
                },
            ],
        }));
    };

    const addLanguage = () => {
        setDraftPortfolio((previous) => ({
            ...previous,

            languages: [
                ...(previous?.languages || []),
                {
                    name: "English",
                    proficiency: "Professional",
                },
            ],
        }));
    };

    const THEMES = {
        professional: { label: "Professional", hero: "from-slate-950 via-blue-950 to-indigo-900", accent: "blue" },
        modern: { label: "Modern", hero: "from-slate-950 via-purple-950 to-indigo-900", accent: "purple" },
        minimal: { label: "Minimal", hero: "from-gray-900 via-gray-800 to-gray-700", accent: "gray" },
        executive: { label: "Executive", hero: "from-slate-950 via-slate-900 to-amber-950", accent: "amber" },
    };

    const selectedTheme = THEMES[theme] || THEMES.professional;
    const isDark = appearance === "dark";

    const setPresentation = (field, value) => {
        if (field === "theme") setTheme(value);
        if (field === "appearance") setAppearance(value);
        if (field === "previewDevice") setPreviewDevice(value);

        setDraftPortfolio((previous) => ({
            ...previous,
            [field]: value,
        }));

        if (typeof onPortfolioChange === "function") {
            onPortfolioChange({
                ...currentPortfolio,
                [field]: value,
            });
        }
    };

    const handleAvatarUpload = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setSavedMessage("Please select an image file.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setSavedMessage("Avatar must be smaller than 5 MB.");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const image = new Image();
            image.onload = () => {
                const max = 512;
                const scale = Math.min(1, max / Math.max(image.width, image.height));
                const canvas = document.createElement("canvas");
                canvas.width = Math.round(image.width * scale);
                canvas.height = Math.round(image.height * scale);
                canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
                updateRootField("avatar", canvas.toDataURL("image/jpeg", 0.82));
                setSavedMessage("Avatar added. Save the portfolio to keep it.");
            };
            image.src = reader.result;
        };
        reader.readAsDataURL(file);
    };

    const downloadPdf = async () => {
        if (!portfolioRef.current) return;

        try {
            setSavedMessage("Preparing PDF...");
            const dataUrl = await toPng(portfolioRef.current, {
                cacheBust: true,
                pixelRatio: 2,
                backgroundColor: isDark ? "#0f172a" : "#ffffff",
            });

            const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const image = new Image();

            image.onload = () => {
                const imageHeight = image.height * (pageWidth / image.width);
                let y = 0;
                let remaining = imageHeight;
                pdf.addImage(dataUrl, "PNG", 0, y, pageWidth, imageHeight);
                remaining -= pageHeight;
                while (remaining > 0) {
                    y -= pageHeight;
                    pdf.addPage();
                    pdf.addImage(dataUrl, "PNG", 0, y, pageWidth, imageHeight);
                    remaining -= pageHeight;
                }
                const name = (hero.name || "portfolio").replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase() || "portfolio";
                pdf.save(`${name}-portfolio.pdf`);
                setSavedMessage("Portfolio PDF downloaded.");
            };
            image.src = dataUrl;
        } catch (error) {
            console.error("CareerOS portfolio PDF error:", error);
            setSavedMessage("Unable to create PDF. Please try again.");
        }
    };

    // ======================================================
    // INPUT COMPONENT
    // ======================================================

    const inputClass = `
        w-full
        px-4
        py-3
        rounded-xl
        border
        border-gray-200
        bg-white
        text-gray-900
        outline-none
        focus:border-blue-500
        focus:ring-2
        focus:ring-blue-100
        transition
    `;

    const textareaClass = `
        w-full
        px-4
        py-3
        rounded-xl
        border
        border-gray-200
        bg-white
        text-gray-900
        outline-none
        focus:border-blue-500
        focus:ring-2
        focus:ring-blue-100
        transition
        resize-y
    `;

    // ======================================================
    // EDIT MODE
    // ======================================================

    if (isEditing) {
        return (
            <div className="rounded-3xl bg-white border border-gray-100 shadow-xl overflow-hidden">

                {/* ==================================================
                    EDIT HEADER
                ================================================== */}

                <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 px-6 sm:px-8 py-7 text-white">

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">

                        <div>
                            <div className="flex items-center gap-2 text-blue-100 text-sm font-semibold">
                                <Edit3 size={17} />
                                Portfolio Editor
                            </div>

                            <h2 className="text-2xl sm:text-3xl font-bold mt-2">
                                Edit Your Portfolio
                            </h2>

                            <p className="text-blue-100 mt-1">
                                Customize your professional profile,
                                projects, skills and experience.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">

                            <button
                                type="button"
                                onClick={
                                    handleCancel
                                }
                                className="
                                    px-4
                                    py-2.5
                                    rounded-xl
                                    bg-white/10
                                    hover:bg-white/20
                                    border
                                    border-white/20
                                    transition
                                    font-semibold
                                    flex
                                    items-center
                                    gap-2
                                "
                            >
                                <X size={17} />
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={
                                    handleSave
                                }
                                disabled={saving}
                                className="
                                    px-5
                                    py-2.5
                                    rounded-xl
                                    bg-white
                                    text-blue-700
                                    hover:bg-blue-50
                                    transition
                                    font-semibold
                                    flex
                                    items-center
                                    gap-2
                                    disabled:opacity-60
                                "
                            >
                                <Save size={17} />

                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}
                            </button>

                        </div>

                    </div>

                </div>

                {/* ==================================================
                    SAVE MESSAGE
                ================================================== */}

                {savedMessage && (
                    <div className="px-6 sm:px-8 pt-5">

                        <div
                            className={`
                                rounded-xl
                                px-4
                                py-3
                                text-sm
                                font-medium
                                ${savedMessage.includes(
                                "successfully"
                            )
                                    ? "bg-green-50 text-green-700 border border-green-100"
                                    : "bg-red-50 text-red-700 border border-red-100"
                                }
                            `}
                        >
                            {savedMessage}
                        </div>

                    </div>
                )}

                {/* ==================================================
                    EDIT CONTENT
                ================================================== */}

                <div className="p-6 sm:p-8 space-y-8">

                    {/* ==================================================
                        BASIC PROFILE
                    ================================================== */}

                    <section>

                        <div className="flex items-center gap-3 mb-5">

                            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <User size={20} />
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    Professional Profile
                                </h3>

                                <p className="text-sm text-gray-500">
                                    Your introduction and professional identity.
                                </p>
                            </div>

                        </div>

                        <div className="grid md:grid-cols-2 gap-5">

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    className={
                                        inputClass
                                    }
                                    value={
                                        hero.name ||
                                        ""
                                    }
                                    onChange={(event) =>
                                        updatePortfolio(
                                            "hero",
                                            "name",
                                            event.target.value
                                        )
                                    }
                                    placeholder="Your Name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Professional Role
                                </label>

                                <input
                                    type="text"
                                    className={
                                        inputClass
                                    }
                                    value={
                                        hero.role ||
                                        ""
                                    }
                                    onChange={(event) =>
                                        updatePortfolio(
                                            "hero",
                                            "role",
                                            event.target.value
                                        )
                                    }
                                    placeholder="Frontend Developer"
                                />
                            </div>

                            <div className="md:col-span-2">

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Professional Summary
                                </label>

                                <textarea
                                    rows="5"
                                    className={
                                        textareaClass
                                    }
                                    value={
                                        hero.summary ||
                                        ""
                                    }
                                    onChange={(event) =>
                                        updatePortfolio(
                                            "hero",
                                            "summary",
                                            event.target.value
                                        )
                                    }
                                    placeholder="Write a short professional introduction..."
                                />

                            </div>

                        </div>

                    </section>

                    {/* ==================================================
                        AVATAR
                    ================================================== */}

                    <section className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Upload size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Profile Avatar</h3>
                                <p className="text-sm text-gray-500">Add a professional profile photo.</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-5">
                            {currentPortfolio.avatar ? (
                                <img src={currentPortfolio.avatar} alt="Avatar" className="h-24 w-24 rounded-full object-cover border-4 border-white shadow" />
                            ) : (
                                <div className="h-24 w-24 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-3xl font-bold">
                                    {(hero.name || "Y").charAt(0).toUpperCase()}
                                </div>
                            )}

                            <div>
                                <label className="inline-flex cursor-pointer items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm">
                                    <Upload size={16} />
                                    Upload Avatar
                                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                                </label>
                                {currentPortfolio.avatar && (
                                    <button type="button" onClick={() => updateRootField("avatar", "")} className="ml-3 text-sm text-red-500 font-semibold">
                                        Remove
                                    </button>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* ==================================================
                        PRESENTATION
                    ================================================== */}

                    <section>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="h-10 w-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                                <Palette size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Portfolio Theme & Appearance</h3>
                                <p className="text-sm text-gray-500">Choose the visual style used by the portfolio.</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Theme</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {Object.entries(THEMES).map(([id, item]) => (
                                        <button key={id} type="button" onClick={() => setPresentation("theme", id)} className={`p-3 rounded-xl border text-left ${theme === id ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-200"}`}>
                                            <div className={`h-7 rounded-lg bg-gradient-to-r ${item.hero}`} />
                                            <p className="font-semibold text-gray-800 mt-2">{item.label}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Appearance</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button type="button" onClick={() => setPresentation("appearance", "light")} className={`p-4 rounded-xl border ${appearance === "light" ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-200"}`}>
                                        <Sun size={22} className="text-amber-500" />
                                        <p className="font-semibold mt-2">Light</p>
                                    </button>
                                    <button type="button" onClick={() => setPresentation("appearance", "dark")} className={`p-4 rounded-xl border ${appearance === "dark" ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-200"}`}>
                                        <Moon size={22} className="text-indigo-600" />
                                        <p className="font-semibold mt-2">Dark</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ==================================================
    CAREER OBJECTIVE
================================================== */}

                    <section>

                        <div className="flex items-center gap-3 mb-5">

                            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Target size={20} />
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    Career Objective
                                </h3>

                                <p className="text-sm text-gray-500">
                                    Describe your professional career goal.
                                </p>
                            </div>

                        </div>

                        <div>

                            <textarea
                                rows="5"
                                maxLength={500}
                                className={textareaClass}
                                value={careerObjective}
                                onChange={(event) =>
                                    updateRootField(
                                        "careerObjective",
                                        event.target.value
                                    )
                                }
                                placeholder="Write your career objective..."
                            />

                            <div className="flex justify-end mt-1">
                                <p className="text-xs text-gray-400">
                                    {careerObjective.length}/500
                                </p>
                            </div>

                        </div>

                    </section>

                    {/* ==================================================
                        CONTACT
                    ================================================== */}

                    <section>

                        <div className="flex items-center gap-3 mb-5">

                            <div className="h-10 w-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                                <Mail size={20} />
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    Contact Information
                                </h3>

                                <p className="text-sm text-gray-500">
                                    Let recruiters know how to reach you.
                                </p>
                            </div>

                        </div>

                        <div className="grid md:grid-cols-2 gap-5">

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    className={
                                        inputClass
                                    }
                                    value={
                                        about.email ||
                                        ""
                                    }
                                    onChange={(event) =>
                                        updatePortfolio(
                                            "about",
                                            "email",
                                            event.target.value
                                        )
                                    }
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Phone
                                </label>

                                <input
                                    type="text"
                                    className={
                                        inputClass
                                    }
                                    value={
                                        about.phone ||
                                        ""
                                    }
                                    onChange={(event) =>
                                        updatePortfolio(
                                            "about",
                                            "phone",
                                            event.target.value
                                        )
                                    }
                                    placeholder="+91 XXXXX XXXXX"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Location
                                </label>

                                <input
                                    type="text"
                                    className={
                                        inputClass
                                    }
                                    value={
                                        about.location ||
                                        ""
                                    }
                                    onChange={(event) =>
                                        updatePortfolio(
                                            "about",
                                            "location",
                                            event.target.value
                                        )
                                    }
                                    placeholder="Chennai, India"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    LinkedIn
                                </label>

                                <input
                                    type="url"
                                    className={
                                        inputClass
                                    }
                                    value={
                                        about.linkedin ||
                                        ""
                                    }
                                    onChange={(event) =>
                                        updatePortfolio(
                                            "about",
                                            "linkedin",
                                            event.target.value
                                        )
                                    }
                                    placeholder="https://linkedin.com/in/..."
                                />
                            </div>

                            <div className="md:col-span-2">

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    GitHub
                                </label>

                                <input
                                    type="url"
                                    className={
                                        inputClass
                                    }
                                    value={
                                        about.github ||
                                        ""
                                    }
                                    onChange={(event) =>
                                        updatePortfolio(
                                            "about",
                                            "github",
                                            event.target.value
                                        )
                                    }
                                    placeholder="https://github.com/..."
                                />

                            </div>

                        </div>

                    </section>

                    {/* ==================================================
                        SKILLS
                    ================================================== */}

                    <section>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">

                            <div className="flex items-center gap-3">

                                <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                                    <Code2 size={20} />
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">
                                        Skills
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        Highlight your strongest technical and professional skills.
                                    </p>
                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={
                                    addSkill
                                }
                                className="
                                    self-start
                                    sm:self-auto
                                    px-4
                                    py-2.5
                                    rounded-xl
                                    bg-purple-600
                                    hover:bg-purple-700
                                    text-white
                                    font-semibold
                                    text-sm
                                    flex
                                    items-center
                                    gap-2
                                    transition
                                "
                            >
                                <Plus size={17} />
                                Add Skill
                            </button>

                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">

                            {skills.map(
                                (
                                    skill,
                                    index
                                ) => (
                                    <div
                                        key={`skill-${index}`}
                                        className="flex items-center gap-2 p-2 rounded-xl bg-gray-50 border border-gray-200"
                                    >

                                        <input
                                            type="text"
                                            value={
                                                typeof skill ===
                                                    "string"
                                                    ? skill
                                                    : skill?.name ||
                                                    ""
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                updateSkill(
                                                    index,
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            className="
                                                flex-1
                                                min-w-0
                                                px-3
                                                py-2
                                                bg-white
                                                border
                                                border-gray-200
                                                rounded-lg
                                                outline-none
                                                focus:border-purple-500
                                            "
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeSkill(
                                                    index
                                                )
                                            }
                                            className="h-9 w-9 flex-shrink-0 rounded-lg text-red-500 hover:bg-red-50 flex items-center justify-center"
                                            aria-label="Remove skill"
                                        >
                                            <Trash2
                                                size={16}
                                            />
                                        </button>

                                    </div>
                                )
                            )}

                        </div>

                        {skills.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-gray-300 p-6 text-center text-gray-500">
                                No skills added yet.
                            </div>
                        )}

                    </section>



                    {/* ==================================================
                        PROJECTS
                    ================================================== */}

                    <section>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">

                            <div className="flex items-center gap-3">

                                <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                    <Briefcase size={20} />
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">
                                        Projects
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        Showcase projects that demonstrate your abilities.
                                    </p>
                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={
                                    addProject
                                }
                                className="
                                    self-start
                                    sm:self-auto
                                    px-4
                                    py-2.5
                                    rounded-xl
                                    bg-indigo-600
                                    hover:bg-indigo-700
                                    text-white
                                    font-semibold
                                    text-sm
                                    flex
                                    items-center
                                    gap-2
                                    transition
                                "
                            >
                                <Plus size={17} />
                                Add Project
                            </button>

                        </div>

                        <div className="space-y-5">

                            {projects.map(
                                (
                                    project,
                                    index
                                ) => (
                                    <div
                                        key={`project-${index}`}
                                        className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
                                    >

                                        <div className="flex items-center justify-between mb-4">

                                            <h4 className="font-bold text-gray-900">
                                                Project{" "}
                                                {index +
                                                    1}
                                            </h4>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeArrayItem(
                                                        "projects",
                                                        index
                                                    )
                                                }
                                                className="h-9 w-9 rounded-lg text-red-500 hover:bg-red-50 flex items-center justify-center"
                                                aria-label="Remove project"
                                            >
                                                <Trash2
                                                    size={
                                                        17
                                                    }
                                                />
                                            </button>

                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Project Name
                                                </label>

                                                <input
                                                    type="text"
                                                    className={
                                                        inputClass
                                                    }
                                                    value={
                                                        project?.name ||
                                                        project?.title ||
                                                        ""
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateArrayItem(
                                                            "projects",
                                                            index,
                                                            "name",
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    placeholder="Portfolio Website"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">GitHub URL</label>
                                                <input type="url" className={inputClass} value={project?.github || ""} onChange={(event) => updateArrayItem("projects", index, "github", event.target.value)} placeholder="https://github.com/..." />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Live Demo URL</label>
                                                <input type="url" className={inputClass} value={project?.liveDemo || project?.live || ""} onChange={(event) => updateArrayItem("projects", index, "liveDemo", event.target.value)} placeholder="https://your-demo.com" />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                                                <input type="month" className={inputClass} value={project?.startDate || ""} onChange={(event) => updateArrayItem("projects", index, "startDate", event.target.value)} />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                                                <input type="month" className={inputClass} value={project?.endDate || ""} onChange={(event) => updateArrayItem("projects", index, "endDate", event.target.value)} />
                                            </div>

                                            <div className="md:col-span-2">

                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Description
                                                </label>

                                                <textarea
                                                    rows="4"
                                                    className={
                                                        textareaClass
                                                    }
                                                    value={
                                                        project?.description ||
                                                        project?.summary ||
                                                        ""
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateArrayItem(
                                                            "projects",
                                                            index,
                                                            "description",
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    placeholder="Explain what you built, the technologies used and the result."
                                                />

                                            </div>

                                            <div className="md:col-span-2">

                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Technologies
                                                </label>

                                                <input
                                                    type="text"
                                                    className={
                                                        inputClass
                                                    }
                                                    value={getProjectTechnologies(
                                                        project
                                                    ).join(
                                                        ", "
                                                    )}
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateArrayItem(
                                                            "projects",
                                                            index,
                                                            "technologies",
                                                            event
                                                                .target
                                                                .value
                                                                .split(
                                                                    ","
                                                                )
                                                                .map(
                                                                    (
                                                                        item
                                                                    ) =>
                                                                        item.trim()
                                                                )
                                                                .filter(
                                                                    Boolean
                                                                )
                                                        )
                                                    }
                                                    placeholder="React, JavaScript, Tailwind CSS"
                                                />

                                                <p className="text-xs text-gray-400 mt-1">
                                                    Separate technologies with commas.
                                                </p>

                                            </div>

                                        </div>

                                    </div>
                                )
                            )}

                        </div>

                        {projects.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center">
                                <p className="text-gray-500">
                                    No projects added yet.
                                </p>

                                <button
                                    type="button"
                                    onClick={
                                        addProject
                                    }
                                    className="mt-3 text-indigo-600 font-semibold hover:text-indigo-700"
                                >
                                    + Add your first project
                                </button>
                            </div>
                        )}

                    </section>

                    {/* ==================================================
                        EDUCATION
                    ================================================== */}

                    <section>

                        <div className="flex items-center gap-3 mb-5">

                            <div className="h-10 w-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                                <GraduationCap
                                    size={20}
                                />
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    Education
                                </h3>

                                <p className="text-sm text-gray-500">
                                    Add your academic background.
                                </p>
                            </div>

                        </div>

                        <div className="grid md:grid-cols-2 gap-5">

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    College / University
                                </label>

                                <input
                                    type="text"
                                    className={
                                        inputClass
                                    }
                                    value={
                                        education.college ||
                                        ""
                                    }
                                    onChange={(event) =>
                                        updatePortfolio(
                                            "education",
                                            "college",
                                            event.target.value
                                        )
                                    }
                                    placeholder="University Name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Degree
                                </label>

                                <input
                                    type="text"
                                    className={
                                        inputClass
                                    }
                                    value={
                                        education.degree ||
                                        ""
                                    }
                                    onChange={(event) =>
                                        updatePortfolio(
                                            "education",
                                            "degree",
                                            event.target.value
                                        )
                                    }
                                    placeholder="B.E / B.Tech"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Branch / Specialization
                                </label>

                                <input
                                    type="text"
                                    className={
                                        inputClass
                                    }
                                    value={
                                        education.branch ||
                                        ""
                                    }
                                    onChange={(event) =>
                                        updatePortfolio(
                                            "education",
                                            "branch",
                                            event.target.value
                                        )
                                    }
                                    placeholder="Computer Science"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    CGPA / Percentage
                                </label>

                                <input
                                    type="text"
                                    className={
                                        inputClass
                                    }
                                    value={
                                        education.cgpa ||
                                        ""
                                    }
                                    onChange={(event) =>
                                        updatePortfolio(
                                            "education",
                                            "cgpa",
                                            event.target.value
                                        )
                                    }
                                    placeholder="8.37"
                                />
                            </div>

                        </div>

                        <div className="grid md:grid-cols-2 gap-5 mt-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Start Year</label>
                                <input type="text" className={inputClass} value={education.startYear || ""} onChange={(event) => updatePortfolio("education", "startYear", event.target.value)} placeholder="2021" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">End Year</label>
                                <input type="text" className={inputClass} value={education.endYear || ""} onChange={(event) => updatePortfolio("education", "endYear", event.target.value)} placeholder="2025" />
                            </div>
                        </div>

                    </section>

                    {/* ==================================================
                        EXPERIENCE
                    ================================================== */}

                    <section>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">

                            <div className="flex items-center gap-3">

                                <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                                    <Briefcase size={20} />
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">
                                        Experience
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        Add internships, jobs and professional experience.
                                    </p>
                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={
                                    addExperience
                                }
                                className="
                                    self-start
                                    sm:self-auto
                                    px-4
                                    py-2.5
                                    rounded-xl
                                    bg-orange-600
                                    hover:bg-orange-700
                                    text-white
                                    font-semibold
                                    text-sm
                                    flex
                                    items-center
                                    gap-2
                                    transition
                                "
                            >
                                <Plus size={17} />
                                Add Experience
                            </button>

                        </div>

                        <div className="space-y-5">

                            {experience.map(
                                (
                                    item,
                                    index
                                ) => (
                                    <div
                                        key={`experience-${index}`}
                                        className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
                                    >

                                        <div className="flex items-center justify-between mb-4">

                                            <h4 className="font-bold text-gray-900">
                                                Experience{" "}
                                                {index +
                                                    1}
                                            </h4>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeArrayItem(
                                                        "experience",
                                                        index
                                                    )
                                                }
                                                className="h-9 w-9 rounded-lg text-red-500 hover:bg-red-50 flex items-center justify-center"
                                                aria-label="Remove experience"
                                            >
                                                <Trash2
                                                    size={
                                                        17
                                                    }
                                                />
                                            </button>

                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Company
                                                </label>

                                                <input
                                                    type="text"
                                                    className={
                                                        inputClass
                                                    }
                                                    value={
                                                        item?.company ||
                                                        ""
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateArrayItem(
                                                            "experience",
                                                            index,
                                                            "company",
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    placeholder="Company Name"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Role
                                                </label>

                                                <input
                                                    type="text"
                                                    className={
                                                        inputClass
                                                    }
                                                    value={
                                                        item?.role ||
                                                        item?.title ||
                                                        ""
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateArrayItem(
                                                            "experience",
                                                            index,
                                                            "role",
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    placeholder="Frontend Developer Intern"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Duration
                                                </label>

                                                <input
                                                    type="text"
                                                    className={
                                                        inputClass
                                                    }
                                                    value={
                                                        item?.duration ||
                                                        ""
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateArrayItem(
                                                            "experience",
                                                            index,
                                                            "duration",
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    placeholder="Jun 2025 - Sep 2025"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                                                <input type="month" className={inputClass} value={item?.startDate || ""} onChange={(event) => updateArrayItem("experience", index, "startDate", event.target.value)} />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                                                <input type="month" className={inputClass} value={item?.endDate || ""} disabled={Boolean(item?.currentlyWorking)} onChange={(event) => updateArrayItem("experience", index, "endDate", event.target.value)} />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700">
                                                    <input type="checkbox" checked={Boolean(item?.currentlyWorking)} onChange={(event) => updateArrayItem("experience", index, "currentlyWorking", event.target.checked)} />
                                                    Currently working here
                                                </label>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Location
                                                </label>

                                                <input
                                                    type="text"
                                                    className={
                                                        inputClass
                                                    }
                                                    value={
                                                        item?.location ||
                                                        ""
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateArrayItem(
                                                            "experience",
                                                            index,
                                                            "location",
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    placeholder="Remote / Chennai"
                                                />
                                            </div>

                                            <div className="md:col-span-2">

                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Description
                                                </label>

                                                <textarea
                                                    rows="4"
                                                    className={
                                                        textareaClass
                                                    }
                                                    value={
                                                        item?.description ||
                                                        ""
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateArrayItem(
                                                            "experience",
                                                            index,
                                                            "description",
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    placeholder="Describe your responsibilities and achievements."
                                                />

                                            </div>

                                        </div>

                                    </div>
                                )
                            )}

                        </div>

                        {experience.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center">

                                <p className="text-gray-500">
                                    No experience added yet.
                                </p>

                                <button
                                    type="button"
                                    onClick={
                                        addExperience
                                    }
                                    className="mt-3 text-orange-600 font-semibold hover:text-orange-700"
                                >
                                    + Add your first experience
                                </button>

                            </div>
                        )}

                    </section>

                    {/* ==================================================
    CERTIFICATIONS
================================================== */}

                    <section>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">

                            <div className="flex items-center gap-3">

                                <div className="h-10 w-10 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center">
                                    <Award size={20} />
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">
                                        Certifications
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        Showcase your professional certifications.
                                    </p>
                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={addCertification}
                                className="
                self-start
                sm:self-auto
                px-4
                py-2.5
                rounded-xl
                bg-yellow-500
                hover:bg-yellow-600
                text-white
                font-semibold
                text-sm
                flex
                items-center
                gap-2
                transition
            "
                            >
                                <Plus size={17} />
                                Add Certification
                            </button>

                        </div>

                        <div className="space-y-5">

                            {certifications.map(
                                (certification, index) => (
                                    <div
                                        key={`certification-${index}`}
                                        className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
                                    >

                                        <div className="flex items-center justify-between mb-4">

                                            <h4 className="font-bold text-gray-900">
                                                Certification {index + 1}
                                            </h4>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeArrayItem(
                                                        "certifications",
                                                        index
                                                    )
                                                }
                                                className="h-9 w-9 rounded-lg text-red-500 hover:bg-red-50 flex items-center justify-center"
                                                aria-label="Remove certification"
                                            >
                                                <Trash2 size={17} />
                                            </button>

                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Certification Name
                                                </label>

                                                <input
                                                    type="text"
                                                    className={inputClass}
                                                    value={
                                                        certification?.name || ""
                                                    }
                                                    onChange={(event) =>
                                                        updateArrayItem(
                                                            "certifications",
                                                            index,
                                                            "name",
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="Java Full Stack Certification"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Issuing Organization
                                                </label>

                                                <input
                                                    type="text"
                                                    className={inputClass}
                                                    value={
                                                        certification?.issuer || ""
                                                    }
                                                    onChange={(event) =>
                                                        updateArrayItem(
                                                            "certifications",
                                                            index,
                                                            "issuer",
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="9Globes Technologies"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Date
                                                </label>

                                                <input
                                                    type="text"
                                                    className={inputClass}
                                                    value={certification?.issueDate || certification?.date || ""}
                                                    onChange={(event) => {
                                                        updateArrayItem("certifications", index, "issueDate", event.target.value);
                                                        updateArrayItem("certifications", index, "date", event.target.value);
                                                    }}
                                                    placeholder="2025"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Certificate URL
                                                </label>

                                                <input
                                                    type="url"
                                                    className={inputClass}
                                                    value={
                                                        certification?.url || ""
                                                    }
                                                    onChange={(event) =>
                                                        updateArrayItem(
                                                            "certifications",
                                                            index,
                                                            "url",
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="https://..."
                                                />
                                            </div>

                                        </div>

                                    </div>
                                )
                            )}

                        </div>

                        {certifications.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center">
                                <p className="text-gray-500">
                                    No certifications added yet.
                                </p>

                                <button
                                    type="button"
                                    onClick={addCertification}
                                    className="mt-3 text-yellow-600 font-semibold hover:text-yellow-700"
                                >
                                    + Add your first certification
                                </button>
                            </div>
                        )}

                    </section>
                    {/* ==================================================
    ACHIEVEMENTS
================================================== */}

                    <section>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">

                            <div className="flex items-center gap-3">

                                <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                    <Trophy size={20} />
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">
                                        Achievements
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        Highlight awards and important accomplishments.
                                    </p>
                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={addAchievement}
                                className="
                self-start
                sm:self-auto
                px-4
                py-2.5
                rounded-xl
                bg-amber-500
                hover:bg-amber-600
                text-white
                font-semibold
                text-sm
                flex
                items-center
                gap-2
                transition
            "
                            >
                                <Plus size={17} />
                                Add Achievement
                            </button>

                        </div>

                        <div className="space-y-5">

                            {achievements.map(
                                (achievement, index) => (
                                    <div
                                        key={`achievement-${index}`}
                                        className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
                                    >

                                        <div className="flex items-center justify-between mb-4">

                                            <h4 className="font-bold text-gray-900">
                                                Achievement {index + 1}
                                            </h4>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeArrayItem(
                                                        "achievements",
                                                        index
                                                    )
                                                }
                                                className="h-9 w-9 rounded-lg text-red-500 hover:bg-red-50 flex items-center justify-center"
                                                aria-label="Remove achievement"
                                            >
                                                <Trash2 size={17} />
                                            </button>

                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Achievement Title
                                                </label>

                                                <input
                                                    type="text"
                                                    className={inputClass}
                                                    value={
                                                        achievement?.title || ""
                                                    }
                                                    onChange={(event) =>
                                                        updateArrayItem(
                                                            "achievements",
                                                            index,
                                                            "title",
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="Hackathon Winner"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Date
                                                </label>

                                                <input
                                                    type="text"
                                                    className={inputClass}
                                                    value={
                                                        achievement?.date || ""
                                                    }
                                                    onChange={(event) =>
                                                        updateArrayItem(
                                                            "achievements",
                                                            index,
                                                            "date",
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="2025"
                                                />
                                            </div>

                                            <div className="md:col-span-2">

                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Description
                                                </label>

                                                <textarea
                                                    rows="4"
                                                    className={textareaClass}
                                                    value={
                                                        achievement?.description || ""
                                                    }
                                                    onChange={(event) =>
                                                        updateArrayItem(
                                                            "achievements",
                                                            index,
                                                            "description",
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="Describe your achievement..."
                                                />

                                            </div>

                                        </div>

                                    </div>
                                )
                            )}

                        </div>

                        {achievements.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center">
                                <p className="text-gray-500">
                                    No achievements added yet.
                                </p>

                                <button
                                    type="button"
                                    onClick={addAchievement}
                                    className="mt-3 text-amber-600 font-semibold hover:text-amber-700"
                                >
                                    + Add your first achievement
                                </button>
                            </div>
                        )}

                    </section>
                    {/* ==================================================
    LANGUAGES
================================================== */}

                    <section>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">

                            <div className="flex items-center gap-3">

                                <div className="h-10 w-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                                    <Languages size={20} />
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">
                                        Languages
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        Add languages you can communicate in.
                                    </p>
                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={addLanguage}
                                className="
                self-start
                sm:self-auto
                px-4
                py-2.5
                rounded-xl
                bg-cyan-600
                hover:bg-cyan-700
                text-white
                font-semibold
                text-sm
                flex
                items-center
                gap-2
                transition
            "
                            >
                                <Plus size={17} />
                                Add Language
                            </button>

                        </div>

                        <div className="grid md:grid-cols-2 gap-4">

                            {languages.map(
                                (language, index) => (
                                    <div
                                        key={`language-${index}`}
                                        className="rounded-2xl border border-gray-200 bg-gray-50 p-4"
                                    >

                                        <div className="flex items-center gap-3">

                                            <div className="flex-1">

                                                <input
                                                    type="text"
                                                    className={inputClass}
                                                    value={
                                                        language?.name || ""
                                                    }
                                                    onChange={(event) =>
                                                        updateArrayItem(
                                                            "languages",
                                                            index,
                                                            "name",
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="English"
                                                />

                                            </div>

                                            <div className="flex-1">

                                                <select
                                                    className={inputClass}
                                                    value={
                                                        language?.proficiency ||
                                                        "Professional"
                                                    }
                                                    onChange={(event) =>
                                                        updateArrayItem(
                                                            "languages",
                                                            index,
                                                            "proficiency",
                                                            event.target.value
                                                        )
                                                    }
                                                >
                                                    <option>Native</option>
                                                    <option>Fluent</option>
                                                    <option>Professional</option>
                                                    <option>Intermediate</option>
                                                    <option>Basic</option>
                                                </select>

                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeArrayItem(
                                                        "languages",
                                                        index
                                                    )
                                                }
                                                className="h-10 w-10 flex-shrink-0 rounded-lg text-red-500 hover:bg-red-50 flex items-center justify-center"
                                                aria-label="Remove language"
                                            >
                                                <Trash2 size={17} />
                                            </button>

                                        </div>

                                    </div>
                                )
                            )}

                        </div>

                        {languages.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center">
                                <p className="text-gray-500">
                                    No languages added yet.
                                </p>

                                <button
                                    type="button"
                                    onClick={addLanguage}
                                    className="mt-3 text-cyan-600 font-semibold hover:text-cyan-700"
                                >
                                    + Add your first language
                                </button>
                            </div>
                        )}

                    </section>

                    {/* ==================================================
                        BOTTOM ACTIONS
                    ================================================== */}

                    <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row justify-end gap-3">

                        <button
                            type="button"
                            onClick={
                                handleCancel
                            }
                            className="
                                px-6
                                py-3
                                rounded-xl
                                border
                                border-gray-200
                                text-gray-700
                                font-semibold
                                hover:bg-gray-50
                                transition
                                flex
                                items-center
                                justify-center
                                gap-2
                            "
                        >
                            <X size={18} />
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={
                                handleSave
                            }
                            disabled={saving}
                            className="
                                px-7
                                py-3
                                rounded-xl
                                bg-blue-600
                                hover:bg-blue-700
                                text-white
                                font-semibold
                                transition
                                flex
                                items-center
                                justify-center
                                gap-2
                                disabled:opacity-60
                            "
                        >
                            <Save size={18} />

                            {saving
                                ? "Saving..."
                                : "Save Portfolio"}
                        </button>

                    </div>

                </div>

            </div>
        );
    }

    // ======================================================
    // PREVIEW MODE
    // ======================================================

    return (
        <div className="space-y-6">

            {/* ==================================================
                PREVIEW TOOLBAR
            ================================================== */}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">

                <div className="flex items-center gap-3">

                    <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Eye size={19} />
                    </div>

                    <div>
                        <p className="font-bold text-gray-900">
                            Portfolio Preview
                        </p>

                        <p className="text-xs text-gray-500">
                            This is how your professional portfolio currently looks.
                        </p>
                    </div>

                </div>

                <div className="flex flex-wrap gap-2">
                    {Object.entries(THEMES).map(([id, item]) => (
                        <button key={id} type="button" onClick={() => setPresentation("theme", id)} className={`px-3 py-2 rounded-lg text-xs font-semibold border ${theme === id ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600"}`}>
                            {item.label}
                        </button>
                    ))}
                    <button type="button" onClick={() => setPresentation("appearance", isDark ? "light" : "dark")} className="px-3 py-2 rounded-lg border border-gray-200 text-gray-700 text-xs font-semibold flex items-center gap-2">
                        {isDark ? <Sun size={15} /> : <Moon size={15} />}
                        {isDark ? "Light" : "Dark"}
                    </button>
                    {[["desktop", Monitor], ["tablet", Tablet], ["mobile", Smartphone]].map(([id, Icon]) => (
                        <button key={id} type="button" onClick={() => setPresentation("previewDevice", id)} className={`p-2 rounded-lg border ${previewDevice === id ? "border-blue-500 bg-blue-50 text-blue-600" : "border-gray-200 text-gray-500"}`} title={`${id} preview`}>
                            <Icon size={16} />
                        </button>
                    ))}
                    <button type="button" onClick={downloadPdf} className="px-3 py-2 rounded-lg bg-gray-900 text-white text-xs font-semibold flex items-center gap-2">
                        <Download size={15} /> PDF
                    </button>
                    <button type="button" onClick={() => { setSavedMessage(""); setIsEditing(true); }} className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2">
                        <Edit3 size={17} /> Edit Portfolio
                    </button>
                </div>

            </div>

            {savedMessage && (
                <div className="rounded-xl bg-green-50 border border-green-100 text-green-700 px-4 py-3 text-sm font-medium">
                    {savedMessage}
                </div>
            )}
            {careerObjective && (
                <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">

                    <div className="flex items-center gap-3 mb-4">

                        <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Target size={21} />
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Career Objective
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Professional goals and career direction
                            </p>
                        </div>

                    </div>

                    <p className="text-gray-600 leading-8 text-base sm:text-lg">
                        {careerObjective}
                    </p>

                </section>
            )}

            {/* ==================================================
                HERO
            ================================================== */}

            <div className={`${previewDevice === "mobile" ? "max-w-[390px]" : previewDevice === "tablet" ? "max-w-3xl" : "max-w-7xl"} mx-auto transition-all duration-300 ${isDark ? "bg-slate-950 text-slate-100" : "bg-slate-100"}`} ref={portfolioRef}>
            <section className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${selectedTheme.hero} text-white p-8 sm:p-10 lg:p-12 shadow-xl`}>

                <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

                <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

                <div className="relative max-w-4xl">

                    <div className="flex items-center gap-5 mb-5">
                        {currentPortfolio.avatar ? (
                            <img src={currentPortfolio.avatar} alt={hero.name || "Profile"} className="h-24 w-24 rounded-full object-cover border-4 border-white/30 shadow-xl" />
                        ) : null}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-blue-100 text-sm font-semibold mb-5">
                        <Sparkles size={15} />
                        Professional Portfolio
                        </div>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">
                        {hero.name ||
                            "Your Name"}
                    </h1>

                    <p className="text-xl sm:text-2xl text-blue-200 font-semibold mt-3">
                        {hero.role ||
                            "Professional"}
                    </p>

                    {hero.summary && (
                        <p className="text-base sm:text-lg text-slate-300 leading-relaxed mt-6 max-w-3xl">
                            {hero.summary}
                        </p>
                    )}

                    <div className="flex flex-wrap gap-3 mt-7">

                        {about.email && (
                            <a
                                href={`mailto:${about.email}`}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition text-sm"
                            >
                                <Mail
                                    size={16}
                                />
                                Email
                            </a>
                        )}

                        {about.linkedin && (
                            <a
                                href={
                                    about.linkedin
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition text-sm"
                            >
                                LinkedIn
                                <ExternalLink
                                    size={
                                        15
                                    }
                                />
                            </a>
                        )}

                        {about.github && (
                            <a
                                href={
                                    about.github
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition text-sm"
                            >
                                GitHub
                                <ExternalLink
                                    size={
                                        15
                                    }
                                />
                            </a>
                        )}

                    </div>

                </div>

            </section>

            {/* ==================================================
                CONTACT
            ================================================== */}

            {(about.email ||
                about.phone ||
                about.location) && (
                    <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">

                        <h2 className="text-xl font-bold text-gray-900 mb-5">
                            Contact Information
                        </h2>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

                            {about.email && (
                                <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
                                    <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                                        <Mail
                                            size={18}
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-xs text-gray-500">
                                            Email
                                        </p>

                                        <p className="font-semibold text-gray-900 truncate">
                                            {
                                                about.email
                                            }
                                        </p>
                                    </div>
                                </div>
                            )}

                            {about.phone && (
                                <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
                                    <div className="h-10 w-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                                        <Phone
                                            size={18}
                                        />
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Phone
                                        </p>

                                        <p className="font-semibold text-gray-900">
                                            {
                                                about.phone
                                            }
                                        </p>
                                    </div>
                                </div>
                            )}

                            {about.location && (
                                <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
                                    <div className="h-10 w-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                                        <MapPin
                                            size={18}
                                        />
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Location
                                        </p>

                                        <p className="font-semibold text-gray-900">
                                            {
                                                about.location
                                            }
                                        </p>
                                    </div>
                                </div>
                            )}

                        </div>

                    </section>
                )}

            {/* ==================================================
                ABOUT
            ================================================== */}

            {hero.summary && (
                <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">

                    <div className="flex items-center gap-3 mb-4">

                        <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <User size={20} />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900">
                            About Me
                        </h2>

                    </div>

                    <p className="text-gray-600 leading-8 text-base sm:text-lg">
                        {hero.summary}
                    </p>

                </section>
            )}
            {careerObjective && (
                <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">

                    <div className="flex items-center gap-3 mb-4">

                        <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Target size={21} />
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Career Objective
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Professional goals and career direction
                            </p>
                        </div>

                    </div>

                    <p className="text-gray-600 leading-8 text-base sm:text-lg">
                        {careerObjective}
                    </p>

                </section>
            )}

            {/* ==================================================
                SKILLS
            ================================================== */}

            <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">

                <div className="flex items-center gap-3 mb-6">

                    <div className="h-11 w-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                        <Code2 size={21} />
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Skills
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Technologies and capabilities
                        </p>
                    </div>

                </div>

                {skills.length > 0 ? (
                    <div className="flex flex-wrap gap-3">

                        {skills.map(
                            (
                                skill,
                                index
                            ) => (
                                <span
                                    key={`preview-skill-${index}`}
                                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 text-blue-700 font-semibold text-sm"
                                >
                                    {typeof skill ===
                                        "string"
                                        ? skill
                                        : skill?.name ||
                                        "Skill"}
                                </span>
                            )
                        )}

                    </div>
                ) : (
                    <p className="text-gray-400">
                        No skills added yet.
                    </p>
                )}

            </section>

            {/* ==================================================
                PROJECTS
            ================================================== */}

            <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">

                <div className="flex items-center gap-3 mb-6">

                    <div className="h-11 w-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <Briefcase size={21} />
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Projects
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Selected work and achievements
                        </p>
                    </div>

                </div>

                {projects.length > 0 ? (
                    <div className="grid lg:grid-cols-2 gap-5">

                        {projects.map(
                            (
                                project,
                                index
                            ) => (
                                <article
                                    key={`preview-project-${index}`}
                                    className="group rounded-2xl border border-gray-100 bg-gray-50 p-6 hover:bg-white hover:shadow-lg transition"
                                >

                                    <div className="flex items-start justify-between gap-4">

                                        <div>
                                            <p className="text-xs uppercase tracking-wider text-indigo-600 font-bold">
                                                Project{" "}
                                                {index +
                                                    1}
                                            </p>

                                            <h3 className="text-xl font-bold text-gray-900 mt-1">
                                                {
                                                    getProjectName(
                                                        project
                                                    )
                                                }
                                            </h3>
                                            {(project?.startDate || project?.endDate) && (
                                                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1"><CalendarDays size={13} /> {project.startDate || "Start"} - {project.endDate || "Present"}</p>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            {(project?.github || project?.projectGithub) && (
                                                <a href={project.github || project.projectGithub} target="_blank" rel="noreferrer" className="h-9 w-9 rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-blue-600 flex items-center justify-center transition" aria-label="Open GitHub">
                                                    <span className="font-bold text-sm">GH</span>
                                                </a>
                                            )}
                                            {(project?.liveDemo || project?.live || project?.projectLive) && (
                                                <a href={project.liveDemo || project.live || project.projectLive} target="_blank" rel="noreferrer" className="h-9 w-9 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition" aria-label="Open live demo">
                                                    <Globe size={16} />
                                                </a>
                                            )}
                                        </div>

                                    </div>

                                    <p className="text-gray-600 leading-7 mt-4">
                                        {getProjectDescription(
                                            project
                                        )}
                                    </p>

                                    {getProjectTechnologies(
                                        project
                                    ).length >
                                        0 && (
                                            <div className="flex flex-wrap gap-2 mt-5">

                                                {getProjectTechnologies(
                                                    project
                                                ).map(
                                                    (
                                                        technology,
                                                        technologyIndex
                                                    ) => (
                                                        <span
                                                            key={`${index}-${technologyIndex}`}
                                                            className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-700 text-xs font-semibold"
                                                        >
                                                            {
                                                                technology
                                                            }
                                                        </span>
                                                    )
                                                )}

                                            </div>
                                        )}

                                </article>
                            )
                        )}

                    </div>
                ) : (
                    <p className="text-gray-400">
                        No projects added yet.
                    </p>
                )}

            </section>

            {/* ==================================================
                EDUCATION
            ================================================== */}

            <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">

                <div className="flex items-center gap-3 mb-6">

                    <div className="h-11 w-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                        <GraduationCap
                            size={21}
                        />
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Education
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Academic background
                        </p>
                    </div>

                </div>

                <div className="grid sm:grid-cols-2 gap-4">

                    <div className="rounded-2xl bg-gray-50 p-5">
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                            College
                        </p>

                        <p className="font-bold text-gray-900 mt-2">
                            {education.college ||
                                "Not provided"}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-gray-50 p-5">
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                            Degree
                        </p>

                        <p className="font-bold text-gray-900 mt-2">
                            {education.degree ||
                                "Not provided"}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-gray-50 p-5">
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                            Branch
                        </p>

                        <p className="font-bold text-gray-900 mt-2">
                            {education.branch ||
                                "Not provided"}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-gray-50 p-5">
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                            CGPA
                        </p>

                        <p className="font-bold text-gray-900 mt-2">
                            {education.cgpa ||
                                "Not provided"}
                        </p>
                    </div>

                    {(education.startYear || education.endYear) && (
                        <p className="mt-4 text-sm text-gray-500 flex items-center gap-2">
                            <CalendarDays size={15} />
                            {education.startYear || "Start"} - {education.endYear || "Present"}
                        </p>
                    )}

                </div>

            </section>
            {certifications.length > 0 && (
                <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">

                    <div className="flex items-center gap-3 mb-6">

                        <div className="h-11 w-11 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center">
                            <Award size={21} />
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Certifications
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Professional certifications
                            </p>
                        </div>

                    </div>

                    <div className="grid md:grid-cols-2 gap-5">

                        {certifications.map(
                            (certification, index) => (
                                <article
                                    key={`preview-certification-${index}`}
                                    className="rounded-2xl bg-gray-50 border border-gray-100 p-5"
                                >

                                    <h3 className="text-lg font-bold text-gray-900">
                                        {certification?.name ||
                                            "Certification"}
                                    </h3>

                                    {certification?.issuer && (
                                        <p className="text-yellow-600 font-semibold mt-2">
                                            {certification.issuer}
                                        </p>
                                    )}

                                    {(certification?.date || certification?.issueDate) && (
                                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                            <CalendarDays size={14} />
                                            {certification.issueDate || certification.date}
                                        </p>
                                    )}

                                    {certification?.url && (
                                        <a
                                            href={certification.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 mt-4 text-blue-600 font-semibold text-sm hover:text-blue-700"
                                        >
                                            View Certificate
                                            <ExternalLink size={15} />
                                        </a>
                                    )}

                                </article>
                            )
                        )}

                    </div>

                </section>
            )}

            {/* ==================================================
                EXPERIENCE
            ================================================== */}

            <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">

                <div className="flex items-center gap-3 mb-6">

                    <div className="h-11 w-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                        <Briefcase size={21} />
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Experience
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Professional journey
                        </p>
                    </div>

                </div>

                {experience.length > 0 ? (
                    <div className="space-y-5">

                        {experience.map(
                            (
                                item,
                                index
                            ) => (
                                <article
                                    key={`preview-experience-${index}`}
                                    className="relative pl-7 border-l-2 border-blue-100"
                                >

                                    <div className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-blue-600 ring-4 ring-blue-50" />

                                    <div className="rounded-2xl bg-gray-50 p-5">

                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">

                                            <div>

                                                <h3 className="text-lg font-bold text-gray-900">
                                                    {item?.role ||
                                                        item?.title ||
                                                        "Professional Role"}
                                                </h3>

                                                <p className="text-blue-600 font-semibold mt-1">
                                                    {item?.company ||
                                                        "Company"}
                                                </p>

                                            </div>

                                            {item?.duration && (
                                                <span className="text-sm font-semibold text-gray-500">
                                                    {item.duration || `${item.startDate || "Start"} - ${item.currentlyWorking ? "Present" : item.endDate || "Present"}`}
                                                </span>
                                            )}

                                        </div>

                                        {item?.location && (
                                            <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                                                <MapPin
                                                    size={
                                                        14
                                                    }
                                                />
                                                {
                                                    item.location
                                                }
                                            </p>
                                        )}

                                        {item?.description && (
                                            <p className="text-gray-600 leading-7 mt-4">
                                                {
                                                    item.description
                                                }
                                            </p>
                                        )}

                                    </div>

                                </article>
                            )
                        )}

                    </div>
                ) : (
                    <p className="text-gray-400">
                        No experience added yet.
                    </p>
                )}

            </section>
            {achievements.length > 0 && (
                <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">

                    <div className="flex items-center gap-3 mb-6">

                        <div className="h-11 w-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <Trophy size={21} />
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Achievements
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Awards and accomplishments
                            </p>
                        </div>

                    </div>

                    <div className="space-y-4">

                        {achievements.map(
                            (achievement, index) => (
                                <article
                                    key={`preview-achievement-${index}`}
                                    className="rounded-2xl bg-gray-50 border border-gray-100 p-5"
                                >

                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">

                                        <h3 className="text-lg font-bold text-gray-900">
                                            {achievement?.title ||
                                                "Achievement"}
                                        </h3>

                                        {achievement?.date && (
                                            <span className="text-sm font-semibold text-gray-500">
                                                {achievement.date}
                                            </span>
                                        )}

                                    </div>

                                    {achievement?.description && (
                                        <p className="text-gray-600 leading-7 mt-3">
                                            {achievement.description}
                                        </p>
                                    )}

                                </article>
                            )
                        )}

                    </div>

                </section>
            )}{languages.length > 0 && (
                <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">

                    <div className="flex items-center gap-3 mb-6">

                        <div className="h-11 w-11 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                            <Languages size={21} />
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Languages
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Communication skills
                            </p>
                        </div>

                    </div>

                    <div className="flex flex-wrap gap-3">

                        {languages.map(
                            (language, index) => (
                                <div
                                    key={`preview-language-${index}`}
                                    className="px-4 py-3 rounded-xl bg-cyan-50 border border-cyan-100"
                                >

                                    <p className="font-bold text-cyan-800">
                                        {language?.name ||
                                            "Language"}
                                    </p>

                                    {language?.proficiency && (
                                        <p className="text-xs text-cyan-600 mt-1">
                                            {language.proficiency}
                                        </p>
                                    )}

                                </div>
                            )
                        )}

                    </div>

                </section>
            )}

            {/* ==================================================
                FINAL CTA
            ================================================== */}

            <section className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-7 sm:p-8 shadow-lg">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">

                    <div>

                        <h2 className="text-xl sm:text-2xl font-bold">
                            Keep your portfolio up to date
                        </h2>

                        <p className="text-blue-100 mt-1">
                            Update your skills, projects and experience whenever you grow.
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setSavedMessage("");
                            setIsEditing(true);
                        }}
                        className="
                            flex-shrink-0
                            px-5
                            py-3
                            rounded-xl
                            bg-white
                            text-blue-700
                            hover:bg-blue-50
                            font-bold
                            transition
                            flex
                            items-center
                            justify-center
                            gap-2
                        "
                    >
                        <Edit3 size={17} />
                        Edit Portfolio
                    </button>

                </div>

            </section>
            </div>

        </div>
    );
}

export default PortfolioPreview;