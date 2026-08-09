import { useContext } from "react";
import { CompareContext } from "../../context/CompareContext";
import { Scale, Trash2 } from "lucide-react";

function Compare() {
  const { compareList, clearCompare } = useContext(CompareContext);

  if (compareList.length === 0) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6">
        <div className="bg-white shadow-xl rounded-3xl p-12 text-center max-w-xl">
          <Scale className="mx-auto text-blue-600 mb-6" size={60} />

          <h1 className="text-4xl font-bold">
            No Careers Selected
          </h1>

          <p className="text-gray-500 mt-4">
            Select up to two careers from the Career Explorer
            to compare them side by side.
          </p>
        </div>
      </div>
    );
  }

  const fields = [
    {
      label: "Duration",
      key: "duration",
    },
    {
      label: "Eligibility",
      key: "eligibility",
    },
    {
      label: "Average Salary",
      key: "averageSalary",
    },
    {
      label: "Growth",
      key: "growth",
    },
    {
      label: "Top Colleges",
      key: "topColleges",
      list: true,
    },
    {
      label: "Skills",
      key: "skills",
      list: true,
    },
    {
      label: "Entrance Exams",
      key: "entranceExams",
      list: true,
    },
    {
      label: "Career Opportunities",
      key: "careerOpportunities",
      list: true,
    },
    {
      label: "Higher Studies",
      key: "higherStudies",
      list: true,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 py-12">

      <div className="max-w-7xl mx-auto px-6">

        <div className="flex justify-between items-center mb-10">

          <div>

            <h1 className="text-5xl font-bold">
              Career Comparison
            </h1>

            <p className="text-gray-500 mt-2">
              Compare careers side by side.
            </p>

          </div>

          <button
            onClick={clearCompare}
            className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition"
          >
            <Trash2 size={18} />
            Clear
          </button>

        </div>

        <div className="overflow-x-auto bg-white rounded-3xl shadow-xl">

          <table className="w-full">

            <thead>

              <tr className="bg-blue-600 text-white">

                <th className="text-left p-5 w-64">
                  Feature
                </th>

                {compareList.map((career) => (

                  <th
                    key={career.id}
                    className="text-left p-5 text-xl"
                  >
                    {career.name}
                  </th>

                ))}

              </tr>

            </thead>

            <tbody>

              {fields.map((field, index) => (

                <tr
                  key={field.key}
                  className={
                    index % 2 === 0
                      ? "bg-slate-50"
                      : "bg-white"
                  }
                >

                  <td className="font-semibold p-5">
                    {field.label}
                  </td>

                  {compareList.map((career) => (

                    <td
                      key={career.id}
                      className="p-5 align-top"
                    >

                      {field.list ? (
                        <div className="flex flex-wrap gap-2">

                          {(career[field.key] || []).length > 0 ? (
                            career[field.key].map((item) => (
                              <span
                                key={item}
                                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                              >
                                {item}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-400">
                              —
                            </span>
                          )}

                        </div>
                      ) : (
                        career[field.key] || "—"
                      )}

                    </td>

                  ))}

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Compare;