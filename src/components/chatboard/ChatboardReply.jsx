import { User } from "lucide-react";

function ChatboardReply({
    reply,
}) {
    return (
        <div className="flex gap-3">

            <div className="w-9 h-9 shrink-0 rounded-full bg-slate-100 flex items-center justify-center">
                <User className="w-4 h-4 text-slate-500" />
            </div>

            <div className="flex-1 bg-slate-50 rounded-xl p-4">

                <div className="flex items-center justify-between gap-3">

                    <p className="font-semibold text-slate-800">
                        {reply.authorName || "CareerOS Student"}
                    </p>

                    {reply.createdAt && (
                        <span className="text-xs text-slate-400">
                            {formatDate(reply.createdAt)}
                        </span>
                    )}

                </div>

                <p className="text-sm text-slate-600 mt-2 whitespace-pre-wrap leading-relaxed">
                    {reply.content}
                </p>

            </div>

        </div>
    );
}

function formatDate(timestamp) {
    try {
        if (!timestamp) {
            return "";
        }

        const date =
            timestamp?.toDate
                ? timestamp.toDate()
                : new Date(timestamp);

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
            }
        );
    } catch {
        return "";
    }
}

export default ChatboardReply;