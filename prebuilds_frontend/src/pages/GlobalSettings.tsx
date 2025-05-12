import { useEffect, useState } from "react";
import setTitle, { TitleType } from "../utils/DocumentTitle";
import apiService from "../api/apiService";
import LoadingSpinner from "../components/LoadingSpinner";
import useRoleRedirect from "../hooks/useRoleRedirect";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";
import { useNotification } from "../context/GlobalNotificationContext";
import { truncateText } from "../utils/TruncateText";

interface GlobalSettings {
  [key: string]: {
    value: string | number;
    setting_description: string;
  };
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
    console.log(formData);

    try {
      const response = await apiService.post("/api/global_settings", formData);
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
    <div className="bg-gray-50 dark:bg-gray-900 py-8 px-4 min-h-screen mt-24 ">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gray-100 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Global Settings</h1>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-6">
            {Object.keys(formData).map((key) => (
              <div key={key} className="pb-5 border-b border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize">
                  {truncateText(key.replace(/_/g, " "), 30)}
                </label>

                <input
                  type="text"
                  value={formData[key].value}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [key]: { ...formData[key], value: e.target.value },
                    })
                  }
                  className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 
                    dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />

                <div className="mt-3">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Description</label>
                  <textarea
                    value={formData[key].setting_description || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [key]: { ...formData[key], setting_description: e.target.value },
                      })
                    }
                    className="w-full mt-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 
                      dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 flex justify-end space-x-3">
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium 
              transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Changes
          </button>
          <Link
            to="/"
            className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 
              text-gray-800 dark:text-white px-4 py-2 rounded font-medium transition-colors duration-150"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GlobalSettings;
