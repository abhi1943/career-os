import {
    Send,
} from "lucide-react";

import {
    useState,
} from "react";

function ChatboardComposer({
    onSubmit,
    submitting = false,
}) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("General");

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (
            !title.trim() ||
            !content.trim()
        ) {
            return;
        }

        const success = await onSubmit?.({
            title: title.trim(),
            content: content.trim(),
            category,
        });

        if (success) {
            setTitle("");
            setContent("");
            setCategory("General");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
        >

            <div className="flex items-center justify-between mb-5">

                <div>
                    <h2 className="text-xl font-bold text-slate-900">
                        Start a Discussion
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                        Ask questions, share experiences, or help other students.
                    </p>
                </div>

            </div>

            {/* Title */}
            <div className="mb-4">

                <label
                    htmlFor="chatboard-title"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                >
                    Discussion Title
                </label>

                <input
                    id="chatboard-title"
                    type="text"
                    value={title}
                    onChange={(event) =>
                        setTitle(event.target.value)
                    }
                    placeholder="What would you like to discuss?"
                    maxLength={150}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={submitting}
                />

            </div>

            {/* Category */}
            <div className="mb-4">

                <label
                    htmlFor="chatboard-category"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                >
                    Category
                </label>

                <select
                    id="chatboard-category"
                    value={category}
                    onChange={(event) =>
                        setCategory(event.target.value)
                    }
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    disabled={submitting}
                >
                    <option value="General">
                        General
                    </option>

                    <option value="Careers">
                        Careers
                    </option>

                    <option value="Colleges">
                        Colleges
                    </option>

                    <option value="Exams">
                        Exams
                    </option>

                    <option value="Jobs">
                        Jobs
                    </option>

                    <option value="Skills">
                        Skills
                    </option>

                    <option value="Interview">
                        Interview
                    </option>

                    <option value="Other">
                        Other
                    </option>
                </select>

            </div>

            {/* Content */}
            <div className="mb-5">

                <label
                    htmlFor="chatboard-content"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                >
                    Message
                </label>

                <textarea
                    id="chatboard-content"
                    value={content}
                    onChange={(event) =>
                        setContent(event.target.value)
                    }
                    placeholder="Write your question or message..."
                    rows={5}
                    maxLength={5000}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={submitting}
                />

            </div>

            <div className="flex justify-end">

                <button
                    type="submit"
                    disabled={
                        submitting ||
                        !title.trim() ||
                        !content.trim()
                    }
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition"
                >

                    <Send className="w-4 h-4" />

                    {submitting
                        ? "Posting..."
                        : "Post Discussion"}

                </button>

            </div>

        </form>
    );
}

export default ChatboardComposer;