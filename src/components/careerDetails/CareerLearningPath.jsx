import { generateLearningPath } from "../../utils/learningPathEngine";

function CareerLearningPath({ student, career }) {
  if (!student || !career) return null;

  const roadmap = generateLearningPath(student, career);

  return (
    <div className="mt-20">

      <h2 className="text-3xl font-bold mb-8">
        🧠 Personalized AI Learning Path
      </h2>

      <div className="bg-white rounded-3xl shadow-lg p-8">

        {roadmap.length === 0 ? (

          <div className="text-center py-10">

            <h3 className="text-2xl font-bold text-green-600">
              🎉 Congratulations!
            </h3>

            <p className="mt-3 text-gray-600">
              You already have all the required skills for this career.
            </p>

          </div>

        ) : (

          <div className="space-y-6">

            {roadmap.map((item, index) => (

              <div
                key={item.skill}
                className="flex items-center gap-6"
              >

                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">

                  {index + 1}

                </div>

                <div className="flex-1 bg-blue-50 rounded-2xl p-5">

                  <p className="text-blue-600 font-semibold">
                    {item.week}
                  </p>

                  <h3 className="text-xl font-bold mt-1">
                    Learn {item.skill}
                  </h3>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default CareerLearningPath;