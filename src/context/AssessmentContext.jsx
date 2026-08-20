/* eslint-disable react-refresh/only-export-components */

import {
    createContext,
    useContext,
    useState,
} from "react";

const AssessmentContext = createContext(null);

export function AssessmentProvider({ children }) {
    const [answers, setAnswers] = useState({});

    const updateAnswer = (key, value) => {
        setAnswers((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const resetAssessment = () => {
        setAnswers({});
    };

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

export function useAssessment() {
    const context = useContext(AssessmentContext);

    if (!context) {
        throw new Error(
            "useAssessment must be used inside an AssessmentProvider"
        );
    }

    return context;
}

export { AssessmentContext };
