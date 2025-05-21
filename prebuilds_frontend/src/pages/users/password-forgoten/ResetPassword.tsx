import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import setTitle, { TitleType } from "../../../utils/DocumentTitle";
import { useSessionContext } from "../../../context/SessionContext";
import { useNotification } from "../../../context/GlobalNotificationContext";
import apiService from "../../../api/apiService";
import { AxiosError } from "axios";
import LoadingSpinner from "../../../components/LoadingSpinner";

function ResetPasswordForm({ title }: TitleType) {
  setTitle(title);
  const { userData } = useSessionContext();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState<boolean>(false);
  const email = localStorage.getItem("user_email_forReset");
  const verified = localStorage.getItem("token_verified");
  const token = localStorage.getItem("token");
  const timestamp = localStorage.getItem("reset_token_timestamp");

  const [formData, setFormData] = useState({
    user_password: "",
    user_password_confirmation: "",
    user_email: email,
    token: token,
  });

  if (userData) {
    navigate("*");
    return;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const expired = !timestamp || now - parseInt(timestamp, 10) > 5 * 60 * 1000;

      if (!email || !verified || expired || token) {
        localStorage.removeItem("user_email_forReset");
        localStorage.removeItem("reset_token_timestamp");
        localStorage.removeItem("token_verified");
        navigate("*");
      }
    }, 10 * 60 * 1000); // every 1 minute

    // Run it immediately on mount too
    const now = Date.now();
    const email = localStorage.getItem("user_email_forReset");
    const verified = localStorage.getItem("token_verified");
    const timestamp = localStorage.getItem("reset_token_timestamp");
    const expired = !timestamp || now - parseInt(timestamp, 10) > 5 * 60 * 1000;

    if (!email || !verified || expired) {
      localStorage.removeItem("user_email_forReset");
      localStorage.removeItem("reset_token_timestamp");
      localStorage.removeItem("token_verified");
      navigate("*");
    }

    return () => clearInterval(interval);
  }, [navigate]);

  const handleSubmit = async () => {
    console.log(formData);
    setLoading(true);

    try {
      const response = await apiService.post("/api/reset-password", formData);

      if (response.data.successMessage) {
        localStorage.removeItem("user_email_forReset");
        localStorage.removeItem("reset_token_timestamp");
        localStorage.removeItem("token_verified");
        localStorage.removeItem("token");
        navigate("/login");
      }

      showNotification(response.data.successMessage, "successMessage");
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        showNotification(error.response.data.databaseError, "databaseError");
      }
    } finally {
      setLoading(false);
    }
  };

  const isPasswordsMatching =
    formData.user_password === formData.user_password_confirmation &&
    formData.user_password !== "" &&
    formData.user_password_confirmation !== "" &&
    formData.user_password.length >= 6;

  if (loading) {
    return (
      <>
        <LoadingSpinner />
      </>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md p-6 shadow-lg rounded-lg bg-white dark:bg-gray-800">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100 text-center">Reset Your Password</h2>
        <p className="mb-6 text-center text-gray-700 dark:text-gray-300">
          Please enter your new password. Make sure it's at least 6 characters long.
        </p>

        <input
          type="password"
          placeholder="New Password"
          className="w-full mb-4 px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 
          focus:ring-green-400 dark:focus:ring-green-600 dark:bg-gray-700 dark:text-gray-200"
          value={formData.user_password}
          onChange={(e) => setFormData({ ...formData, user_password: e.target.value })}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full mb-6 px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-600 dark:bg-gray-700 dark:text-gray-200"
          value={formData.user_password_confirmation}
          onChange={(e) => setFormData({ ...formData, user_password_confirmation: e.target.value })}
        />

        <button
          disabled={!isPasswordsMatching}
          onClick={handleSubmit}
          className={`w-full py-3 rounded-md font-semibold text-white transition-colors duration-300 ${
            isPasswordsMatching ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default ResetPasswordForm;
