import {
  GraduationCap,
  BookOpen,
  Calendar,
  Trophy,
} from "lucide-react";

const stats = [
  {
    title: "Careers Explored",
    value: "24",
    icon: GraduationCap,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    title: "Saved Colleges",
    value: "8",
    icon: BookOpen,
    color: "text-green-600",
    bg: "bg-green-100",
  },
  {
    title: "Upcoming Exams",
    value: "3",
    icon: Calendar,
    color: "text-red-600",
    bg: "bg-red-100",
  },
  {
    title: "Roadmaps Completed",
    value: "5",
    icon: Trophy,
    color: "text-amber-600",
    bg: "bg-amber-100",
  },
];

function QuickStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg}`}
            >
              <Icon className={stat.color} size={28} />
            </div>

            <h2 className="mt-5 text-3xl font-bold">
              {stat.value}
            </h2>

            <p className="mt-1 text-gray-500">
              {stat.title}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default QuickStats;