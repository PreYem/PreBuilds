import { useState } from "react";
import apiService from "../../../api/apiService";
import { useSessionContext } from "../../../context/SessionContext";
import { useNavigate } from "react-router-dom";
import setTitle, { TitleType } from "../../../utils/DocumentTitle";
import { AxiosError } from "axios";
import { useNotification } from "../../../context/GlobalNotificationContext";
import LoadingSpinner from "../../../components/LoadingSpinner";

const ForgotPasswordForm = ({ title }: TitleType) => {
  setTitle(title);
  const { userData } = useSessionContext();
  const { showNotification } = useNotification();

  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  if (userData) {
    navigate("/");
    return;
  }

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await apiService.post("/api/forgot-password", { user_email: email });
      showNotification(response.data.successMessage, "warningMessage");
      localStorage.setItem("user_email_forReset", response.data.user_email_forReset);
      localStorage.setItem("reset_token_timestamp", Date.now().toString());

      navigate("/verify-token");
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md p-6 shadow-lg rounded-lg bg-white dark:bg-gray-800">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100 text-center">Password Reset</h2>

        <p className="mb-6 text-center text-gray-700 dark:text-gray-300">Please enter the email address associated with your account</p>

        <input
          type="email"
          placeholder="Enter your registered email"
          className="w-full mb-4 px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 dark:bg-gray-700 dark:text-gray-200"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          onClick={() => handleSubmit()}
          className="w-full py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors duration-300"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
