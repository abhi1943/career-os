import { Link } from "react-router-dom";
import { useContext } from "react";
import { FavoritesContext } from "../../context/FavoritesContext";
import { CompareContext } from "../../context/CompareContext";

import {
  Clock3,
  IndianRupee,
  TrendingUp,
  Star,
  Heart,
  Scale,
} from "lucide-react";

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

  // Favorites
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);
  const favorite = isFavorite(career.id);

  // Compare
  const { compareList, toggleCompare } = useContext(CompareContext);

  const selected = compareList.some(
    (item) => item.id === career.id
  );

  return (
    <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">

      {/* Header */}

      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-6">

        <div className="flex justify-between items-start">

          <div>

            <h3 className="text-2xl font-bold">
              {career.icon || "🎓"} {career.name}
            </h3>

            <p className="text-blue-100 mt-2">
              {career.category || "Career Path"}
            </p>

          </div>

          <button
            onClick={() => toggleFavorite(career)}
            className="bg-white/20 p-2 rounded-xl hover:bg-white/30 transition"
          >
            <Heart
              size={20}
              fill={favorite ? "currentColor" : "none"}
              className={favorite ? "text-red-500" : "text-white"}
            />
          </button>

        </div>

      </div>

      {/* Image */}

      <div className="h-36 flex items-center justify-center bg-slate-50">

        {image ? (
          <img
            src={image}
            alt={career.name}
            className="w-24 h-24 object-contain"
          />
        ) : (
          <span className="text-6xl">
            {career.icon || "💼"}
          </span>
        )}

      </div>

      {/* Content */}

      <div className="p-6">

        <div className="flex items-center justify-between">

          <span className="flex items-center gap-1 text-yellow-500 font-semibold">
            <Star size={18} fill="currentColor" />
            {career.rating || "4.5"}
          </span>

          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
            {career.growth || "High"}
          </span>

        </div>

        <div className="mt-5 space-y-3">

          <div className="flex items-center gap-2">
            <Clock3 size={18} className="text-blue-600" />
            <span>{career.duration}</span>
          </div>

          <div className="flex items-center gap-2">
            <IndianRupee size={18} className="text-green-600" />
            <span>{career.averageSalary || "Not Available"}</span>
          </div>

          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-orange-500" />
            <span>{career.eligibility}</span>
          </div>

        </div>

        <p className="text-gray-600 mt-5">
          {career.description}
        </p>

        {/* Skills */}

        <div className="flex flex-wrap gap-2 mt-5">

          {(career.skills || []).slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}

        </div>

        {/* Buttons */}

        <div className="grid grid-cols-2 gap-3 mt-6">

          {/* Save */}

          <button
            onClick={() => toggleFavorite(career)}
            className={`rounded-xl py-3 flex items-center justify-center gap-2 transition ${
              favorite
                ? "bg-red-500 text-white"
                : "border border-gray-300 hover:bg-gray-100"
            }`}
          >
            <Heart
              size={18}
              fill={favorite ? "currentColor" : "none"}
            />
            {favorite ? "Saved" : "Save"}
          </button>

          {/* Compare */}

          <button
            onClick={() => toggleCompare(career)}
            className={`rounded-xl py-3 flex items-center justify-center gap-2 transition ${
              selected
                ? "bg-indigo-600 text-white"
                : "border border-gray-300 hover:bg-gray-100"
            }`}
          >
            <Scale size={18} />
            {selected ? "Selected" : "Compare"}
          </button>

        </div>

        {/* Explore */}

        <Link to={`/career/${career.id}`}>
          <button className="mt-5 w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-semibold">
            Explore Career →
          </button>
        </Link>

      </div>

    </div>
  );
}

export default CareerCard;