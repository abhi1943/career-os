
/* eslint-disable react-refresh/only-export-components */

import {
    createContext,
    useCallback,
    useEffect,
    useState,
} from "react";

import { useAuth } from "./AuthContext";

export const CollegeFavoritesContext =
    createContext();

// ======================================================
// STORAGE KEY
// ======================================================

function getStorageKey(uid) {
    return `careerOS_saved_colleges_${uid}`;
}

// ======================================================
// DEFAULT STATE
// ======================================================

// const EMPTY_STATE = {
//     uid: null,
//     colleges: [],
// };

// ======================================================
// LOAD SAVED COLLEGES
// ======================================================

function loadSavedColleges(uid) {
    if (!uid) {
        return [];
    }

    try {
        const stored =
            localStorage.getItem(
                getStorageKey(uid)
            );

        if (!stored) {
            return [];
        }

        const parsed =
            JSON.parse(stored);

        return Array.isArray(parsed)
            ? parsed
            : [];

    } catch (error) {
        console.error(
            "CareerOS saved colleges load error:",
            error
        );

        return [];
    }
}

// ======================================================
// PROVIDER
// ======================================================

export function CollegeFavoritesProvider({
    children,
}) {
    const { user } = useAuth();

    const uid =
        user?.uid || null;

    // ==================================================
    // SAVED COLLEGES
    // ==================================================
    //
    // Keep the UID together with the data so we never
    // accidentally save one user's colleges under
    // another user's UID.
    //
    // ==================================================

    const [
        savedCollegeState,
        setSavedCollegeState,
    ] = useState(() => ({
        uid,
        colleges:
            loadSavedColleges(uid),
    }));

    // ==================================================
    // CURRENT SAVED COLLEGES
    // ==================================================
    //
    // When Firebase auth changes UID, do NOT call
    // setState() from an effect.
    //
    // Instead, derive the correct user's data directly.
    //
    // ==================================================

    const savedColleges =
        savedCollegeState.uid === uid
            ? savedCollegeState.colleges
            : loadSavedColleges(uid);

    // ==================================================
    // SAVE TO USER-SPECIFIC STORAGE
    // ==================================================

    useEffect(() => {
        if (!uid) {
            return;
        }

        // Never save stale state belonging to another UID.
        if (
            savedCollegeState.uid !==
            uid
        ) {
            return;
        }

        try {
            localStorage.setItem(
                getStorageKey(uid),
                JSON.stringify(
                    savedCollegeState.colleges
                )
            );

        } catch (error) {
            console.error(
                "CareerOS saved colleges save error:",
                error
            );
        }

    }, [
        uid,
        savedCollegeState,
    ]);

    // ==================================================
    // TOGGLE COLLEGE
    // ==================================================

    const toggleCollege =
        useCallback(
            (college) => {
                if (!uid || !college) {
                    return;
                }

                const collegeId =
                    college?.id;

                if (!collegeId) {
                    return;
                }

                const normalizedId =
                    String(collegeId);

                setSavedCollegeState(
                    (currentState) => {

                        // If auth changed between renders,
                        // start from the newly authenticated
                        // user's stored colleges.
                        const currentColleges =
                            currentState.uid ===
                            uid
                                ? currentState.colleges
                                : loadSavedColleges(
                                      uid
                                  );

                        const exists =
                            currentColleges.some(
                                (item) =>
                                    String(
                                        item?.id
                                    ) ===
                                    normalizedId
                            );

                        if (exists) {
                            return {
                                uid,
                                colleges:
                                    currentColleges.filter(
                                        (item) =>
                                            String(
                                                item?.id
                                            ) !==
                                            normalizedId
                                    ),
                            };
                        }

                        return {
                            uid,
                            colleges: [
                                ...currentColleges,
                                {
                                    ...college,
                                    id: normalizedId,
                                },
                            ],
                        };
                    }
                );
            },
            [uid]
        );

    // ==================================================
    // CHECK SAVED
    // ==================================================

    const isCollegeSaved =
        useCallback(
            (collegeId) => {
                if (!collegeId) {
                    return false;
                }

                const normalizedId =
                    String(collegeId);

                return savedColleges.some(
                    (college) =>
                        String(
                            college?.id
                        ) === normalizedId
                );
            },
            [savedColleges]
        );

    // ==================================================
    // CLEAR ALL
    // ==================================================

    const clearSavedColleges =
        useCallback(() => {
            if (!uid) {
                return;
            }

            setSavedCollegeState({
                uid,
                colleges: [],
            });
        }, [uid]);

    // ==================================================
    // CONTEXT
    // ==================================================

    return (
        <CollegeFavoritesContext.Provider
            value={{
                savedColleges,
                toggleCollege,
                isCollegeSaved,
                clearSavedColleges,
            }}
        >
            {children}
        </CollegeFavoritesContext.Provider>
    );
}
  
