import { useEffect, useState } from "react";
import {
    Wifi,
    WifiOff,
} from "lucide-react";

function OnlineStatusIndicator() {
    const [isOnline, setIsOnline] =
        useState(
            () => navigator.onLine
        );

    useEffect(() => {
        function handleOnline() {
            setIsOnline(true);
        }

        function handleOffline() {
            setIsOnline(false);
        }

        window.addEventListener(
            "online",
            handleOnline
        );

        window.addEventListener(
            "offline",
            handleOffline
        );

        return () => {
            window.removeEventListener(
                "online",
                handleOnline
            );

            window.removeEventListener(
                "offline",
                handleOffline
            );
        };
    }, []);

    return (
        <div
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold ${
                isOnline
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
            }`}
        >
            {isOnline ? (
                <Wifi size={16} />
            ) : (
                <WifiOff size={16} />
            )}

            <span>
                {isOnline
                    ? "Online"
                    : "Offline"}
            </span>
        </div>
    );
}

export default OnlineStatusIndicator;