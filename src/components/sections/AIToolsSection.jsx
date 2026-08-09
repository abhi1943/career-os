import {
    Brain,
    FileText,
    MessageCircle,
    ClipboardCheck,
    GraduationCap,
    Briefcase,
    ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const aiTools = [
    {
        title: "AI Career Recommendation",
        description:
            "Get personalized career suggestions based on your interests, education and goals.",
        icon: Brain,
        color: "bg-blue-100 text-blue-600",
        link: "/ai-recommendation",
    },
    {
        title: "AI Career Mentor",
        description:
            "Ask questions about careers, skills, education and job preparation.",
        icon: MessageCircle,
        color: "bg-purple-100 text-purple-600",
        link: "/chatbot",
    },
    {
        title: "Career Assessment",
        description:
            "Discover career paths that match your interests and strengths.",
        icon: ClipboardCheck,
        color: "bg-green-100 text-green-600",
        link: "/career-assessment",
    },
    {
        title: "AI Resume Builder",
        description:
            "Build an ATS-friendly resume and improve it for your target role.",
        icon: FileText,
        color: "bg-orange-100 text-orange-600",
        link: "/resume-builder",
    },
    {
        title: "College Predictor",
        description:
            "Explore colleges and understand your admission possibilities.",
        icon: GraduationCap,
        color: "bg-pink-100 text-pink-600",
        link: "/college-predictor",
    },
    {
        title: "Professional Careers",
        description:
            "Explore professional career paths, required skills and opportunities.",
        icon: Briefcase,
        color: "bg-cyan-100 text-cyan-600",
        link: "/professional-careers",
    },
];

function AIToolsSection() {
    return (<section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">

            <div className="text-center max-w-3xl mx-auto">

                <span className="inline-block bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold">
                    CAREEROS AI
                </span>

                <h2 className="text-4xl md:text-5xl font-bold mt-5">
                    Smart Tools For Your Career
                </h2>

                <p className="text-slate-500 mt-4 text-lg">
                    Use CareerOS tools to discover careers, build your profile,
                    prepare for opportunities and plan your future.
                </p>

            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7 mt-14">

                {aiTools.map((tool) => {

                    const Icon = tool.icon;

                    return (
                        <Link
                            key={tool.title}
                            to={tool.link}
                            className="group bg-slate-50 border border-slate-200 rounded-3xl p-7 hover:bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                        >

                            <div
                                className={`${tool.color} w-14 h-14 rounded-2xl flex items-center justify-center`}
                            >
                                <Icon size={28} />
                            </div>

                            <h3 className="text-xl font-bold mt-6 group-hover:text-blue-600 transition">
                                {tool.title}
                            </h3>

                            <p className="text-slate-500 mt-3 leading-6">
                                {tool.description}
                            </p>

                            <div className="flex items-center gap-2 text-blue-600 font-semibold mt-6">
                                Explore Tool

                                <ArrowRight
                                    size={18}
                                    className="group-hover:translate-x-1 transition-transform"
                                />

                            </div>

                        </Link>
                    );

                })}

            </div>

        </div>

    </section>

    );
}

export default AIToolsSection;
