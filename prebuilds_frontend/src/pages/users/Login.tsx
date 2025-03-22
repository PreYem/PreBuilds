import { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiService from "../../api/apiService";
import setTitle, { TitleType } from "../../utils/DocumentTitle";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useSessionContext } from "../../context/SessionContext";
import { AxiosError } from "axios";

const Login = ({ title }: TitleType) => {
  setTitle(title);
  const [loading, setLoading] = useState(false);
  const { userData, setUserData } = useSessionContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (userData?.user_id) {
      // ---> Checking if the user is logged in, if yes then we prevent him from entering the login screen again.
      navigate("/"); // By redirecting him to the index page
    }
  }, [userData, navigate]);

  const [formData, setFormData] = useState({
    user_username_email: "",
    user_password: "",
  });

  const [databaseError, setDatabaseError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setDatabaseError("");
    setSuccessMessage("");

    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

  };


  useEffect(() => {
    if (successMessage) {
      setDatabaseError("");
    } else if (databaseError) {
      setSuccessMessage("");
    }
  }, [successMessage, databaseError]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiService.post("/api/login", formData, {
        withCredentials: true,
      });

      localStorage.setItem("prebuilds_auth_token", response.data.token);

      setUserData(response.data.user);
      navigate("/");
    } catch (err) {
      const error = err as AxiosError<{ databaseError?: string; errors?: string[] }>;
      if (error.response) {
        setDatabaseError(error.response.data?.databaseError || "Unknown database error");
      } else {
        setDatabaseError("Network error or server is down");
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
  } else {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 w-full">
          <div className="w-full max-w-lg bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">Login to Your Account</h2>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Username / Email */}
                <div>
                  <label htmlFor="user_username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Username or Email
                  </label>
                  <input
                    type="text"
                    id="user_username"
                    name="user_username_email"
                    value={formData.user_username_email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your username or email"
                    className="mt-2 p-3 w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                  />
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="user_password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <input
                    type="password"
                    id="user_password"
                    name="user_password"
                    value={formData.user_password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                    className="mt-2 p-3 w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                  />
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <button
                    type={"submit"}
                    className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-400 transition duration-300 ease-in-out"
                  >
                    Login
                  </button>
                </div>
              </div>
            </form>

            {/* Forgot Password link */}
            <div className="mt-6 text-center">
              <a href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                Forgot your password?
              </a>
            </div>

            {/* Signup redirect */}
            <div className="mt-4 text-center">
              <p className="text-sm">
                Don't have an account?{" "}
                <Link to="/register" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  Sign up
                </Link>
              </p>
              {databaseError ? <div style={{ color: "red" }}>{databaseError}</div> : ""}
              {successMessage ? <div style={{ color: "green" }}>{successMessage}</div> : ""}
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default Login;
