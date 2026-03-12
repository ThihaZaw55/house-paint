export default function ReviewSection() {
  const stats = [
    {
      value: "100%",
      label: "Client Satisfaction",
    },
    {
      value: "24 h",
      label: "Claim Resolution Time",
    },
    {
      value: "08+",
      label: "Years Experience",
    },
    {
      value: "120 m",
      label: "Total Transactions",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Trusted by Thousands of Happy Clients
        </h2>
        <p className="text-gray-500 mb-12 max-w-2xl mx-auto">
          We deliver exceptional real estate services with transparency,
          professionalism, and proven results.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-10 hover:shadow-2xl transition duration-300"
            >
              <h3 className="text-4xl font-bold mb-3">{item.value}</h3>
              <p className="text-gray-600 font-medium">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
