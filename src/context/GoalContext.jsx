import { createContext, useEffect, useState } from "react";

export const GoalContext = createContext();

export function GoalProvider({ children }) {
  const [goal, setGoal] = useState(() => {
    return JSON.parse(localStorage.getItem("careerGoal")) || null;
  });

  useEffect(() => {
    localStorage.setItem("careerGoal", JSON.stringify(goal));
  }, [goal]);

  return (
    <GoalContext.Provider
      value={{
        goal,
        setGoal,
      }}
    >
      {children}
    </GoalContext.Provider>
  );
}