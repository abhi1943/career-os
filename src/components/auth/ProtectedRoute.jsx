import {
    Navigate,
    useLocation,
} from "react-router-dom";

import {
    useAuth,
} from "../../context/AuthContext";

function ProtectedRoute({
    children,
}) {

    const {
        user,
        authLoading,
    } = useAuth();

    const location =
        useLocation();

    // ======================================================
    // WAIT FOR FIREBASE AUTH
    // ======================================================

    if (authLoading) {

        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">

                <div className="text-center">

                    <div className="
                        w-12
                        h-12
                        border-4
                        border-blue-200
                        border-t-blue-600
                        rounded-full
                        animate-spin
                        mx-auto
                    " />

                    <p className="mt-4 text-gray-600 font-medium">
                        Loading CareerOS...
                    </p>

                </div>

            </div>
        );

    }

    // ======================================================
    // USER NOT LOGGED IN
    // ======================================================

    if (!user) {

        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location.pathname,
                }}
            />
        );

    }

    // ======================================================
    // USER LOGGED IN
    // ======================================================

    return children;
}

export default ProtectedRoute;