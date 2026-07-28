import {
  Laptop,
  HeartPulse,
  Scale,
  Landmark,
  Briefcase,
  Wrench,
  Palette,
  Plane
} from "lucide-react";

const categories = [
  {
    title: "Engineering",
    icon: Laptop,
    color: "bg-blue-100"
  },
  {
    title: "Medical",
    icon: HeartPulse,
    color: "bg-red-100"
  },
  {
    title: "Law",
    icon: Scale,
    color: "bg-yellow-100"
  },
  {
    title: "Government",
    icon: Landmark,
    color: "bg-green-100"
  },
  {
    title: "Business",
    icon: Briefcase,
    color: "bg-purple-100"
  },
  {
    title: "ITI & Technical",
    icon: Wrench,
    color: "bg-orange-100"
  },
  {
    title: "Arts & Design",
    icon: Palette,
    color: "bg-pink-100"
  },
  {
    title: "Aviation",
    icon: Plane,
    color: "bg-cyan-100"
  }
];

function CategoriesSection() {
  return (
    <section className="py-20 bg-white">

      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-5xl font-bold text-center">
          Explore Career Categories
        </h2>

        <p className="text-center text-slate-500 mt-4">
          Choose a category to discover careers, colleges, exams and companies.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">

          {categories.map((item) => {

            const Icon = item.icon;

            return (

              <div
                key={item.title}
                className="rounded-3xl shadow-lg hover:shadow-2xl transition hover:-translate-y-2 bg-white p-8 cursor-pointer"
              >

                <div className={`${item.color} w-16 h-16 rounded-2xl flex items-center justify-center`}>

                  <Icon className="text-blue-700" size={32} />

                </div>

                <h3 className="text-2xl font-bold mt-6">

                  {item.title}

                </h3>

                <p className="text-slate-500 mt-3">

                  Explore career opportunities.

                </p>

              </div>

            );

          })}

        </div>

      </div>

    </section>
  );
}

export default CategoriesSection;