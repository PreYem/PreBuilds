import React, { useEffect, useState } from "react";
import setTitle from "../utils/DocumentTitle";
import apiService from "../api/apiService";
import LoadingSpinner from "../components/PreBuildsLoading";
import useRoleRedirect from "../hooks/useRoleRedirect";

const GlobalSettings = ({userData, title }) => {
  const [formData, setFormData] = useState({ new_product_duration: 0 });
  const [databaseError, setDatabaseError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  useRoleRedirect(userData, ["Owner"]);

  setTitle(title);

  

  useEffect(() => {
    const fetchGlobalSettings = async () => {
      setLoading(true);
      try {
        const response = await apiService.get("/api/globalsettings");
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching global settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGlobalSettings();
  }, []);

  const handleSave = async (e) => {
    setDatabaseError("");
    setSuccessMessage("");
    e.preventDefault();
    try {
      const response = await apiService.put("/api/globalsettings/" + null, formData, { withCredentials: true });

      setSuccessMessage(response.data.successMessage);
      console.log(response.data.successMessage);
      console.log(response.data.databaseError);
    } catch (error) {
      console.log(error.response.data.databaseError);

      setDatabaseError(error.response.data.databaseError);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 w-full">
        <div className="w-2/3 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
          <h1 className="text-4xl font-extrabold mb-8 text-gray-900 dark:text-gray-100 text-center">Global Settings</h1>

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label htmlFor="new_product_duration" className="block text-lg text-gray-700 dark:text-gray-300 font-semibold mb-2">
                New Product Duration
              </label>
              <input
                type="number"
                name="new_product_duration"
                id="new_product_duration"
                value={formData.new_product_duration}
                onChange={(e) => setFormData({ ...formData, new_product_duration: parseInt(e.target.value) })}
                className="w-2/12 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 transition"
                placeholder="Enter duration in minutes"
              />
              <span className="ml-2">Minutes</span>
            </div>

            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm text-gray-700 dark:text-gray-300 text-sm">
              <p className="mb-2">
                This input defines the duration (in minutes) for when a product is considered new. If a product's age is lower than this duration, it
                will be flagged as <span className="font-bold text-indigo-600 dark:text-indigo-400">NEW</span>.
              </p>
              <ul className="list-disc pl-5">
                <li>1 hour = 60 minutes</li>
                <li>1 day = 1440 minutes</li>
                <li>1 week = 10080 minutes</li>
                <li>1 month (approx.) = 43200 minutes</li>
              </ul>
            </div>

            <div className="mt-6 h-6 flex justify-between items-center">
              <div className="flex space-x-4">
                {successMessage && (
                  <div className="text-sm text-green-600 dark:text-green-400 p-4 bg-green-50 dark:bg-green-800 border border-green-200 dark:border-green-600 rounded-md shadow-md">
                    {successMessage}
                  </div>
                )}

                {databaseError && (
                  <div className="text-sm text-red-600 dark:text-red-400 p-4 bg-red-50 dark:bg-red-800 border border-red-200 dark:border-red-600 rounded-md shadow-md">
                    {databaseError}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Save Changes
                </button>
                <a
                  href="/"
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  Close
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default GlobalSettings;
