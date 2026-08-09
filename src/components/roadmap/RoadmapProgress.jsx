import { useEffect, useState } from "react";

function RoadmapProgress({ careerId, roadmap }) {
  const storageKey = `roadmap-${careerId}`;

  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);

    if (saved) {
      setCompleted(JSON.parse(saved));
    }
  }, [storageKey]);

  const toggleStep = (id) => {
    let updated;

    if (completed.includes(id)) {
      updated = completed.filter((item) => item !== id);
    } else {
      updated = [...completed, id];
    }

    setCompleted(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const progress = roadmap.length
    ? Math.round((completed.length / roadmap.length) * 100)
    : 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">

      <div className="flex justify-between mb-6">

        <h2 className="text-2xl font-bold">
          Roadmap Progress
        </h2>

        <span className="font-bold text-blue-600">
          {progress}%
        </span>

      </div>

      <div className="w-full bg-gray-200 rounded-full h-3 mb-8">

        <div
          className="bg-green-500 h-3 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />

      </div>

      <div className="space-y-5">

        {roadmap.map((step) => (

          <label
            key={step.id}
            className="flex items-start gap-4 cursor-pointer"
          >

            <input
              type="checkbox"
              checked={completed.includes(step.id)}
              onChange={() => toggleStep(step.id)}
              className="mt-1"
            />

            <div>

              <h3 className="font-semibold">
                {step.title}
              </h3>

              <p className="text-sm text-gray-500">
                {step.duration}
              </p>

            </div>

          </label>

        ))}

      </div>

    </div>
  );
}

export default RoadmapProgress;