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

    let careers = getCareerOptions(student);

    // If user selected a career goal, show it first
    if (student.dreamCareer) {
        careers = careers.sort((a, b) => {
            if (a.name === student.dreamCareer) return -1;
            if (b.name === student.dreamCareer) return 1;
            return 0;
        });
    }
    const filteredCareers =
        student.education === "btech"
            ? careers.filter((career) => {
                const branch = student.specialization;

                if (branch === "CSE") {
                    return [
                        "software-engineer",
                        "frontend-developer",
                        "backend-developer",
                        "full-stack-developer",
                        "cloud-engineer",
                        "qa-engineer",
                    ].includes(career.id);
                }

                if (branch === "AI & ML") {
                    return [
                        "ai-engineer",
                        "data-scientist",
                        "software-engineer",
                    ].includes(career.id);
                }

                if (branch === "Data Science") {
                    return [
                        "data-scientist",
                        "ai-engineer",
                    ].includes(career.id);
                }

                if (branch === "Cyber Security") {
                    return [
                        "cyber-security-engineer",
                        "cloud-engineer",
                    ].includes(career.id);
                }

                return true;
            })
            : careers;

    const recommendations = filteredCareers
        .map((career) => ({
            career,
            ...calculateCareerMatch(student, career),
        }))
        .sort((a, b) => b.score - a.score);


    return (
        <section className="bg-white rounded-3xl shadow-lg p-8">

            <h2 className="text-3xl font-bold mb-2">
                🤖 AI Career Recommendation
            </h2>

            <p className="text-gray-500 mb-8">
                These careers are ranked based on your profile.
            </p>

            <div className="space-y-5">

                {recommendations.map(({ career,
                    score,
                    matchedSkills,
                    missingSkills,
                    reasons,
                    placementChance,
                    salaryPotential,
                    learningProgress,
                    futureDemand, }) => {
                    const roadmap = generateRoadmap(career.name);

                    return (

                        <div
                            key={career.id}
                            className="border rounded-2xl p-6 hover:shadow-md transition"
                        >

                            <div className="flex justify-between items-center">

                                <div>

                                    <h3 className="text-xl font-bold">
                                        {career.name}
                                    </h3>

                                    <p className="text-gray-500 mt-2">
                                        {career.description}
                                    </p>

                                    <div className="grid md:grid-cols-2 gap-3 mt-5 text-sm">

                                        <div>
                                            🎓 <span className="font-semibold">Eligibility:</span>{" "}
                                            {career.eligibility}
                                        </div>

                                        <div>
                                            💰 <span className="font-semibold">Salary:</span>{" "}
                                            {career.salary}
                                        </div>

                                        <div>
                                            📈 <span className="font-semibold">Growth:</span>{" "}
                                            {career.growth}
                                        </div>

                                        <div>
                                            📚 <span className="font-semibold">Duration:</span>{" "}
                                            {career.duration}
                                        </div>

                                    </div>

                                </div>

                                <div className="text-right">

                                    <div className="text-3xl font-bold text-green-600">
                                        {score}%
                                    </div>

                                    <div className="text-sm text-gray-500">
                                        Match
                                    </div>

                                </div>

                            </div>

                            <div className="mt-5">

                                {matchedSkills.length > 0 && (
                                    <>
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
                                    </>
                                )}

                                {reasons && reasons.length > 0 && (
                                    <div className="mt-5">
                                        <h4 className="font-semibold mb-2">
                                            🤖 Why AI Recommended This
                                        </h4>

                                        <ul className="space-y-2">
                                            {reasons.map((reason) => (
                                                <li
                                                    key={reason}
                                                    className="text-green-700 text-sm"
                                                >
                                                    ✔ {reason}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
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
                                <div className="mt-6 border-t pt-6">

                                    <h4 className="font-bold text-lg mb-4">
                                        🎯 Career Success Meter
                                    </h4>

                                    <div className="grid md:grid-cols-2 gap-4">

                                        <div className="bg-blue-50 rounded-xl p-4">
                                            <div className="text-gray-500">
                                                Overall Match
                                            </div>

                                            <div className="text-3xl font-bold text-blue-600">
                                                {score}%
                                            </div>
                                        </div>

                                        <div className="bg-green-50 rounded-xl p-4">
                                            <div className="text-gray-500">
                                                Placement Chance
                                            </div>

                                            <div className="text-3xl font-bold text-green-600">
                                                {placementChance}%
                                            </div>
                                        </div>

                                        <div className="bg-purple-50 rounded-xl p-4">
                                            <div className="text-gray-500">
                                                Salary Potential
                                            </div>

                                            <div className="text-3xl font-bold text-purple-600">
                                                {salaryPotential}%
                                            </div>
                                        </div>

                                        <div className="bg-orange-50 rounded-xl p-4">
                                            <div className="text-gray-500">
                                                Future Demand
                                            </div>

                                            <div className="text-3xl font-bold text-orange-600">
                                                {futureDemand}%
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 bg-gray-50 rounded-xl p-4">
                                            <div className="flex justify-between mb-2">
                                                <span>Learning Progress</span>

                                                <span>{learningProgress}%</span>
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

                            </div>
                            <div className="mt-6 flex justify-end">

                                {/* AI Learning Roadmap */}

                                {roadmap.length > 0 && (
                                    <div className="mt-6 border-t pt-5">

                                        <h4 className="font-bold mb-4">
                                            🗓️ AI Learning Roadmap
                                        </h4>

                                        <div className="space-y-4">

                                            {roadmap.map((step, index) => (

                                                <div
                                                    key={`${step.month}-${step.title}-${index}`}
                                                    className="flex items-start gap-3"
                                                >

                                                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 shrink-0 flex items-center justify-center text-sm">
                                                        {index + 1}
                                                    </div>

                                                    <div className="flex-1">

                                                        <p className="text-sm font-semibold text-blue-600">
                                                            {step.month}
                                                        </p>

                                                        <p className="font-semibold text-gray-800">
                                                            {step.title}
                                                        </p>

                                                        {Array.isArray(step.skills) &&
                                                            step.skills.length > 0 && (

                                                                <div className="flex flex-wrap gap-2 mt-2">

                                                                    {step.skills.map((skill, skillIndex) => (

                                                                        <span
                                                                            key={`${step.month}-${skill}-${skillIndex}`}
                                                                            className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs"
                                                                        >
                                                                            {skill}
                                                                        </span>

                                                                    ))}

                                                                </div>

                                                            )}

                                                    </div>

                                                </div>

                                            ))}

                                        </div>

                                    </div>
                                )}



                                <button
                                    onClick={() => navigate(`/career/${career.id}`)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl transition"
                                >
                                    View Career Details →
                                </button>

                            </div>

                        </div>

                    )
                })}

            </div>

        </section>
    );
}

export default CareerRecommendation;