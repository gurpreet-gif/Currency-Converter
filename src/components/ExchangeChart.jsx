import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const ExchangeChart = ({ from, to }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - 7);

    const formatDate = (d) => d.toISOString().split("T")[0];

    if (from && to) {
      fetch(`https://api.frankfurter.app/${formatDate(startDate)}..${formatDate(today)}?from=${from}&to=${to}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((json) => {
          console.log("Frankfurter API chart data:", json); // Debug log
          if (json && json.rates) {
            const chartData = Object.entries(json.rates).map(([date, rates]) => ({
              date,
              value: rates[to],
            }));
            setData(chartData);
          } else {
            setError("Invalid API response: 'rates' not found.");
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching chart data:", err); // Log any fetch errors
          setError(err.message);
          setLoading(false);
        });
    }
  }, [from, to]);

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md max-w-2xl mx-auto mt-6 sm:mt-8 dark:bg-gray-800 min-h-[400px]">
      {console.log("Data passed to chart:", data)}
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4 dark:text-white">Exchange Rate Chart ({from} to {to})</h2>
      {loading && <p className="text-center text-gray-800 dark:text-white">Loading chart data...</p>}
      {error && <p className="text-center text-red-600 dark:text-red-400">Error: {error}</p>}
      {!loading && !error && data.length > 0 && (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <XAxis dataKey="date" stroke={isDarkMode ? "#cccccc" : "#888888"} tick={{ fill: isDarkMode ? "#cccccc" : "#888888" }} />
            <YAxis stroke={isDarkMode ? "#cccccc" : "#888888"} tick={{ fill: isDarkMode ? "#cccccc" : "#888888" }} />
            <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#555' : '#fff', border: 'none' }} itemStyle={{ color: isDarkMode ? '#fff' : '#333' }} />
            <Legend wrapperStyle={{ color: isDarkMode ? '#fff' : '#333' }} />
            <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2} name={`${from} to ${to}`} isAnimationActive={true} animationDuration={1500} />
          </LineChart>
        </ResponsiveContainer>
      )}
      {!loading && !error && data.length === 0 && (
        <p className="text-center text-gray-800 dark:text-white">No chart data available for the selected currencies.</p>
      )}
    </div>
  );
};

export default ExchangeChart;
