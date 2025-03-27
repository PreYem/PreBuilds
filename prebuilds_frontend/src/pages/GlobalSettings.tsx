import { FormEvent, useEffect, useState } from "react";
import setTitle, { TitleType } from "../utils/DocumentTitle";
import apiService from "../api/apiService";
import LoadingSpinner from "../components/LoadingSpinner";
import useRoleRedirect from "../hooks/useRoleRedirect";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";
import { useNotification } from "../context/GlobalNotificationContext";


const GlobalSettings = ({ title }: TitleType) => {
  useRoleRedirect(["Owner"]);

  const { showNotification } = useNotification();
  setTitle(title);

  const [formData, setFormData] = useState({ new_product_duration: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGlobalSettings = async () => {
      setLoading(true);
      try {
        const response = await apiService.get("/api/globalsettings");
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching global settings:", error);
        showNotification("An unexpected error has accured while fetching data", "databaseError");
      } finally {
        setLoading(false);
      }
    };

    fetchGlobalSettings();
  }, []);

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await apiService.put("/api/globalsettings/" + null, formData);

      showNotification(response.data.successMessage, "successMessage");
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        showNotification(error.response.data.databaseError, "databaseError");
      }
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
              <div className="flex justify-end space-x-4">
                <button type="submit" className={"py-2 px-4 rounded text-white bg-green-500 hover:bg-green-600"}>
                  Save Changes
                </button>
                <Link
                  to={"/"}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  Close
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default GlobalSettings;
