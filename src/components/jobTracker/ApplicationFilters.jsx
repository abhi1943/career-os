function ApplicationFilters({
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
}) {
    function handleSearchChange(event) {
        setSearch(event.target.value);
    }

    function handleStatusChange(event) {
        setStatusFilter(event.target.value);
    }

    return (
        <div className="bg-white rounded-3xl shadow-lg p-6 mt-8">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* SEARCH */}
                <div>
                    <label
                        htmlFor="application-search"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                        Search Applications
                    </label>

                    <input
                        id="application-search"
                        type="text"
                        placeholder="Search company, role or location"
                        value={search}
                        onChange={handleSearchChange}
                        className="
                            w-full
                            border
                            border-gray-200
                            rounded-xl
                            px-4
                            py-3
                            text-gray-800
                            outline-none
                            placeholder:text-gray-400
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-100
                            transition
                        "
                    />
                </div>

                {/* STATUS */}
                <div>
                    <label
                        htmlFor="application-status"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                        Filter by Status
                    </label>

                    <select
                        id="application-status"
                        value={statusFilter}
                        onChange={handleStatusChange}
                        className="
                            w-full
                            border
                            border-gray-200
                            rounded-xl
                            px-4
                            py-3
                            text-gray-800
                            bg-white
                            outline-none
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-100
                            cursor-pointer
                            transition
                        "
                    >
                        <option value="All">
                            All Applications
                        </option>

                        <option value="Applied">
                            Applied
                        </option>

                        <option value="Interview">
                            Interview
                        </option>

                        <option value="Offer">
                            Offer
                        </option>

                        <option value="Rejected">
                            Rejected
                        </option>

                        <option value="Withdrawn">
                            Withdrawn
                        </option>
                    </select>
                </div>

            </div>

            {/* ACTIVE FILTER SUMMARY */}
            {(search.trim() || statusFilter !== "All") && (
                <div className="mt-4 flex flex-wrap items-center gap-2">

                    <span className="text-sm text-gray-500">
                        Active filters:
                    </span>

                    {search.trim() && (
                        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                            Search: {search.trim()}
                        </span>
                    )}

                    {statusFilter !== "All" && (
                        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                            Status: {statusFilter}
                        </span>
                    )}

                </div>
            )}

        </div>
    );
}

export default ApplicationFilters;