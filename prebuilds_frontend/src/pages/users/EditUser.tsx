import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import setTitle, { TitleType } from "../../utils/DocumentTitle";
import apiService from "../../api/apiService";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useSessionContext } from "../../context/SessionContext";
import countries from "../../data/countries_list.json";
import { AxiosError } from "axios";
import { useNotification } from "../../context/GlobalNotificationContext";

const EditUser = ({ title }: TitleType) => {
  setTitle(title);
  const { showNotification } = useNotification(); // Get the showNotification function

  const { userData, setUserData } = useSessionContext();
  const [loading, setLoading] = useState(true);
  const [doctTitle, setDocTitle] = useState("");
  const [ownerCount, setOwnerCount] = useState(0);
  const user_id = Number(useParams().user_id);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    user_firstname: "",
    user_lastname: "",
    user_phone: "",
    user_country: "",
    user_address: "",
    user_role: "",
    user_account_status: "",
    user_email: "",
    user_password: "",
    user_password_confirmation: "",
  });

  // This section is to restrict access to the editUser page depending on the user's access level
  useEffect(() => {
    if (!userData || !userData.user_id) {
      // If nobody is logged in, redriect user to the index page.
      console.log("No user data found, redirecting to /");
      navigate("/");
    }

    if (userData?.user_id !== user_id && userData?.user_role !== "Owner") {
      console.log("User is not an owner and trying to edit someone else's data, redirecting...");
      navigate("/editUser/" + userData?.user_id);
    } else {
    }
  }, [userData, user_id, navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiService.get("/api/users/" + user_id, {});

        setOwnerCount(response.data.owner_count);

        if (response.data) {
          setFormData({
            user_firstname: response.data.user.user_firstname,
            user_lastname: response.data.user.user_lastname,
            user_phone: response.data.user.user_phone,
            user_country: response.data.user.user_country,
            user_address: response.data.user.user_address,
            user_email: response.data.user.user_email,
            user_role: response.data.user.user_role,
            user_account_status: response.data.user.user_account_status,
            user_password: "",
            user_password_confirmation: "",
          });

          setDocTitle(response.data.user.user_firstname);
        }
      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          showNotification(error.response.data.databaseError, "databaseError");
        }

        if (userData?.user_id) {
          navigate("/editUser/" + userData.user_id);
        } else {
          navigate("/");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user_id, navigate]);

  setTitle(doctTitle);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await apiService.put("/api/users/" + user_id, formData);

      showNotification(response.data.successMessage, "successMessage");

      console.log(setUserData);
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
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 w-full">
      <div className="w-full max-w-6xl bg-white dark:bg-gray-800 shadow-md rounded-md p-6">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">Edit Account</h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
              {/* First Name */}
              <div className="mb-4">
                <label htmlFor="user_firstname" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Your First Name*
                </label>
                <input
                  type="text"
                  id="user_firstname"
                  name="user_firstname"
                  value={formData.user_firstname}
                  onChange={handleChange}
                  required
                  placeholder="Your First Name"
                  className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Last Name */}
              <div className="mb-4">
                <label htmlFor="user_lastname" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Your Last Name*
                </label>
                <input
                  type="text"
                  id="user_lastname"
                  name="user_lastname"
                  value={formData.user_lastname}
                  onChange={handleChange}
                  required
                  placeholder="Your Last Name"
                  className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Phone */}
              <div className="mb-4">
                <label htmlFor="user_phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Your Phone Number
                </label>
                <input
                  type="text"
                  id="user_phone"
                  name="user_phone"
                  value={formData.user_phone}
                  onChange={handleChange}
                  placeholder="(Optional)"
                  className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Country */}
              <div className="mb-4">
                <label htmlFor="user_country" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Your Country*
                </label>
                <select
                  id="user_country"
                  name="user_country"
                  value={formData.user_country}
                  onChange={handleChange}
                  required
                  className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select Your Country</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              {ownerCount >= 1 && userData?.user_role === "Owner" ? (
                <div className="mb-4">
                  <label htmlFor="user_privilege" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    ⚠️User Privilege Level*
                  </label>
                  <select
                    id="user_role"
                    name="user_role"
                    value={formData.user_role}
                    onChange={handleChange}
                    required
                    className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="Owner">Owner</option>
                    <option value="Admin">Admin</option>
                    <option value="Client">Client</option>
                  </select>
                </div>
              ) : ownerCount == 1 && userData?.user_role === "Owner" && userData.user_id == user_id ? (
                <div className="mb-4 text-red-500 dark:text-red-400">
                  <span className="inline-block bg-yellow-200 text-yellow-800 dark:bg-yellow-600 dark:text-yellow-200 rounded-full px-3 py-1 text-xs font-semibold mr-2">
                    ⚠️ Privilege Warning:
                  </span>
                  <br />
                  <span className="text-yellow-800 dark:text-yellow-300">
                    There is currently only <b>1</b> user with <u className="underline">Owner</u> privileges. To modify the privilege level for this
                    user, there must be at least one more user with <u className="underline">Owner</u> privileges.
                  </span>
                </div>
              ) : userData?.user_role !== "Owner" ? (
                ""
              ) : (
                ""
              )}
            </div>

            {/* Right Column */}
            <div>
              <div>
                {/* If the logged-in user is an Owner and editing someone else's account, show the dropdown */}
                {userData?.user_role === "Owner" ? (
                  userData.user_id != user_id ? (
                    <div className="mb-6">
                      <label htmlFor="user_account_status" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        🔓 Account Status
                      </label>
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                        <label className="relative flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <input
                            type="radio"
                            id="unlocked"
                            name="user_account_status"
                            value="Unlocked"
                            onChange={handleChange}
                            checked={formData.user_account_status === "Unlocked"}
                            className="peer sr-only"
                          />
                          <span className="flex items-center justify-center w-5 h-5 mr-3 rounded-full border border-gray-300 dark:border-gray-600 peer-checked:border-green-500 dark:peer-checked:border-green-500 peer-checked:bg-green-500 dark:peer-checked:bg-green-500">
                            <span className="opacity-0 peer-checked:opacity-100 text-white">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                          </span>
                          <div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">✔️ Unlocked</span>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">User has full account access</p>
                          </div>
                        </label>

                        <label className="relative flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <input
                            type="radio"
                            id="locked"
                            name="user_account_status"
                            value="Locked"
                            onChange={handleChange}
                            checked={formData.user_account_status === "Locked"}
                            className="peer sr-only"
                          />
                          <span className="flex items-center justify-center w-5 h-5 mr-3 rounded-full border border-gray-300 dark:border-gray-600 peer-checked:border-red-500 dark:peer-checked:border-red-500 peer-checked:bg-red-500 dark:peer-checked:bg-red-500">
                            <span className="opacity-0 peer-checked:opacity-100 text-white">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                          </span>
                          <div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">🔒 Locked</span>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">User access is restricted</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4 text-red-500 dark:text-red-400">
                      <span className="inline-block bg-yellow-200 text-yellow-800 dark:bg-yellow-600 dark:text-yellow-200 rounded-full px-3 py-1 text-xs font-semibold mr-2">
                        ⚠️ Privilege Warning:
                      </span>
                      <br />
                      <span className="text-yellow-800 dark:text-yellow-300">
                        Unable to Lock Accounts with <b>Owner</b> Level Privilege until their Privilige is downgraded first.{" "}
                      </span>
                    </div>
                  )
                ) : null}
              </div>

              {/* Address */}
              <div className="mb-4">
                <label htmlFor="user_address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Your Home Address
                </label>
                <input
                  type="text"
                  id="user_address"
                  name="user_address"
                  value={formData.user_address}
                  onChange={handleChange}
                  placeholder="(Optional)"
                  className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label htmlFor="user_email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Your Email Address*
                </label>
                <input
                  type="email"
                  id="user_email"
                  name="user_email"
                  value={formData.user_email}
                  onChange={handleChange}
                  required
                  placeholder="Your Email Address"
                  className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Password */}
              <div className="mb-4">
                <label htmlFor="user_password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Your Password
                </label>
                <input
                  type="password"
                  id="user_password"
                  name="user_password"
                  value={formData.user_password}
                  onChange={handleChange}
                  placeholder="Your Password"
                  className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Confirm Password */}
              <div className="mb-6">
                <label htmlFor="user_password_confirmation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirm Your Password
                </label>
                <input
                  type="password"
                  id="user_password_confirmation"
                  name="user_password_confirmation"
                  value={formData.user_password_confirmation}
                  onChange={handleChange}
                  placeholder="Confirm Your Password"
                  className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center items-center space-x-4 mx-auto w-full">
            <button
              type="submit"
              className="py-2 px-6 rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-300 dark:focus:ring-offset-gray-800 transition duration-200 shadow-md"
            >
              Save Changes
            </button>
            <Link
              to={"/"}
              className="py-2 px-6 rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition duration-200 shadow-md"
            >
              Cancel
            </Link>
            {userData?.user_role === "Owner" ? (
              <Link
                className="py-2 px-6 rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition duration-200 shadow-md"
                to="/UsersDashboard"
              >
                <i className="bx bxs-key mr-1"></i>Back to Dashboard
              </Link>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
