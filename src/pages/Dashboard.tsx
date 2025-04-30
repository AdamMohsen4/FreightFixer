import { useState } from "react";
import { correctCity } from "../services/cityCorrection";

export default function Dashboard() {
  const [inputCity, setInputCity] = useState("");
  const [correctedCity, setCorrectedCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const result = await correctCity(inputCity);
      setCorrectedCity(result.corrected);
    } catch (err) {
      setError("Failed to correct city name. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <h1 className="text-lg font-medium">Dashboard</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4">
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                Enter City Name
              </label>
              <input
                type="text"
                id="city"
                value={inputCity}
                onChange={(e) => setInputCity(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="e.g. Helsiniki"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? "Correcting..." : "Correct City Name"}
            </button>
          </form>

          {error && (
            <div className="mt-4 text-red-600 text-sm">
              {error}
            </div>
          )}

          {correctedCity && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-500">Original: {inputCity}</p>
              <p className="text-sm font-medium">Corrected: {correctedCity}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
