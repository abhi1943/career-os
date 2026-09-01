
import { useState } from "react";

import RoadmapProgress from "./RoadmapProgress";

function CareerRoadmapAI({
    careerId = "",
    career = null,
}) {
    /* ==================================================
       COMPLETED SKILLS
    ================================================== */

    const [
        completedSkills,
        setCompletedSkills,
    ] = useState([]);


    /* ==================================================
       DYNAMIC ROADMAP
       --------------------------------------------------
       Roadmap comes ONLY from the actual career data
       supplied by careerDataMapper / CareerDetails.
    ================================================== */

    const roadmap =
        Array.isArray(career?.roadmap)
            ? career.roadmap
            : [];


    /* ==================================================
       CAREER NAME
    ================================================== */

    const careerName =
        career?.name ||
        String(careerId || "Career")
            .replace(/-/g, " ");


    /* ==================================================
       TOGGLE SKILL
    ================================================== */

    const toggleSkill = (skill) => {
        setCompletedSkills((current) => {
            if (current.includes(skill)) {
                return current.filter(
                    (item) => item !== skill
                );
            }

            return [
                ...current,
                skill,
            ];
        });
    };


    /* ==================================================
       RENDER
    ================================================== */

    return (
        <section className="bg-white rounded-3xl shadow-lg p-8">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="mb-8">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div>

                        <h2 className="text-3xl font-bold text-slate-800">
                            🚀 Career Roadmap
                        </h2>

                        <p className="text-gray-500 mt-2">

                            Follow this roadmap step by step
                            to become a successful{" "}

                            <span className="font-semibold text-blue-600">
                                {careerName}
                            </span>.

                        </p>

                    </div>


                    <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold text-sm">

                        {roadmap.length}{" "}
                        {roadmap.length === 1
                            ? "Stage"
                            : "Stages"}

                    </div>

                </div>

            </div>


            {/* ==================================================
                ROADMAP NOT FOUND
                --------------------------------------------------
                This means the selected career currently has
                no roadmap in the centralized career data.
            ================================================== */}

            {roadmap.length === 0 ? (

                <div className="text-center py-12">

                    <div className="text-5xl mb-5">
                        🗺️
                    </div>

                    <h3 className="text-2xl font-semibold text-gray-700">
                        Roadmap Not Available
                    </h3>

                    <p className="mt-3 text-gray-500">
                        A roadmap has not been added to the
                        career data for this career yet.
                    </p>

                    {careerId && (
                        <p className="mt-2 text-sm text-gray-400">
                            Career ID: {careerId}
                        </p>
                    )}

                </div>

            ) : (

                <>

                    {/* ==================================================
                        DYNAMIC ROADMAP STAGES
                        --------------------------------------------------
                        Every stage is rendered directly from
                        career.roadmap.
                    ================================================== */}

                    <div className="space-y-6">

                        {roadmap.map(
                            (stage, index) => (

                                <div
                                    key={
                                        stage.id ||
                                        `${careerId || "career"}-${index}`
                                    }
                                    className="
                                        relative
                                        border
                                        border-gray-200
                                        rounded-2xl
                                        p-6
                                        bg-white
                                        hover:shadow-lg
                                        transition
                                    "
                                >

                                    <div className="flex items-start gap-5">

                                        {/* ==================================================
                                            STAGE NUMBER
                                        ================================================== */}

                                        <div
                                            className="
                                                w-12
                                                h-12
                                                rounded-full
                                                bg-blue-600
                                                text-white
                                                flex
                                                items-center
                                                justify-center
                                                font-bold
                                                flex-shrink-0
                                            "
                                        >
                                            {index + 1}
                                        </div>


                                        {/* ==================================================
                                            STAGE CONTENT
                                        ================================================== */}

                                        <div className="flex-1">

                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

                                                <h3 className="text-xl font-bold text-slate-800">
                                                    {stage.title ||
                                                        `Stage ${index + 1}`}
                                                </h3>

                                                {stage.duration && (
                                                    <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold w-fit">
                                                        {stage.duration}
                                                    </span>
                                                )}

                                            </div>


                                            {/* ==================================================
                                                DYNAMIC SKILLS
                                            ================================================== */}

                                            {Array.isArray(
                                                stage.skills
                                            ) &&
                                            stage.skills.length > 0 && (

                                                <div className="grid md:grid-cols-2 gap-3 mt-5">

                                                    {stage.skills.map(
                                                        (skill) => {

                                                            const completed =
                                                                completedSkills.includes(
                                                                    skill
                                                                );

                                                            return (

                                                                <button
                                                                    type="button"
                                                                    key={skill}
                                                                    onClick={() =>
                                                                        toggleSkill(
                                                                            skill
                                                                        )
                                                                    }
                                                                    className={`
                                                                        text-left
                                                                        rounded-xl
                                                                        px-4
                                                                        py-3
                                                                        transition
                                                                        border
                                                                        ${
                                                                            completed
                                                                                ? "bg-green-100 border-green-300 text-green-700"
                                                                                : "bg-slate-100 border-transparent text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                                                                        }
                                                                    `}
                                                                >

                                                                    {completed
                                                                        ? "✅"
                                                                        : "⬜"}{" "}

                                                                    {skill}

                                                                </button>

                                                            );

                                                        }
                                                    )}

                                                </div>

                                            )}

                                        </div>

                                    </div>

                                </div>

                            )
                        )}

                    </div>


                    {/* ==================================================
                        ROADMAP PROGRESS
                        --------------------------------------------------
                        Progress is calculated from the same dynamic
                        roadmap displayed above.
                    ================================================== */}

                    <div className="mt-10">

                        <RoadmapProgress
                            roadmap={roadmap}
                            completedSkills={
                                completedSkills
                            }
                        />

                    </div>

                </>

            )}

        </section>
    );
}

export default CareerRoadmapAI;

