import { Briefcase, Building2, GraduationCap, FileText } from "lucide-react";

const stats = [
  {
    icon: GraduationCap,
    value: "500+",
    title: "Career Paths",
  },
  {
    icon: Building2,
    value: "1000+",
    title: "Colleges",
  },
  {
    icon: Briefcase,
    value: "5000+",
    title: "Companies",
  },
  {
    icon: FileText,
    value: "200+",
    title: "Entrance Exams",
  },
];

function StatsSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">

          <h2 className="text-4xl font-bold text-slate-800">
            Trusted Career Guidance Platform
          </h2>

          <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
            Helping students explore careers, colleges, entrance exams, and future opportunities—all in one place.
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="bg-white rounded-3xl shadow-lg p-8 text-center hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
              >
                <Icon className="w-12 h-12 mx-auto text-blue-600" />

                <h2 className="text-4xl font-bold mt-4">
                  {item.value}
                </h2>

                <p className="text-slate-500 mt-2">
                  {item.title}
                </p>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}

export default StatsSection;