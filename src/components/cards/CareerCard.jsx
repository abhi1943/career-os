import { Link } from "react-router-dom";
import { Clock3 } from "lucide-react";
import intermediateImg from "../../assets/images/careers/intermediate.svg";
import polytechnicImg from "../../assets/images/careers/polytechnic.svg";
import itiImg from "../../assets/images/careers/iti.svg";
import governmentImg from "../../assets/images/careers/government.svg";

const careerImages = {
    intermediate: intermediateImg,
    polytechnic: polytechnicImg,
    iti: itiImg,
    government: governmentImg,
};
function CareerCard({ career }) {
    const image = careerImages[career.id];
    return (
        <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">

            <div className="h-36 flex items-center justify-center bg-slate-50 p-4">

                <img
                    src={image}
                    alt={career.name}
                    className="w-24 h-24 object-contain transition-transform duration-300 hover:scale-105"
                />

            </div>

            <div className="p-6">

                <h3 className="text-2xl font-bold text-slate-800">
                    {career.name}
                </h3>

                <div className="flex items-center gap-2 text-blue-600">

                    <Clock3 size={18} />

                    <span className="flex items-center gap-2 text-blue-600 font-medium">{career.duration}</span>

                </div>

                <p className="text-gray-600 mt-4">
                    {career.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">

                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        {career.eligibility}
                    </span>

                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        {career.streams.length} Streams
                    </span>

                </div>

                <Link to={`/career/${career.id}`}>
                    <button className="mt-8 w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition">
                        Explore Career →
                    </button>
                </Link>

            </div>

        </div>
    );
}

export default CareerCard;