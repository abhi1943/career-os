/* eslint-disable react-refresh/only-export-components */

import {
    createContext,
    useState,
} from "react";

export const CompareContext =
    createContext();

export function CompareProvider({
    children,
}) {
    const [
        compareList,
        setCompareList,
    ] = useState([]);

    function toggleCompare(career) {
        const exists =
            compareList.find(
                (item) =>
                    item.id === career.id
            );

        if (exists) {
            setCompareList(
                compareList.filter(
                    (item) =>
                        item.id !== career.id
                )
            );
            return;
        }

        if (compareList.length >= 2) {
            return;
        }

        setCompareList([
            ...compareList,
            career,
        ]);
    }

    function clearCompare() {
        setCompareList([]);
    }

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
