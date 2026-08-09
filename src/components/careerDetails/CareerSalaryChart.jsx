import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function CareerSalaryChart({ salary }) {
  if (!salary?.india) return null;

  const data = [
    {
      level: "Fresher",
      salary: Number(
        salary.india.fresher?.replace(/[^\d]/g, "") || 0
      ),
    },
    {
      level: "Experienced",
      salary: Number(
        salary.india.experienced?.replace(/[^\d]/g, "") || 0
      ),
    },
    {
      level: "Senior",
      salary: Number(
        salary.india.senior?.replace(/[^\d]/g, "") || 0
      ),
    },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 mt-10">

      <h2 className="text-2xl font-bold mb-6">
        📈 Salary Growth
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="4 4" />

          <XAxis dataKey="level" />

          <YAxis />

          <Tooltip />

          <Bar dataKey="salary" radius={[8,8,0,0]} />
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}

export default CareerSalaryChart;