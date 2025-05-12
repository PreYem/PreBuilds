import {useEffect, useState } from "react";
import setTitle, { TitleType } from "../utils/DocumentTitle";
import apiService from "../api/apiService";
import LoadingSpinner from "../components/LoadingSpinner";
import useRoleRedirect from "../hooks/useRoleRedirect";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";
import { useNotification } from "../context/GlobalNotificationContext";
import { truncateText } from "../utils/TruncateText";

interface GlobalSettings {
  [key: string]: string | number; // All keys should have a string or number value
}

const GlobalSettings = ({ title }: TitleType) => {
  useRoleRedirect(["Owner"]);

  const { showNotification } = useNotification();
  setTitle(title);

  const [formData, setFormData] = useState<GlobalSettings>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGlobalSettings = async () => {
      setLoading(true);
      try {
        const response = await apiService.get("/api/global_settings");
        setFormData(response.data.globalSettings);
      } catch (error) {
        console.error("Error fetching global settings:", error);
        showNotification("An unexpected error has occurred while fetching data", "databaseError");
      } finally {
        setLoading(false);
      }
    };

    fetchGlobalSettings();
  }, []);

  const handleSave = async () => {
    console.log("sending data");

    try {
      const response = await apiService.post("/api/global_settings", formData);

      showNotification(response.data.successMessage, "successMessage");
      console.log(response.data);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        showNotification(error.response.data.databaseError, "databaseError");
      }
      console.log("failure");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-lg p-6">
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">Global Settings</h1>

          <div className="space-y-4">
            {Object.keys(formData).map((key) => (
              <div key={key} className="grid grid-cols-2 gap-4 items-center">
                <label className="font-medium text-gray-700 dark:text-gray-300 capitalize">{truncateText(key.replace(/_/g, " "), 20)} : </label>
                <input
                  type="text"
                  value={formData[key]}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium">
              Save Changes
            </button>
            <Link to={"/"}  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium">Close</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default GlobalSettings;
