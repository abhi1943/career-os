import { useState } from "react";

function CareerTabs({ children }) {
  const tabs = [
    "Overview",
    "Roadmap",
    "Skills",
    "Resources",
    "Salary",
    "Interview",
  ];

  const [active, setActive] = useState("Overview");

  return (
    <div className="mt-12">

      <div className="flex flex-wrap gap-3 mb-10">

        {tabs.map(tab => (

          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`px-5 py-3 rounded-xl transition font-semibold
            ${
              active === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {tab}
          </button>

        ))}

      </div>

      {children(active)}

    </div>
  );
}

export default CareerTabs;