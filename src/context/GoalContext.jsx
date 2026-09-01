
/* eslint-disable react-refresh/only-export-components */

import {
    createContext,
    useCallback,
    useMemo,
    useState,
} from "react";

import { useAuth } from "./AuthContext";

export const GoalContext = createContext();


// ======================================================
// STORAGE KEY
// ======================================================

function getGoalStorageKey(uid) {
    return `careerOS_career_goal_${uid}`;
}


// ======================================================
// LOAD USER GOAL
// ======================================================

function loadGoal(uid) {
    if (!uid) {
        return null;
    }

    try {
        const stored = localStorage.getItem(
            getGoalStorageKey(uid)
        );

        if (!stored) {
            return null;
        }

        return JSON.parse(stored);

    } catch (error) {
        console.error(
            "CareerOS Goal load error:",
            error
        );

        return null;
    }
}


// ======================================================
// SAVE USER GOAL
// ======================================================

function saveGoal(uid, value) {
    if (!uid) {
        return;
    }

    try {
        localStorage.setItem(
            getGoalStorageKey(uid),
            JSON.stringify(value)
        );

    } catch (error) {
        console.error(
            "CareerOS Goal save error:",
            error
        );
    }
}


// ======================================================
// PROVIDER
// ======================================================

export function GoalProvider({ children }) {

    const { user } = useAuth();

    const uid = user?.uid || null;


    // ==================================================
    // GOAL
    // ==================================================

    const [goalState, setGoalState] = useState(() => {
        return loadGoal(uid);
    });


    // ==================================================
    // SET GOAL
    // ==================================================

    const setGoal = useCallback(
        (newGoal) => {

            setGoalState((previousGoal) => {

                const updatedGoal =
                    typeof newGoal === "function"
                        ? newGoal(previousGoal)
                        : newGoal;

                if (uid) {
                    saveGoal(
                        uid,
                        updatedGoal
                    );
                }

                return updatedGoal;
            });

        },
        [uid]
    );


    // ==================================================
    // CONTEXT VALUE
    // ==================================================

    const value = useMemo(
        () => ({
            goal: goalState,
            setGoal,
        }),
        [goalState, setGoal]
    );


    // ==================================================
    // PROVIDER
    // ==================================================

    return (
        <GoalContext.Provider value={value}>
            {children}
        </GoalContext.Provider>
    );
}
  
