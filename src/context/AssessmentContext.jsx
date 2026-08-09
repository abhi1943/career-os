import { createContext, useState } from "react";

export const AssessmentContext = createContext();

export function AssessmentProvider({ children }) {
  const [answers, setAnswers] = useState({});

  const updateAnswer = (key, value) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <AssessmentContext.Provider
      value={{
        answers,
        updateAnswer,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
}