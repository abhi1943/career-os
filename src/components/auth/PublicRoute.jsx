
import {
    Navigate,
} from "react-router-dom";

import {
    useAuth,
} from "../../context/AuthContext";

function PublicRoute({
    children,
}) {

    const {
        user,
        authLoading,
    } = useAuth();

    // ======================================================
    // WAIT FOR FIREBASE AUTH
    // ======================================================

    if (authLoading) {

        return (
            <div
                className="
                    min-h-screen
                    bg-slate-50
                    flex
                    items-center
                    justify-center
                "
                role="status"
                aria-live="polite"
            >

                <div className="text-center">

                    <div
                        className="
                            w-12
                            h-12
                            border-4
                            border-blue-200
                            border-t-blue-600
                            rounded-full
                            animate-spin
                            mx-auto
                        "
                        aria-hidden="true"
                    />

                    <p className="mt-4 text-gray-600 font-medium">
                        Loading CareerOS...
                    </p>

                </div>

            </div>
        );

    }

    // ======================================================
    // USER ALREADY LOGGED IN
    // ======================================================

    if (user) {

        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );

    }

    // ======================================================
    // USER NOT LOGGED IN
    // ======================================================

    return children;
}

export default PublicRoute;

