import { useContext } from "react";
import { CareerContext } from "../../context/CareerContext";
import { getCareerOptions } from "../../utils/careerEngine";
import { calculateCareerMatch } from "../../utils/aiCareerMatch";
import { useNavigate } from "react-router-dom";
import { generateRoadmap } from "../../utils/roadmapGenerator";

function CareerRecommendation() {
    const navigate = useNavigate();
    const { student } = useContext(CareerContext);

    if (!student || !student.education) {
        return (
            <div className="bg-white rounded-2xl shadow-md p-8">
                <h2 className="text-2xl font-bold mb-3">
                    AI Career Recommendation
                </h2>

                <p className="text-gray-500">
                    Complete your profile to receive AI recommendations.
                </p>
            </div>
        );
    }

    /* ==================================================
       GET ELIGIBLE CAREERS
    ================================================== */

    const careers = getCareerOptions(student);

    /* ==================================================
       CALCULATE AI MATCH
    ================================================== */

    const recommendations = careers
        .map((career) => ({
            career,
            ...calculateCareerMatch(student, career),
        }))
        .sort((a, b) => {

            /*
             * IMPORTANT:
             * The user's selected dream career ALWAYS
             * stays at the top.
             */

            const aIsSelected =
                student.dreamCareer &&
                a.career.name === student.dreamCareer;

            const bIsSelected =
                student.dreamCareer &&
                b.career.name === student.dreamCareer;

            if (aIsSelected && !bIsSelected) {
                return -1;
            }

            if (!aIsSelected && bIsSelected) {
                return 1;
            }

            /*
             * All other careers are ranked by AI score.
             */

            return b.score - a.score;
        });

    return (
        <section className="bg-white rounded-3xl shadow-lg p-8">

            {/* ==================================================
                HEADER
            ================================================== */}

            <h2 className="text-3xl font-bold mb-2">
                🤖 AI Career Recommendation
            </h2>

            <p className="text-gray-500 mb-8">
                These careers are ranked based on your profile.
            </p>

            {/* ==================================================
                CAREER RECOMMENDATIONS
            ================================================== */}

            <div className="space-y-5">

                {recommendations.map(
                    ({
                        career,
                        score,
                        matchedSkills,
                        missingSkills,
                        reasons,
                        placementChance,
                        salaryPotential,
                        learningProgress,
                        futureDemand,
                    }) => {

                        const roadmap =
                            generateRoadmap(career.name);

                        const isSelected =
                            student.dreamCareer === career.name;

                        return (
                            <div
                                key={career.id}
                                className={`border rounded-2xl p-6 transition ${
                                    isSelected
                                        ? "border-blue-500 bg-blue-50/30 shadow-md"
                                        : "hover:shadow-md"
                                }`}
                            >

                                {/* ==================================================
                                    SELECTED CAREER BADGE
                                ================================================== */}

                                {isSelected && (
                                    <div className="mb-4">

                                        <span className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold">
                                            🎯 Selected Career Goal
                                        </span>

                                    </div>
                                )}

                                {/* ==================================================
                                    CAREER HEADER
                                ================================================== */}

                                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-5">

                                    <div className="flex-1 min-w-0">

                                        <h3 className="text-xl font-bold">
                                            {career.name}
                                        </h3>

                                        <p className="text-gray-500 mt-2">
                                            {career.description}
                                        </p>

                                        <div className="grid md:grid-cols-2 gap-3 mt-5 text-sm">

                                            <div>
                                                🎓{" "}
                                                <span className="font-semibold">
                                                    Eligibility:
                                                </span>{" "}
                                                {career.eligibility}
                                            </div>

                                            <div>
                                                💰{" "}
                                                <span className="font-semibold">
                                                    Salary:
                                                </span>{" "}
                                                {career.averageSalary ||
                                                    career.salary ||
                                                    "Not specified"}
                                            </div>

                                            <div>
                                                📈{" "}
                                                <span className="font-semibold">
                                                    Growth:
                                                </span>{" "}
                                                {career.growth}
                                            </div>

                                            <div>
                                                📚{" "}
                                                <span className="font-semibold">
                                                    Duration:
                                                </span>{" "}
                                                {career.duration}
                                            </div>

                                        </div>

                                    </div>

                                    {/* ==================================================
                                        MATCH SCORE
                                    ================================================== */}

                                    <div className="text-left md:text-right shrink-0">

                                        <div className="text-3xl font-bold text-green-600">
                                            {score}%
                                        </div>

                                        <div className="text-sm text-gray-500">
                                            Match
                                        </div>

                                    </div>

                                </div>

                                {/* ==================================================
                                    MATCHED SKILLS
                                ================================================== */}

                                {matchedSkills.length > 0 && (
                                    <div className="mt-5">

                                        <h4 className="font-semibold mb-2">
                                            ✅ Matched Skills
                                        </h4>

                                        <div className="flex flex-wrap gap-2">

                                            {matchedSkills.map((skill) => (
                                                <span
                                                    key={skill}
                                                    className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                                                >
                                                    ✔ {skill}
                                                </span>
                                            ))}

                                        </div>

                                    </div>
                                )}

                                {/* ==================================================
                                    AI REASONS
                                ================================================== */}

                                {reasons && reasons.length > 0 && (
                                    <div className="mt-5">

                                        <h4 className="font-semibold mb-2">
                                            🤖 Why AI Recommended This
                                        </h4>

                                        <ul className="space-y-2">

                                            {reasons.map((reason, index) => (
                                                <li
                                                    key={`${reason}-${index}`}
                                                    className="text-green-700 text-sm"
                                                >
                                                    ✔ {reason}
                                                </li>
                                            ))}

                                        </ul>

                                    </div>
                                )}

                                {/* ==================================================
                                    MISSING SKILLS
                                ================================================== */}

                                {missingSkills.length > 0 && (
                                    <div className="mt-5">

                                        <h4 className="font-semibold mb-2 text-red-600">
                                            📚 Learn Next
                                        </h4>

                                        <div className="flex flex-wrap gap-2">

                                            {missingSkills.map((skill) => (
                                                <span
                                                    key={skill}
                                                    className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm"
                                                >
                                                    {skill}
                                                </span>
                                            ))}

                                        </div>

                                    </div>
                                )}

                                {/* ==================================================
                                    CAREER SUCCESS METER
                                ================================================== */}

                                <div className="mt-6 border-t pt-6">

                                    <h4 className="font-bold text-lg mb-4">
                                        🎯 Career Success Meter
                                    </h4>

                                    <div className="grid md:grid-cols-2 gap-4">

                                        {/* Overall */}

                                        <div className="bg-blue-50 rounded-xl p-4">

                                            <div className="text-gray-500">
                                                Overall Match
                                            </div>

                                            <div className="text-3xl font-bold text-blue-600">
                                                {score}%
                                            </div>

                                        </div>

                                        {/* Placement */}

                                        <div className="bg-green-50 rounded-xl p-4">

                                            <div className="text-gray-500">
                                                Placement Chance
                                            </div>

                                            <div className="text-3xl font-bold text-green-600">
                                                {placementChance}%
                                            </div>

                                        </div>

                                        {/* Salary */}

                                        <div className="bg-purple-50 rounded-xl p-4">

                                            <div className="text-gray-500">
                                                Salary Potential
                                            </div>

                                            <div className="text-3xl font-bold text-purple-600">
                                                {salaryPotential}%
                                            </div>

                                        </div>

                                        {/* Future Demand */}

                                        <div className="bg-orange-50 rounded-xl p-4">

                                            <div className="text-gray-500">
                                                Future Demand
                                            </div>

                                            <div className="text-3xl font-bold text-orange-600">
                                                {futureDemand}%
                                            </div>

                                        </div>

                                        {/* Learning Progress */}

                                        <div className="md:col-span-2 bg-gray-50 rounded-xl p-4">

                                            <div className="flex justify-between mb-2">

                                                <span>
                                                    Learning Progress
                                                </span>

                                                <span>
                                                    {learningProgress}%
                                                </span>

                                            </div>

                                            <div className="w-full bg-gray-200 rounded-full h-3">

                                                <div
                                                    className="bg-blue-600 h-3 rounded-full"
                                                    style={{
                                                        width: `${learningProgress}%`,
                                                    }}
                                                />

                                            </div>

                                        </div>

                                    </div>

                                </div>

                                {/* ==================================================
                                    AI LEARNING ROADMAP
                                ================================================== */}

                                {roadmap.length > 0 && (
                                    <div className="mt-8 border-t pt-6 w-full">

                                        <h4 className="font-bold text-lg text-gray-800 mb-5">
                                            🗓️ AI Learning Roadmap
                                        </h4>

                                        <div className="space-y-5">

                                            {roadmap.map((step, index) => (

                                                <div
                                                    key={`${step.month}-${step.title}-${index}`}
                                                    className="flex items-start gap-4"
                                                >

                                                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 shrink-0 flex items-center justify-center text-sm font-semibold">
                                                        {index + 1}
                                                    </div>

                                                    <div className="flex-1 min-w-0">

                                                        <p className="text-sm font-semibold text-blue-600">
                                                            {step.month}
                                                        </p>

                                                        <p className="font-semibold text-gray-800 mt-1">
                                                            {step.title}
                                                        </p>

                                                        {Array.isArray(step.skills) &&
                                                            step.skills.length > 0 && (

                                                                <div className="flex flex-wrap gap-2 mt-3">

                                                                    {step.skills.map(
                                                                        (skill, skillIndex) => (

                                                                            <span
                                                                                key={`${step.month}-${skill}-${skillIndex}`}
                                                                                className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs"
                                                                            >
                                                                                {skill}
                                                                            </span>

                                                                        )
                                                                    )}

                                                                </div>

                                                            )}

                                                    </div>

                                                </div>

                                            ))}

                                        </div>

                                    </div>
                                )}

                                {/* ==================================================
                                    CAREER DETAILS
                                ================================================== */}

                                <div className="mt-6 flex justify-end">

                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/career/${career.id}`
                                            )
                                        }
                                        className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition"
                                    >
                                        View Career Details →
                                    </button>

                                </div>

                            </div>
                        );
                    }
                )}

            </div>

        </section>
    );
}

export default CareerRecommendation;