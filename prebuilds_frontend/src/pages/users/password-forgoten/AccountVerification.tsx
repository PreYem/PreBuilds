import { useEffect, useRef, useState } from "react";
import { UserRegisterFormData } from "../Register";
import apiService from "../../../api/apiService";
import { AxiosError } from "axios";
import { useNotification } from "../../../context/GlobalNotificationContext";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "../../../context/SessionContext";

interface Props {
  openVerificationModal: boolean;
  setOpenVerificationModal: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  verificationData: UserRegisterFormData | null;
}

const AccountVerification = ({ openVerificationModal, setOpenVerificationModal, verificationData, setLoading }: Props) => {
  const { userData, setUserData } = useSessionContext();

  const [verificationCode, setVerificationCode] = useState<string>("");
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    if (!openVerificationModal || !verificationData) return;
    const timeout = setTimeout(() => {
      setOpenVerificationModal(false);
    }, 5 * 60 * 1000); // Amount of minutes * seconds * 1000 | 5 mins = 5 * 60 * 1000

    return () => clearTimeout(timeout); // Clear timeout on unmount or modal close
  }, [openVerificationModal, setOpenVerificationModal]);

  const handleVerification = async () => {
    // Placeholder: Hook this into your backend call
    setLoading(true);
    try {
      const response = await apiService.post("/api/users", {
        ...verificationData,
        verificationCode,
      });

      if (response.status === 201) {
        setUserData(response.data.userData);

        localStorage.setItem("prebuilds_auth_token", response.data.token);

        navigate("/");
        showNotification(response.data.successMessage, "successMessage");
      }

      navigate("/");
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        showNotification(error.response.data.databaseError, "databaseError");
      }
    } finally {
      setLoading(false);
    }

    // Add logic to validate and submit token
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 transition-all duration-300 ease-in-out transform scale-100 opacity-100"
        style={{
          transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
        }}
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Verify Your Email</h3>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          We've sent a verification code to <span className="font-medium">{verificationData?.user_email}</span>. Please enter it below to complete
          your registration.
        </p>

        <input
          type="text"
          placeholder="Enter verification code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
        />

        <div className="flex justify-end space-x-2">
          <button
            onClick={handleVerification}
            disabled={verificationCode.trim() === ""}
            className={`py-1 px-3 rounded text-white ${
              verificationCode.trim() === "" ? "bg-gray-500 cursor-not-allowed" : "bg-indigo-500 hover:bg-indigo-600"
            }`}
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountVerification;
