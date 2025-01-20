import React, { useEffect, useState } from "react";
import setTitle from "../utils/DocumentTitle";
import apiService from "../api/apiService";

const GlobalSettings = ({ title }) => {
  const [formData, setFormData] = useState({ new_product_duration: 0 });
  const [databaseError, setDatabaseError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(true);
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
      // Capture the response from the API
      const response = await apiService.put("/api/globalsettings/" + null, formData, {withCredentials : true} );

      // Check if the response contains a success message
      setSuccessMessage(response.data.successMessage);
      console.log(response.data.successMessage);
      
    } catch (error) {
      console.error("Error updating global settings:", error);

      // If there's an error, set the databaseError state
      setDatabaseError(error.response?.data?.databaseError || 'An unexpected error occurred');
    }
};



  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 w-full">
        <div className="w-2/3 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200 text-center">PreBuilds Global Settings</h1>
          <form onSubmit={handleSave}>
            <div className="mb-6">
              <label htmlFor="new_product_duration" className="block text-sm text-gray-700 dark:text-gray-300 font-bold">
                Product Duration
              </label>
              <input
                type="number"
                name="new_product_duration"
                id="new_product_duration"
                value={formData.new_product_duration}
                onChange={(e) => setFormData({ ...formData, new_product_duration: parseInt(e.target.value) })}
                className="w-2/12 px-4 py-3 mt-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                placeholder="Enter duration in minutes"
              />
            </div>

            {successMessage && (
              <div className="text-sm text-green-600 dark:text-green-400 mb-4 p-4 bg-green-50 dark:bg-green-800 border border-green-200 dark:border-green-600 rounded-md shadow-md">
                {successMessage}
              </div>
            )}

            {databaseError && (
              <div className=" max-w-xl text-sm text-red-600 dark:text-red-400 mb-4 p-4 bg-red-50 dark:bg-red-800 border border-red-200 dark:border-red-600 rounded-md shadow-md">
                {databaseError}
              </div>
            )}

            <div className="mt-6 flex justify-between items-center">
              <div className="flex justify-end space-x-4 ml-auto">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Save Changes
                </button>
                <a
                  href="/"
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-400"
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
