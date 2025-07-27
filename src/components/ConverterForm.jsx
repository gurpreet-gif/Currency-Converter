import { useState, useEffect } from "react";

const ConverterForm = ({ from, to, setFrom, setTo, currencies }) => {
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD

  useEffect(() => {
    const convertCurrency = async () => {
      if (amount === "" || isNaN(amount) || amount <= 0) {
        setResult(null);
        return;
      }
      setLoading(true);
      try {
        const dateParam = selectedDate === new Date().toISOString().split('T')[0] ? 'latest' : selectedDate;
        const response = await fetch(`https://api.frankfurter.app/${dateParam}?from=${from}&to=${to}&amount=${amount}`);
        const data = await response.json();
        setResult(data.rates[to]);
      } catch (error) {
        console.error("Error fetching conversion:", error);
        setResult(null);
      } finally {
        setLoading(false);
      }
    };

    convertCurrency();
  }, [amount, from, to, selectedDate]);

  const handleSwapCurrencies = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <form className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto dark:bg-gray-800">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-end">
        <div className="col-span-1">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div className="col-span-1">
          <label htmlFor="from" className="block text-sm font-medium text-gray-700 dark:text-gray-300">From</label>
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            {currencies.map((cur) => <option key={cur}>{cur}</option>)}
          </select>
        </div>
        <div className="col-span-1">
          <label htmlFor="to" className="block text-sm font-medium text-gray-700 dark:text-gray-300">To</label>
          <select value={to} onChange={(e) => setTo(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            {currencies.map((cur) => <option key={cur}>{cur}</option>)}
          </select>
        </div>
      </div>
      <div className="flex justify-center my-4">
        <button
          type="button"
          onClick={handleSwapCurrencies}
          className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-600"
          aria-label="Swap Currencies"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </button>
      </div>
      <div className="mb-4">
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          max={new Date().toISOString().split('T')[0]} // Prevent selecting future dates
        />
      </div>
      {result !== null && (
        <p className="mt-4 text-xl font-medium text-center text-gray-800 dark:text-white flex items-center justify-center">
          Result: {amount} {from} = {result.toFixed(2)} {to}
          {loading && (
            <svg className="animate-spin h-5 w-5 ml-3 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
        </p>
      )}
    </form>
  );
};

export default ConverterForm;
