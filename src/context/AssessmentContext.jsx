/* eslint-disable react-refresh/only-export-components */

import {
createContext,
useContext,
useState,
} from "react";

// ======================================================
// ASSESSMENT CONTEXT
// ======================================================

const AssessmentContext =
createContext(null);

// ======================================================
// PROVIDER
// ======================================================

export function AssessmentProvider({
children,
}) {
const [answers, setAnswers] =
useState({});

  
// ==================================================
// UPDATE ANSWER
// ==================================================

const updateAnswer = (
    key,
    value
) => {
    setAnswers((previousAnswers) => ({
        ...previousAnswers,
        [key]: value,
    }));
};

// ==================================================
// RESET ASSESSMENT
// ==================================================

const resetAssessment = () => {
    setAnswers({});
};

// ==================================================
// PROVIDER
// ==================================================

return (
    <AssessmentContext.Provider
        value={{
            answers,
            updateAnswer,
            resetAssessment,
        }}
    >
        {children}
    </AssessmentContext.Provider>
);
  

}

// ======================================================
// HOOK
// ======================================================

export function useAssessment() {
const context =
useContext(
AssessmentContext
);

  
if (!context) {
    throw new Error(
        "useAssessment must be used inside an AssessmentProvider"
    );
}

return context;
  

}

export { AssessmentContext };
