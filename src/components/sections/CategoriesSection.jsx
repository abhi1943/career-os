import {
Laptop,
HeartPulse,
Scale,
Landmark,
Briefcase,
Wrench,
Palette,
Plane,
} from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
{
title: "Engineering",
icon: Laptop,
color: "bg-blue-100 text-blue-600",
description: "Technology, engineering and technical careers.",
},
{
title: "Medical",
icon: HeartPulse,
color: "bg-red-100 text-red-600",
description: "Medical, healthcare and life-science careers.",
},
{
title: "Law",
icon: Scale,
color: "bg-yellow-100 text-yellow-700",
description: "Law, legal studies and professional careers.",
},
{
title: "Government",
icon: Landmark,
color: "bg-green-100 text-green-600",
description: "Government jobs, exams and public services.",
},
{
title: "Business",
icon: Briefcase,
color: "bg-purple-100 text-purple-600",
description: "Business, management and entrepreneurship.",
},
{
title: "ITI & Technical",
icon: Wrench,
color: "bg-orange-100 text-orange-600",
description: "Practical skills and technical career paths.",
},
{
title: "Arts & Design",
icon: Palette,
color: "bg-pink-100 text-pink-600",
description: "Creative, design and media careers.",
},
{
title: "Aviation",
icon: Plane,
color: "bg-cyan-100 text-cyan-600",
description: "Aviation, airline and airport careers.",
},
];

function CategoriesSection() {
return (
<section className="py-20 bg-white">

  <div className="max-w-7xl mx-auto px-6">

    <div className="text-center max-w-3xl mx-auto">

      <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
        CAREER PATHS
      </span>

      <h2 className="text-4xl md:text-5xl font-bold mt-5">
        Explore Career Categories
      </h2>

      <p className="text-slate-500 mt-4 text-lg">
        Discover careers, education paths, entrance exams and
        opportunities based on your interests.
      </p>

    </div>

    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">

      {categories.map((item) => {

        const Icon = item.icon;

        return (
          <Link
            key={item.title}
            to="/careers"
            className="group bg-white border border-slate-200 rounded-3xl p-7 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
          >

            <div
              className={`${item.color} w-16 h-16 rounded-2xl flex items-center justify-center`}
            >
              <Icon size={30} />
            </div>

            <h3 className="text-xl font-bold mt-6 group-hover:text-blue-600 transition">
              {item.title}
            </h3>

            <p className="text-slate-500 mt-3 text-sm leading-6">
              {item.description}
            </p>

            <div className="mt-5 text-blue-600 font-semibold text-sm">
              Explore careers →
            </div>

          </Link>
        );

      })}

    </div>

  </div>

</section>

);
}

export default CategoriesSection;
