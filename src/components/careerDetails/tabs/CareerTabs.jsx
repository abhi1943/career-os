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
    <div className="mt-8 sm:mt-12">

      <div
        role="tablist"
        aria-label="Career information sections"
        className="
          flex
          gap-2
          sm:gap-3
          mb-8
          sm:mb-10
          overflow-x-auto
          pb-2
          scrollbar-thin
        "
      >

        {tabs.map((tab) => {
          const isActive = active === tab;

          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(tab)}
              onKeyDown={(event) => {
                if (
                  event.key === "ArrowRight" ||
                  event.key === "ArrowDown"
                ) {
                  event.preventDefault();

                  const currentIndex =
                    tabs.indexOf(tab);

                  const nextIndex =
                    (currentIndex + 1) %
                    tabs.length;

                  setActive(tabs[nextIndex]);
                  document
                    .getElementById(
                      `career-tab-${nextIndex}`
                    )
                    ?.focus();
                }

                if (
                  event.key === "ArrowLeft" ||
                  event.key === "ArrowUp"
                ) {
                  event.preventDefault();

                  const currentIndex =
                    tabs.indexOf(tab);

                  const previousIndex =
                    (currentIndex - 1 + tabs.length) %
                    tabs.length;

                  setActive(tabs[previousIndex]);
                  document
                    .getElementById(
                      `career-tab-${previousIndex}`
                    )
                    ?.focus();
                }

                if (event.key === "Home") {
                  event.preventDefault();

                  setActive(tabs[0]);
                  document
                    .getElementById("career-tab-0")
                    ?.focus();
                }

                if (event.key === "End") {
                  event.preventDefault();

                  const lastIndex =
                    tabs.length - 1;

                  setActive(tabs[lastIndex]);
                  document
                    .getElementById(
                      `career-tab-${lastIndex}`
                    )
                    ?.focus();
                }
              }}
              id={`career-tab-${tabs.indexOf(tab)}`}
              className={`
                px-4
                sm:px-5
                py-2.5
                sm:py-3
                rounded-xl
                transition
                font-semibold
                whitespace-nowrap
                shrink-0
                text-sm
                sm:text-base
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-blue-500
                focus-visible:ring-offset-2
                ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }
              `}
            >
              {tab}
            </button>
          );
        })}

      </div>

      <div
        role="tabpanel"
        aria-label={`${active} content`}
        tabIndex={0}
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-4 rounded-2xl"
      >
        {children(active)}
      </div>

    </div>
  );
}

export default CareerTabs;