import { skillsMatch } from "../../utils/skillEngine";

function CareerSkills({ career, skillLibrary }) {
  if (!career || !skillLibrary) {
    return null;
  }

  const careerSkills = Array.isArray(career.skills)
    ? career.skills
    : [];

  const technicalSkills = Array.isArray(
    skillLibrary.technical
  )
    ? skillLibrary.technical
    : [];

  const matchedTechnicalSkills =
    technicalSkills.filter(
      (skill) =>
        careerSkills.some((careerSkill) =>
          skillsMatch(
            careerSkill,
            skill?.name
          )
        )
    );

  if (matchedTechnicalSkills.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="career-skills-heading"
      className="mt-12 sm:mt-20"
    >

      <h2
        id="career-skills-heading"
        className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-slate-800"
      >
        🚀 Skills Required
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">

        {matchedTechnicalSkills.map(
          (skill, index) => (
            <article
              key={
                skill?.id ||
                skill?.name ||
                `skill-${index}`
              }
              className="
                bg-white
                rounded-2xl
                shadow-lg
                p-5
                sm:p-6
                border
                border-gray-100
                hover:shadow-xl
                transition
              "
            >

              <h3 className="text-lg sm:text-xl font-bold text-slate-800 break-words">
                {skill?.name || "Skill"}
              </h3>

              {skill?.category && (
                <p className="text-gray-500 mt-2">
                  {skill.category}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">

                {skill?.level && (
                  <span className="
                    bg-blue-100
                    text-blue-700
                    px-3
                    py-1
                    rounded-full
                    text-sm
                    font-medium
                  ">
                    {skill.level}
                  </span>
                )}

                {skill?.demand && (
                  <span className="
                    bg-green-100
                    text-green-700
                    px-3
                    py-1
                    rounded-full
                    text-sm
                    font-medium
                  ">
                    {skill.demand}
                  </span>
                )}

              </div>

            </article>
          )
        )}

      </div>

    </section>
  );
}

export default CareerSkills;