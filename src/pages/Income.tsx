import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const salesData = [
  { month: "Jan", sales: 120 },
  { month: "Feb", sales: 200 },
  { month: "March", sales: 150 },
  { month: "April", sales: 250 },
  { month: "May", sales: 300 },
  { month: "Jun", sales: 280 },
  { month: "July", sales: 320 },
  { month: "Aug", sales: 250 },
  { month: "Sep", sales: 300 },
  { month: "Oct", sales: 280 },
  { month: "Nov", sales: 320 },
  { month: "Dec", sales: 350 },
];

export default function Dashboard() {
  return (
    <div className="flex-1 overflow-y-auto p-5 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-5">Income</h1>

      <div className="grid md:grid-cols-4 gap-6 mb-5">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Total Revenue</p>
          <h2 className="text-2xl font-bold">12,4500 K</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Tomonth Sales</p>
          <h2 className="text-2xl font-bold">1,24000 K</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Total Orders</p>
          <h2 className="text-2xl font-bold">324</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Customers</p>
          <h2 className="text-2xl font-bold">234</h2>
        </div>
      </div>

      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-lg font-semibold text-gray-700">
            Monthly Income
          </h2>
          <p className="text-sm text-gray-400">Sales performance overview</p>
        </div>

        <div className="text-sm bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg">
          2026
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={salesData} barSize={42}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e5e7eb"
          />

          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fontSize: 12, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            cursor={{ fill: "rgba(99,102,241,0.1)" }}
            contentStyle={{
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            }}
          />

          <Bar dataKey="sales" fill="#6366f1" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
