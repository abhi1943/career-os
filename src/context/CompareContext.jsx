/* eslint-disable react-refresh/only-export-components */

import {
    createContext,
    useCallback,
    useEffect,
    useState,
} from "react";

import { useAuth } from "./AuthContext";

export const CompareContext =
    createContext();


// ======================================================
// STORAGE KEY
// ======================================================

function getCompareStorageKey(uid) {
    return `careerOS_compare_${uid}`;
}


// ======================================================
// LOAD USER COMPARE LIST
// ======================================================

function loadCompareList(uid) {

    if (!uid) {
        return [];
    }

    try {

        const stored =
            localStorage.getItem(
                getCompareStorageKey(uid)
            );

        if (!stored) {
            return [];
        }

        const parsed =
            JSON.parse(stored);

        return Array.isArray(parsed)
            ? parsed.slice(0, 2)
            : [];

    } catch (error) {

        console.error(
            "CareerOS Compare load error:",
            error
        );

        return [];
    }
}


// ======================================================
// PROVIDER
// ======================================================

export function CompareProvider({
    children,
}) {

    const { user } =
        useAuth();

    const uid =
        user?.uid || null;


    // ==================================================
    // COMPARE LIST
    // ==================================================
    //
    // The list is initialized directly from localStorage
    // when the provider already has a user.
    //
    // This avoids calling setCompareList() synchronously
    // inside an effect.
    //
    // ==================================================

    const [
        compareList,
        setCompareList,
    ] = useState(() =>
        loadCompareList(uid)
    );


    // ==================================================
    // SAVE USER COMPARE LIST
    // ==================================================

    useEffect(() => {

        if (!uid) {
            return;
        }

        try {

            localStorage.setItem(
                getCompareStorageKey(uid),
                JSON.stringify(
                    compareList
                )
            );

        } catch (error) {

            console.error(
                "CareerOS Compare save error:",
                error
            );
        }

    }, [compareList, uid]);


    // ==================================================
    // TOGGLE COMPARE
    // ==================================================

    const toggleCompare =
        useCallback(
            (career) => {

                if (!uid || !career?.id) {
                    return;
                }

                setCompareList(
                    (currentList) => {

                        const exists =
                            currentList.some(
                                (item) =>
                                    String(
                                        item?.id
                                    ) ===
                                    String(
                                        career.id
                                    )
                            );


                        // ----------------------------------
                        // REMOVE
                        // ----------------------------------

                        if (exists) {

                            return currentList.filter(
                                (item) =>
                                    String(
                                        item?.id
                                    ) !==
                                    String(
                                        career.id
                                    )
                            );
                        }


                        // ----------------------------------
                        // MAX 2
                        // ----------------------------------

                        if (
                            currentList.length >= 2
                        ) {
                            return currentList;
                        }


                        // ----------------------------------
                        // ADD
                        // ----------------------------------

                        return [
                            ...currentList,
                            career,
                        ];
                    }
                );

            },
            [uid]
        );


    // ==================================================
    // CLEAR COMPARE
    // ==================================================

    const clearCompare =
        useCallback(() => {

            setCompareList([]);

        }, []);


    // ==================================================
    // CONTEXT
    // ==================================================

    return (
        <CompareContext.Provider
            value={{
                compareList,
                toggleCompare,
                clearCompare,
            }}
        >

            {children}

        </CompareContext.Provider>
    );
}