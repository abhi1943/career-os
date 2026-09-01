
/* eslint-disable react-refresh/only-export-components */

import {
    createContext,
    useCallback,
    useEffect,
    useState,
} from "react";

import { useAuth } from "./AuthContext";

export const FavoritesContext =
    createContext();


// ======================================================
// STORAGE HELPERS
// ======================================================

function getStorageKey(uid) {
    return `careerOS_saved_careers_${uid}`;
}


// ======================================================
// LOAD USER FAVORITES
// ======================================================

function loadFavorites(uid) {
    if (!uid) {
        return [];
    }

    try {
        const key =
            getStorageKey(uid);

        const stored =
            localStorage.getItem(key);

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
            "CareerOS Favorites load error:",
            error
        );

        return [];
    }
}


// ======================================================
// PROVIDER
// ======================================================

export function FavoritesProvider({
    children,
}) {
    const { user } =
        useAuth();

    const uid =
        user?.uid || null;


    // ==================================================
    // FAVORITES
    // ==================================================

    const [
        favorites,
        setFavorites,
    ] = useState(() => loadFavorites(uid));


    // ==================================================
    // SAVE FAVORITES TO USER-SPECIFIC STORAGE
    // ==================================================

    useEffect(() => {
        if (!uid) {
            return;
        }

        try {
            const key =
                getStorageKey(uid);

            localStorage.setItem(
                key,
                JSON.stringify(
                    favorites
                )
            );

        } catch (error) {
            console.error(
                "CareerOS Favorites save error:",
                error
            );
        }

    }, [favorites, uid]);


    // ==================================================
    // TOGGLE FAVORITE
    // ==================================================

    const toggleFavorite =
        useCallback((item) => {

            if (!uid || !item) {
                return;
            }

            const itemId =
                item?.id ||
                item?.careerId;

            if (!itemId) {
                return;
            }

            const normalizedId =
                String(itemId);

            setFavorites(
                (currentFavorites) => {

                    const exists =
                        currentFavorites.some(
                            (favorite) =>
                                String(
                                    favorite?.id ||
                                    favorite?.careerId
                                ) ===
                                normalizedId
                        );

                    // --------------------------------------
                    // REMOVE
                    // --------------------------------------

                    if (exists) {
                        return currentFavorites.filter(
                            (favorite) =>
                                String(
                                    favorite?.id ||
                                    favorite?.careerId
                                ) !==
                                normalizedId
                        );
                    }

                    // --------------------------------------
                    // ADD
                    // --------------------------------------

                    return [
                        ...currentFavorites,
                        {
                            ...item,
                            id: normalizedId,
                        },
                    ];
                }
            );

        }, [uid]);


    // ==================================================
    // CHECK FAVORITE
    // ==================================================

    const isFavorite =
        useCallback((id) => {

            if (!id) {
                return false;
            }

            const normalizedId =
                String(id);

            return favorites.some(
                (favorite) =>
                    String(
                        favorite?.id ||
                        favorite?.careerId
                    ) ===
                    normalizedId
            );

        }, [favorites]);


    // ==================================================
    // CLEAR USER FAVORITES
    // ==================================================

    const clearFavorites =
        useCallback(() => {

            setFavorites([]);

        }, []);


    // ==================================================
    // CONTEXT
    // ==================================================

    return (
        <FavoritesContext.Provider
            value={{
                favorites,
                toggleFavorite,
                isFavorite,
                clearFavorites,
            }}
        >
            {children}
        </FavoritesContext.Provider>
    );
}
  
