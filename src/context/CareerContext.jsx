/* eslint-disable react-refresh/only-export-components */

import {
    createContext,
    useState,
} from "react";

// ======================================================
// CAREER CONTEXT
// ======================================================

export const CareerContext =
    createContext();

// ======================================================
// GET / CREATE CAREEROS USER ID
// ======================================================

function getCareerOSUserId() {
    const STORAGE_KEY =
        "careeros_user_id";

    const existingId =
        localStorage.getItem(
            STORAGE_KEY
        );

    if (existingId) {
        return existingId;
    }

    const newId =
        `user_${crypto.randomUUID()}`;

    localStorage.setItem(
        STORAGE_KEY,
        newId
    );

    return newId;
}

// ======================================================
// CAREER PROVIDER
// ======================================================

function CareerProvider({
    children,
}) {
    const [
        student,
        setStudent,
    ] = useState({
        name: "",
        age: "",
        education: "",
        specialization: "",
        interest: "",
        dreamCareer: "",
        state: "",
        skills: [],
    });

    // ==================================================
    // USER ID
    // ==================================================

    const [
        userId,
    ] = useState(
        getCareerOSUserId
    );

    // ==================================================
    // CONTEXT
    // ==================================================

    return (
        <CareerContext.Provider
            value={{
                student,
                setStudent,
                userId,
            }}
        >
            {children}
        </CareerContext.Provider>
    );
}

export default CareerProvider;
