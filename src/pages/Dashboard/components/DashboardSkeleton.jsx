function SkeletonBlock({
    className = "",
}) {
    return (
        <div
            className={`
                animate-pulse
                bg-gray-200
                rounded-xl
                ${className}
            `}
        />
    );
}

function DashboardSkeleton() {
    return (
        <div className="min-h-screen bg-slate-100 py-6 sm:py-8 lg:py-10 xl:py-12">

            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

                {/* ==================================================
                    WELCOME BANNER SKELETON
                ================================================== */}

                <section className="rounded-3xl bg-white shadow-sm border border-gray-100 p-8">

                    <div className="flex flex-col lg:flex-row justify-between gap-8">

                        <div className="flex-1">

                            <SkeletonBlock className="h-5 w-32" />

                            <SkeletonBlock className="h-10 w-72 mt-4" />

                            <SkeletonBlock className="h-5 w-full max-w-xl mt-4" />

                            <SkeletonBlock className="h-5 w-4/5 max-w-lg mt-2" />

                        </div>

                        <div className="w-full lg:w-72 rounded-2xl bg-gray-50 p-6">

                            <SkeletonBlock className="h-5 w-36" />

                            <SkeletonBlock className="h-3 w-full mt-5 rounded-full" />

                            <SkeletonBlock className="h-5 w-28 mt-4" />

                            <SkeletonBlock className="h-10 w-44 mt-5" />

                        </div>

                    </div>

                </section>


                {/* ==================================================
                    ACCOUNT OVERVIEW
                ================================================== */}

                <section>

                    <div className="mb-5">

                        <SkeletonBlock className="h-4 w-32" />

                        <SkeletonBlock className="h-8 w-64 mt-2" />

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

                        {[1, 2, 3].map((item) => (

                            <div
                                key={item}
                                className="h-[180px] bg-white rounded-3xl shadow-sm border border-gray-100 p-6"
                            >

                                <SkeletonBlock className="h-4 w-28" />

                                <SkeletonBlock className="h-10 w-24 mt-4" />

                                <SkeletonBlock className="h-2 w-full mt-8" />

                            </div>

                        ))}

                    </div>

                </section>


                {/* ==================================================
                    QUICK STATS
                ================================================== */}

                <section>

                    <div className="mb-5">

                        <SkeletonBlock className="h-4 w-24" />

                        <SkeletonBlock className="h-8 w-60 mt-2" />

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                        {[1, 2, 3, 4].map((item) => (

                            <div
                                key={item}
                                className="h-[140px] bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex items-center justify-between"
                            >

                                <div>

                                    <SkeletonBlock className="h-4 w-28" />

                                    <SkeletonBlock className="h-9 w-16 mt-3" />

                                </div>

                                <SkeletonBlock className="w-12 h-12 rounded-2xl" />

                            </div>

                        ))}

                    </div>

                </section>


                {/* ==================================================
                    CAREER JOURNEY
                ================================================== */}

                <section>

                    <div className="mb-5">

                        <SkeletonBlock className="h-4 w-32" />

                        <SkeletonBlock className="h-8 w-64 mt-2" />

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {[1, 2, 3].map((item) => (

                            <div
                                key={item}
                                className="h-[520px] bg-white rounded-3xl shadow-sm border border-gray-100 p-8"
                            >

                                <SkeletonBlock className="w-24 h-24 rounded-full mx-auto" />

                                <SkeletonBlock className="h-7 w-40 mx-auto mt-5" />

                                <SkeletonBlock className="h-4 w-28 mx-auto mt-2" />

                                <SkeletonBlock className="h-4 w-full mt-8" />

                                <SkeletonBlock className="h-4 w-4/5 mt-3" />

                                <SkeletonBlock className="h-3 w-full mt-8" />

                                <SkeletonBlock className="h-3 w-full mt-4" />

                                <SkeletonBlock className="h-3 w-4/5 mt-4" />

                            </div>

                        ))}

                    </div>

                </section>


                {/* ==================================================
                    GOAL + SAVED CAREERS
                ================================================== */}

                <section>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {[1, 2].map((item) => (

                            <div
                                key={item}
                                className="h-[420px] bg-white rounded-3xl shadow-sm border border-gray-100 p-8"
                            >

                                <SkeletonBlock className="h-7 w-40" />

                                <SkeletonBlock className="h-10 w-64 mt-8" />

                                <SkeletonBlock className="h-4 w-32 mt-5" />

                                <SkeletonBlock className="h-4 w-full mt-3" />

                                <SkeletonBlock className="h-4 w-4/5 mt-3" />

                                <SkeletonBlock className="h-4 w-3/5 mt-3" />

                                <SkeletonBlock className="h-4 w-full mt-10" />

                            </div>

                        ))}

                    </div>

                </section>


                {/* ==================================================
                    SAVED JOBS
                ================================================== */}

                <section>

                    <SkeletonBlock className="h-4 w-24" />

                    <SkeletonBlock className="h-8 w-48 mt-2" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">

                        {[1, 2, 3, 4].map((item) => (

                            <div
                                key={item}
                                className="h-[280px] bg-white rounded-2xl border border-gray-100 p-5"
                            >

                                <SkeletonBlock className="h-6 w-3/4" />

                                <SkeletonBlock className="h-4 w-1/2 mt-3" />

                                <div className="flex gap-2 mt-5">

                                    <SkeletonBlock className="h-8 w-28 rounded-full" />

                                    <SkeletonBlock className="h-8 w-32 rounded-full" />

                                </div>

                                <SkeletonBlock className="h-4 w-full mt-6" />

                                <SkeletonBlock className="h-4 w-5/6 mt-2" />

                                <SkeletonBlock className="h-10 w-full mt-8" />

                            </div>

                        ))}

                    </div>

                </section>


                {/* ==================================================
                    CONTINUE EXPLORING
                ================================================== */}

                <section>

                    <div className="mb-5">

                        <SkeletonBlock className="h-4 w-24" />

                        <SkeletonBlock className="h-8 w-56 mt-2" />

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                        {[1, 2, 3].map((item) => (

                            <div
                                key={item}
                                className="h-[400px] bg-white rounded-3xl border border-gray-100 p-8"
                            >

                                <SkeletonBlock className="h-7 w-48" />

                                <SkeletonBlock className="h-4 w-32 mt-3" />

                                <SkeletonBlock className="h-5 w-full mt-8" />

                                <SkeletonBlock className="h-5 w-5/6 mt-3" />

                                <SkeletonBlock className="h-5 w-4/6 mt-3" />

                                <SkeletonBlock className="h-10 w-full mt-10" />

                            </div>

                        ))}

                    </div>

                </section>


                {/* ==================================================
                    RECENT ACTIVITY
                ================================================== */}

                <section>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {[1, 2].map((item) => (

                            <div
                                key={item}
                                className="h-[400px] bg-white rounded-3xl border border-gray-100 p-8"
                            >

                                <SkeletonBlock className="h-7 w-48" />

                                <SkeletonBlock className="h-4 w-32 mt-3" />

                                <SkeletonBlock className="h-5 w-full mt-8" />

                                <SkeletonBlock className="h-5 w-5/6 mt-3" />

                                <SkeletonBlock className="h-5 w-4/6 mt-3" />

                                <SkeletonBlock className="h-10 w-full mt-10" />

                            </div>

                        ))}

                    </div>

                </section>


                {/* ==================================================
                    LIVE JOB OPENINGS
                ================================================== */}

                <section>

                    <SkeletonBlock className="h-4 w-32" />

                    <SkeletonBlock className="h-8 w-64 mt-2" />

                    <SkeletonBlock className="h-4 w-full max-w-xl mt-3" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">

                        {[1, 2].map((item) => (

                            <div
                                key={item}
                                className="h-[260px] bg-white rounded-2xl border border-gray-100 p-6"
                            >

                                <SkeletonBlock className="h-6 w-3/4" />

                                <SkeletonBlock className="h-4 w-1/2 mt-3" />

                                <SkeletonBlock className="h-4 w-full mt-6" />

                                <SkeletonBlock className="h-4 w-5/6 mt-2" />

                                <SkeletonBlock className="h-10 w-full mt-8" />

                            </div>

                        ))}

                    </div>

                </section>

            </div>

        </div>
    );
}

export default DashboardSkeleton;