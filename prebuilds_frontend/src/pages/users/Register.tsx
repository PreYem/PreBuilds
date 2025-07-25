import { useState, useEffect } from "react";
import countries from "../../data/countries_list.json";
import apiService from "../../api/apiService";
import { Link, useNavigate } from "react-router-dom";
import setTitle, { TitleType } from "../../utils/DocumentTitle";
import { useSessionContext } from "../../context/SessionContext";
import { AxiosError } from "axios";
import { useNotification } from "../../context/GlobalNotificationContext";
import AccountVerification from "./password-forgoten/AccountVerification";
import LoadingSpinner from "../../components/LoadingSpinner";

export interface UserRegisterFormData {
  user_username: string;
  user_firstname: string;
  user_lastname: string;
  user_phone?: string;
  user_country: string;
  user_address?: string;
  user_email: string;
  user_password: string;
  user_password_confirmation: string;
}

const Register = ({ title }: TitleType) => {
  setTitle(title);
  const { userData } = useSessionContext();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [openVerificationModal, setOpenVerificationModal] = useState<boolean>(false);
  const [formData, setFormData] = useState<UserRegisterFormData>({
    user_username: "",
    user_firstname: "",
    user_lastname: "",
    user_phone: "",
    user_country: "",
    user_address: "",
    user_email: "",
    user_password: "",
    user_password_confirmation: "",
  });
  const [verificationData, setVerificationData] = useState<UserRegisterFormData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (userData?.user_id) {
      // ---> Checking if the user is logged in, if yes then we prevent him from entering the login screen again.
      navigate("/"); // By redirecting him to the index page
    }
  }, [userData, navigate]);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validatePasswords = (password: string, confirmPassword: string) => {
    if (password.length < 6 || confirmPassword.length < 6) {
      setIsButtonDisabled(true);
      showNotification("Password must be at least 6 characters long.", "databaseError");
    } else if (password !== confirmPassword) {
      setIsButtonDisabled(true);

      showNotification("Passwords do not match.", "databaseError");
    } else {
      setIsButtonDisabled(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedFormData);
    validatePasswords(updatedFormData.user_password, updatedFormData.user_password_confirmation);
  };

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   try {
  //     const response = await apiService.post("/api/users", formData);

  //     if (response.status === 201) {
  //       setUserData(response.data.userData);

  //       localStorage.setItem("prebuilds_auth_token", response.data.token);

  //       navigate("/");
  //     }
  //   } catch (error) {
  //     if (error instanceof AxiosError && error.response) {
  //       showNotification(error.response.data.databaseError, "databaseError");
  //     } else {
  //       showNotification("An unexpected error occurred.", "databaseError");
  //     }
  //   }
  // };

  const OpenVerificationModal = async () => {
    setLoading(true);
    try {
      const response = await apiService.post("/api/email-verification", formData);
      showNotification(response.data.successMessage, "successMessage");
      setVerificationData(JSON.parse(JSON.stringify(formData)));
      setOpenVerificationModal(true);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        showNotification(error.response.data.databaseError, "databaseError");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <LoadingSpinner />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 w-full">
        <div className="w-full max-w-6xl bg-white dark:bg-gray-800 shadow-md rounded-md p-6">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">Account Creation</h2>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div>
                {/* Username */}
                <div className="mb-4">
                  <label htmlFor="user_username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Username*
                  </label>
                  <input
                    placeholder="Your Username"
                    type="text"
                    id="user_username"
                    name="user_username"
                    value={formData.user_username}
                    onChange={handleChange}
                    required
                    className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                  />
                </div>

                {/* First Name */}
                <div className="mb-4">
                  <label htmlFor="user_firstname" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Your First Name*
                  </label>
                  <input
                    placeholder="Your First Name"
                    type="text"
                    id="user_firstname"
                    name="user_firstname"
                    value={formData.user_firstname}
                    onChange={handleChange}
                    required
                    className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                  />
                </div>

                {/* Last Name */}
                <div className="mb-4">
                  <label htmlFor="user_lastname" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Your Last Name*
                  </label>
                  <input
                    placeholder="Your Last Name"
                    type="text"
                    id="user_lastname"
                    name="user_lastname"
                    value={formData.user_lastname}
                    onChange={handleChange}
                    required
                    className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                  />
                </div>

                {/* Phone */}
                <div className="mb-4">
                  <label htmlFor="user_phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Your Phone number
                  </label>
                  <input
                    placeholder="(Optional)"
                    type="text"
                    id="user_phone"
                    name="user_phone"
                    value={formData.user_phone}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
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
                    className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                  >
                    <option value="">Select Your Country</option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Right Column */}
              <div>
                {/* Address */}
                <div className="mb-4">
                  <label htmlFor="user_address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Your Home Address
                  </label>
                  <input
                    placeholder="(Optional)"
                    type="text"
                    id="user_address"
                    name="user_address"
                    value={formData.user_address}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                  />
                </div>

                {/* Email */}
                <div className="mb-4">
                  <label htmlFor="user_email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Your Email Address*
                  </label>
                  <input
                    placeholder="Your Email Address"
                    type="email"
                    id="user_email"
                    name="user_email"
                    value={formData.user_email}
                    onChange={handleChange}
                    required
                    className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                  />
                </div>

                {/* Password */}
                <div className="mb-4">
                  <label htmlFor="user_password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Your Password*
                  </label>
                  <input
                    placeholder="Your Password"
                    type="password"
                    id="user_password"
                    name="user_password"
                    value={formData.user_password}
                    onChange={handlePasswordChange}
                    required
                    className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                  />
                </div>

                {/* Confirm Password */}
                <div className="mb-6">
                  <label htmlFor="user_password_confirmation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirm Your Password*
                  </label>
                  <input
                    placeholder="Confirm Your Password"
                    type="password"
                    id="user_password_confirmation"
                    name="user_password_confirmation"
                    value={formData.user_password_confirmation}
                    onChange={handlePasswordChange}
                    required
                    className="mt-1 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center mx-auto">
              <button
                onClick={OpenVerificationModal}
                disabled={isButtonDisabled}
                className={`w-full py-2 px-4 rounded-md text-white focus:outline-none focus:ring-2 ${
                  isButtonDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-500 hover:bg-indigo-600"
                }`}
              >
                Register
              </button>

              <br />
              <span className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                Already got an account?{" "}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  Sign in
                </Link>
              </span>
            </div>
          </form>
        </div>
        {openVerificationModal && (
          <AccountVerification
            openVerificationModal={openVerificationModal}
            setOpenVerificationModal={setOpenVerificationModal}
            verificationData={verificationData}
            setLoading={setLoading}
          />
        )}
      </div>
    </>
  );
};

export default Register;
