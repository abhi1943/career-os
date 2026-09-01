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
        salary.india.fresher?.replace(
          /[^\d]/g,
          ""
        ) || 0
      ),
    },
    {
      level: "Experienced",
      salary: Number(
        salary.india.experienced?.replace(
          /[^\d]/g,
          ""
        ) || 0
      ),
    },
    {
      level: "Senior",
      salary: Number(
        salary.india.senior?.replace(
          /[^\d]/g,
          ""
        ) || 0
      ),
    },
  ];

  return (
    <section
      aria-labelledby="salary-growth-heading"
      className="
        bg-white
        rounded-2xl
        sm:rounded-3xl
        shadow-lg
        border
        border-gray-100
        p-4
        sm:p-8
        mt-8
        sm:mt-10
        overflow-hidden
      "
    >

      <h3
        id="salary-growth-heading"
        className="text-xl sm:text-2xl font-bold mb-5 sm:mb-6 text-slate-800"
      >
        📈 Salary Growth
      </h3>

      <p
        id="salary-chart-description"
        className="text-sm text-gray-500 mb-4"
      >
        Salary comparison between fresher,
        experienced, and senior career levels
        in India.
      </p>

      <div
        className="w-full min-w-0"
        role="img"
        aria-labelledby="salary-growth-heading salary-chart-description"
      >
        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 10,
            }}
          >

            <CartesianGrid
              strokeDasharray="4 4"
            />

            <XAxis
              dataKey="level"
              tick={{
                fontSize: 12,
              }}
              interval={0}
            />

            <YAxis
              tick={{
                fontSize: 12,
              }}
              width={45}
            />

            <Tooltip />

            <Bar
              dataKey="salary"
              radius={[8, 8, 0, 0]}
            />

          </BarChart>
        </ResponsiveContainer>
      </div>

    </section>
  );
}

export default CareerSalaryChart;