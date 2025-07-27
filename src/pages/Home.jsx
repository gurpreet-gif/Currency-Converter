import { useState, useEffect } from "react";
import ConverterForm from "../components/ConverterForm";
import ExchangeChart from "../components/ExchangeChart";

const Home = () => {
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    fetch(`https://api.frankfurter.app/currencies`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Frankfurter API currencies data:", data); // Log the full data object
        if (data) {
          setCurrencies(Object.keys(data).sort());
        } else {
          setError("Invalid API response: currencies not found.");
        }
        setLoading(false); // Set loading to false after currencies are fetched
      })
      .catch((err) => {
        console.error("Error fetching currencies:", err); // Log any fetch errors
        setError(err.message); // Set error message
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-xl dark:text-white">Loading currencies...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-xl text-red-600 dark:text-red-400">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 dark:text-white mb-6 sm:mb-8">Currency Converter</h1>
        <ConverterForm
          from={from}
          to={to}
          setFrom={setFrom}
          setTo={setTo}
          currencies={currencies}
        />
        <ExchangeChart
          from={from}
          to={to}
          currencies={currencies}
        />
      </div>
    </div>
  );
};

export default Home;