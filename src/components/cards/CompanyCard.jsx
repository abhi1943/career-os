import { MapPin, Star, Briefcase, IndianRupee } from "lucide-react";
import { Link } from "react-router-dom";

function CompanyCard({ company }) {
    return (
        <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">

            {/* Header */}

            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 text-center">

                <div className="text-5xl">
                    {company.logo}
                </div>

                <h2 className="text-2xl font-bold mt-3">
                    {company.shortName}
                </h2>

                <p className="opacity-90">
                    {company.name}
                </p>

            </div>

            {/* Body */}

            <div className="p-6 space-y-4">

                <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={18} />
                    <span>{company.location}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                    <Briefcase size={18} />
                    <span>{company.industry}</span>
                </div>

                <div className="flex items-center gap-2 text-yellow-500">
                    <Star size={18} fill="currentColor" />
                    <span>{company.rating}</span>
                </div>

                <div className="flex items-center gap-2 text-green-600">
                    <IndianRupee size={18} />
                    <span>{company.package}</span>
                </div>

                {/* Skills */}

                <div>
                    <h3 className="font-semibold mb-2">
                        Skills
                    </h3>

                    <div className="flex flex-wrap gap-2">

                        {company.skills.map((skill) => (
                            <span
                                key={skill}
                                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                            >
                                {skill}
                            </span>
                        ))}

                    </div>
                </div>

                <Link to={`/companies/${company.id}`}>
                    <button className="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition">
                        View Company →
                    </button>
                </Link>

            </div>

        </div>
    );
}

export default CompanyCard;