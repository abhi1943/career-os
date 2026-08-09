
function ApplicationFilters({

    search,

    setSearch,

    statusFilter,

    setStatusFilter,

}) {

    return (

        <div className="bg-white rounded-3xl shadow-lg p-6 mt-8">

            <div className="grid md:grid-cols-2 gap-5">

                <input

                    type="text"

                    placeholder="Search Company or Role"

                    value={search}

                    onChange={(e) =>
                        setSearch(e.target.value)
                    }

                    className="border rounded-xl p-3"

                />

                <select

                    value={statusFilter}

                    onChange={(e) =>
                        setStatusFilter(e.target.value)
                    }

                    className="border rounded-xl p-3"

                >

                    <option>All</option>

                    <option>Applied</option>

                    <option>Interview</option>

                    <option>Rejected</option>

                    <option>Offer</option>

                </select>

            </div>

        </div>

    );

}

export default ApplicationFilters;

