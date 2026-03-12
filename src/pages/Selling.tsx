import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const salesData = [
  { day: "Mon", sales: 120 },
  { day: "Tue", sales: 200 },
  { day: "Wed", sales: 150 },
  { day: "Thu", sales: 250 },
  { day: "Fri", sales: 300 },
  { day: "Sat", sales: 280 },
  { day: "Sun", sales: 320 },
];

const recentSales = [
  { id: 1, invoice: "INV001", customer: "John", total: 120 },
  { id: 2, invoice: "INV002", customer: "Anna", total: 90 },
  { id: 3, invoice: "INV003", customer: "David", total: 160 },
];

const topProducts = [
  { name: "Premium Wall Paint", sold: 45 },
  { name: "Exterior Paint", sold: 32 },
  { name: "Interior White Paint", sold: 28 },
];

export default function Selling() {
  return (
    <div className="flex-1 overflow-y-auto p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">POS Dashboard</h1>

      <div className="grid md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Total Revenue</p>
          <h2 className="text-2xl font-bold">$12,450</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Today Sales</p>
          <h2 className="text-2xl font-bold">$1,240</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Total Orders</p>
          <h2 className="text-2xl font-bold">324</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Customers</p>
          <h2 className="text-2xl font-bold">98</h2>
        </div>
      </div>

      {/* Chart */}

      <div className="bg-white p-6 rounded-xl shadow mb-10">
        <h2 className="text-xl font-semibold mb-4">Weekly Sales</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="sales" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Top Products */}

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Top Selling Products</h2>

          <ul className="space-y-3">
            {topProducts.map((p, index) => (
              <li key={index} className="flex justify-between border-b pb-2">
                <span>{p.name}</span>
                <span className="font-semibold">{p.sold} sold</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent Sales */}

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Sales</h2>

          <table className="w-full text-left">
            <thead className="border-b">
              <tr>
                <th className="py-2">Invoice</th>
                <th>Customer</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>

            <tbody>
              {recentSales.map((sale) => (
                <tr key={sale.id} className="border-b hover:bg-gray-50">
                  <td className="py-2">{sale.invoice}</td>
                  <td>{sale.customer}</td>
                  <td className="text-right font-semibold">${sale.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
