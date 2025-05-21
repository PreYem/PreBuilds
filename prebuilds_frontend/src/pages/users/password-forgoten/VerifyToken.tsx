import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // assuming React Router
import apiService from "../../../api/apiService";
import { useNotification } from "../../../context/GlobalNotificationContext";
import { useSessionContext } from "../../../context/SessionContext";
import { AxiosError } from "axios";
import setTitle, { TitleType } from "../../../utils/DocumentTitle";

function VerifyToken({ title }: TitleType) {
  setTitle(title);
  const [token, setToken] = useState<string>("");
  const navigate = useNavigate();
  const user_email_forReset = localStorage.getItem("user_email_forReset");
  const reset_token_timestamp = localStorage.getItem("reset_token_timestamp");
  const { showNotification } = useNotification();

  const { userData } = useSessionContext();

  if (userData) {
    navigate("*");
    return;
  }

  useEffect(() => {
    const checkTokenValidity = () => {
      if (!user_email_forReset || !reset_token_timestamp) {
        localStorage.removeItem("user_email_forReset");
        localStorage.removeItem("reset_token_timestamp");
        navigate("*");
        return;
      }

      const now = Date.now();
      const timePassed = now - parseInt(reset_token_timestamp, 10);
      console.log(timePassed);

      if (timePassed > 5 * 60 * 1000) {
        localStorage.removeItem("user_email_forReset");
        localStorage.removeItem("reset_token_timestamp");

        showNotification("Token expired. Please request a new one.", "databaseError");
        navigate("*");
      }
    };

    // Run check immediately
    checkTokenValidity();

    // Set up interval to check every 1 minute
    const intervalId = setInterval(checkTokenValidity, 60 * 1000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [navigate, showNotification]);

  const handleSubmit = async () => {
    try {
      const response = await apiService.post("/api/verify-token", {
        user_email: localStorage.getItem("user_email_forReset"),
        token: token,
      });

      showNotification(response.data.successMessage, "successMessage");

      localStorage.setItem("token_verified", "true");
      localStorage.setItem("token", response.data.token);
      navigate("/reset-password");
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        showNotification(error.response.data.databaseError, "databaseError");
      }
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
        <div className="w-full max-w-md p-6 shadow-lg rounded-lg bg-white dark:bg-gray-800">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100 text-center">Reset Password</h2>
          <p className="mb-6 text-center text-gray-700 dark:text-gray-300">
            Please enter the 10 digit token code sent to your email. This token will expire in 5 minutes.
          </p>

          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Your Reset Token"
            required
            className="w-full mb-4 px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 dark:bg-gray-700 dark:text-gray-200"
          />

          <button
            onClick={handleSubmit}
            className="w-full py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors duration-300"
          >
            Verify Token
          </button>
        </div>
      </div>
    </>
  );
}

export default VerifyToken;
