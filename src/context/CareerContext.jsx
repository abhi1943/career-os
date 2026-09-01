/* eslint-disable react-refresh/only-export-components */

import {
createContext,
useEffect,
useState,
} from "react";

import { useAuth } from "./AuthContext";

// ======================================================
// CAREER CONTEXT
// ======================================================

export const CareerContext = createContext();

// ======================================================
// STORAGE KEY
// ======================================================

function getStudentStorageKey(uid) {
return `careerOS_student_${uid}`;
}

// ======================================================
// DEFAULT STUDENT
// ======================================================

const DEFAULT_STUDENT = {
name: "",
age: "",
education: "",
specialization: "",
interest: "",
dreamCareer: "",
state: "",
skills: [],
};

// ======================================================
// CREATE DEFAULT STUDENT
// ======================================================

function createDefaultStudent() {
return {
...DEFAULT_STUDENT,
skills: [],
};
}

// ======================================================
// LOAD USER STUDENT
// ======================================================

function loadStudent(uid) {
if (!uid) {
return createDefaultStudent();
}

  
try {
    const stored = localStorage.getItem(
        getStudentStorageKey(uid)
    );

    if (!stored) {
        return createDefaultStudent();
    }

    const parsed = JSON.parse(stored);

    return {
        ...DEFAULT_STUDENT,
        ...parsed,
        skills: Array.isArray(parsed?.skills)
            ? parsed.skills
            : [],
    };
} catch {
    return createDefaultStudent();
}
  

}

// ======================================================
// CAREER PROVIDER
// ======================================================

function CareerProvider({ children }) {
const { user } = useAuth();

  
const uid = user?.uid || null;

// ==================================================
// STUDENT
// ==================================================

const [student, setStudentState] = useState(() =>
    loadStudent(uid)
);

// ==================================================
// TRACK WHICH USER THE STATE BELONGS TO
// ==================================================

const [studentUid, setStudentUid] = useState(uid);

// ==================================================
// USER CHANGE HANDLING
// ==================================================


if (studentUid !== uid) {
    setStudentUid(uid);
    setStudentState(loadStudent(uid));
}

// ==================================================
// SAVE USER PROFILE
// ==================================================

useEffect(() => {
    if (!uid) {
        return;
    }

    try {
        localStorage.setItem(
            getStudentStorageKey(uid),
            JSON.stringify(student)
        );
    } catch {
        // Storage may be unavailable.
    }
}, [student, uid]);

// ==================================================
// SET STUDENT
// ==================================================

const setStudent = (newStudent) => {
    setStudentState((previousStudent) => {
        const updatedStudent =
            typeof newStudent === "function"
                ? newStudent(previousStudent)
                : newStudent;

        return {
            ...DEFAULT_STUDENT,
            ...updatedStudent,
            skills: Array.isArray(
                updatedStudent?.skills
            )
                ? updatedStudent.skills
                : [],
        };
    });
};

// ==================================================
// CONTEXT
// ==================================================

return (
    <CareerContext.Provider
        value={{
            student,
            setStudent,
            userId: uid,
        }}
    >
        {children}
    </CareerContext.Provider>
);
  

}

export default CareerProvider;
