import { useNavigate } from "react-router-dom";

const exploreSections = [
    {
        id: "careers",
        icon: "🎯",
        title: "Careers",
        description:
            "Discover career options, required skills, career paths, salaries and roadmaps.",
        items: [
            "Career Paths",
            "Career Details",
            "Career Roadmaps",
            "Required Skills",
            "Career Finder",
        ],
        route: "/careers",
        button: "Explore Careers",
    },

    {
        id: "education",
        icon: "🎓",
        title: "Education",
        description:
            "Find the right education path from school to higher studies.",
        items: [
            "After 10th",
            "Intermediate",
            "Polytechnic",
            "ITI",
            "Degree & Engineering",
            "Higher Studies",
        ],
        route: "/education",
        button: "Explore Education",
    },

    {
        id: "colleges",
        icon: "🏫",
        title: "Colleges",
        description:
            "Discover colleges, compare them and find the right options for your career.",
        items: [
            "Explore Colleges",
            "College Details",
            "Compare Colleges",
            "College Predictor",
            "Admissions",
        ],
        route: "/colleges",
        button: "Explore Colleges",
    },

    {
        id: "exams",
        icon: "📝",
        title: "Exams",
        description:
            "Find entrance exams, competitive exams and preparation opportunities.",
        items: [
            "Entrance Exams",
            "Government Exams",
            "Engineering Exams",
            "Medical Exams",
            "Exam Preparation",
        ],
        route: "/exams",
        button: "Explore Exams",
    },

    {
        id: "jobs",
        icon: "💼",
        title: "Jobs",
        description:
            "Explore companies, job opportunities and tools to prepare for employment.",
        items: [
            "Companies",
            "Job Opportunities",
            "Job Matching",
            "Resume",
            "Interview Preparation",
        ],
        route: "/companies",
        button: "Explore Jobs",
    },

    {
        id: "ai",
        icon: "🤖",
        title: "AI Tools",
        description:
            "Use CareerOS AI-powered tools to improve your career preparation.",
        items: [
            "AI Recommendations",
            "Resume Builder",
            "Portfolio Builder",
            "Resume Analyzer",
            "Interview Preparation",
            "AI Career Assistant",
        ],
        route: "/ai-recommendation",
        button: "Explore AI Tools",
    },
];

function Explore() {

    const navigate = useNavigate();

    return (
        <section className="min-h-screen bg-slate-100 py-16">

            <div className="max-w-7xl mx-auto px-6">

                {/* Hero */}

                <div className="text-center max-w-4xl mx-auto">

                    <p className="text-blue-600 font-bold tracking-wider uppercase">
                        CareerOS Explore
                    </p>

                    <h1 className="text-5xl md:text-6xl font-bold mt-4 text-slate-900">
                        Explore Your Future
                    </h1>

                    <p className="text-lg text-gray-500 mt-6 leading-relaxed">
                        Discover careers, education paths, colleges, exams,
                        jobs and AI-powered tools — all in one place.
                    </p>

                </div>

                {/* Search-style CTA */}

                <div className="max-w-3xl mx-auto mt-10">

                    <button
                        type="button"
                        onClick={() => navigate("/search")}
                        className="w-full bg-white border border-gray-200 shadow-md rounded-2xl px-6 py-5 text-left hover:shadow-lg transition"
                    >

                        <div className="flex items-center gap-4">

                            <span className="text-2xl">
                                🔍
                            </span>

                            <div>

                                <p className="font-semibold text-slate-800">
                                    Search CareerOS
                                </p>

                                <p className="text-sm text-gray-500">
                                    Search careers, colleges, exams and more
                                </p>

                            </div>

                        </div>

                    </button>

                </div>

                {/* Explore Sections */}

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mt-14">

                    {exploreSections.map((section) => (

                        <div
                            key={section.id}
                            className="bg-white rounded-3xl shadow-lg p-8 hover:-translate-y-1 hover:shadow-xl transition duration-300"
                        >

                            <div className="flex items-start justify-between">

                                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-3xl">
                                    {section.icon}
                                </div>

                            </div>

                            <h2 className="text-2xl font-bold mt-6">
                                {section.title}
                            </h2>

                            <p className="text-gray-500 mt-3 leading-relaxed">
                                {section.description}
                            </p>

                            <div className="mt-6 space-y-2">

                                {section.items.map((item) => (

                                    <div
                                        key={item}
                                        className="flex items-center gap-2 text-sm text-gray-600"
                                    >

                                        <span className="text-blue-600">
                                            ✓
                                        </span>

                                        {item}

                                    </div>

                                ))}

                            </div>

                            <button
                                type="button"
                                onClick={() => navigate(section.route)}
                                className="w-full mt-7 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
                            >
                                {section.button} →
                            </button>

                        </div>

                    ))}

                </div>

                {/* Bottom CTA */}

                <div className="mt-14 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-10 text-white text-center">

                    <h2 className="text-3xl font-bold">
                        Not sure what to choose?
                    </h2>

                    <p className="mt-3 text-blue-100">
                        Take the Career Assessment and discover paths
                        that match your interests and goals.
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/career-assessment")}
                        className="mt-6 bg-white text-blue-700 px-7 py-3 rounded-xl font-bold hover:bg-blue-50 transition"
                    >
                        Take Career Finder →
                    </button>

                </div>

            </div>

        </section>
    );
}

export default Explore;