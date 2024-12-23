import React, { useEffect, useState } from "react";
import countries from "../../data/countries_list.json";
import { useNavigate, useParams } from "react-router-dom";
import setTitle from "../../utils/DocumentTitle";
import apiService from "../../api/apiService";

const EditUser = ({ userData, setUserData, title }) => {
  const [ownerCount, setOwnerCount] = useState(null); // State to hold the owner count
  const { user_id } = useParams();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    user_firstname: "",
    user_lastname: "",
    user_phone: "",
    user_country: "",
    user_address: "",
    user_email: "",
    user_password: "",
    user_password_confirmation: "",
  });
  useEffect(() => {
    if (!userData || !userData.user_id) {
      console.log("No user data found, redirecting to /");
      navigate("/");
    } else if (userData.user_id !== user_id && userData.user_role !== "Owner") {
      console.log("User is not an owner and trying to edit someone else's data, redirecting...");
      navigate("/editUser/" + userData.user_id);
    }
  }, [userData, user_id, navigate]);

  useEffect(() => {
    // Fetch user data based on user_id
    const fetchUserData = async () => {
      try {
        const response = await apiService.get(`/api/users/${user_id}`, {
          withCredentials: true, // Include credentials if needed
        });

        setOwnerCount(response.data.owner_count);

        if (response.data) {
          // Set the form data with the fetched data
          setFormData({
            user_firstname: response.data.user.user_firstname,
            user_lastname: response.data.user.user_lastname,
            user_phone: response.data.user.user_phone,
            user_country: response.data.user.user_country,
            user_address: response.data.user.user_address,
            user_email: response.data.user.user_email,
            user_role: response.data.user.user_role,
            user_account_status: response.data.user.user_account_status,
            user_password: "", // Keep the password fields empty, as they will be updated
            user_password_confirmation: "",
          });
        }
      } catch (err) {
        if (userData.user_id) {
          navigate("/editUser/" + userData.user_id);
        } else {
          navigate("/");
        }
      }
    };

    fetchUserData();
  }, [user_id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add API call here
  };

  const isOwnerEditingOther = userData.user_role == "Owner" && userData.user_id != user_id;
  const isOwnerEditingOwn = userData.user_role == "Owner" && userData.user_id == user_id;

  // Log the results to the console
  // console.log("userData.user_role: ", userData.user_role);
  // console.log("userData.user_id: ", userData.user_id);
  // console.log("user_id (from URL): ", user_id);

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
              {ownerCount >= 1 && userData.user_role === "Owner" && userData.user_id != user_id ? (
                <div className="mb-4">
                  <label htmlFor="user_privilege" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    ⚠️User Privilege Level*
                  </label>
                  <select
                    id="user_privilege"
                    name="user_privilege"
                    value={formData.user_role}
                    onChange={handleChange}
                    required
                    className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select Privilege Level</option>
                    <option value="Owner">Owner</option>
                    <option value="Admin">Admin</option>
                    <option value="Client">Client</option>
                  </select>
                </div>
              ) : ownerCount < 2 && userData.user_role === "Owner" && userData.user_id == user_id ? (
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
              ) : null}
            </div>

            {/* Right Column */}
            <div>
              <div>
                {/* If the logged-in user is an Owner and editing someone else's account, show the dropdown */}
                {userData.user_role === "Owner" ? (
                  userData.user_id != user_id ? (
                    <div className="mb-4">
                      <label htmlFor="user_privilege" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        🔓 Account Status*
                      </label>
                      <select
                        id="user_privilege"
                        name="user_privilege"
                        value={formData.user_account_status}
                        onChange={handleChange}
                        required
                        className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">Lock Account</option>
                        <option value="Unlocked">Unlocked</option>
                        <option value="Locked">Locked</option>
                      </select>
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
                  required
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
                  required
                  placeholder="Confirm Your Password"
                  className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center mx-auto">
            <button type="submit" className={"w-full py-2 px-4 rounded-md text-white focus:outline-none focus:ring-2"}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
