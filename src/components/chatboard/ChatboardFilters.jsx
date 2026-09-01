import {
    Search,
} from "lucide-react";

function ChatboardFilters({
    search,
    category,
    onSearchChange,
    onCategoryChange,
}) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">

            <div className="flex flex-col md:flex-row gap-4">

                {/* Search */}
                <div className="relative flex-1">

                    <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={20}
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                            onSearchChange?.(
                                event.target.value
                            )
                        }
                        placeholder="Search discussions..."
                        className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />

                </div>

                {/* Category */}
                <select
                    value={category}
                    onChange={(event) =>
                        onCategoryChange?.(
                            event.target.value
                        )
                    }
                    className="md:w-52 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                    <option value="All">
                        All Categories
                    </option>

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

        </div>
    );
}

export default ChatboardFilters;