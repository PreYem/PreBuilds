import { Link, useNavigate } from "react-router-dom";
import "boxicons/css/boxicons.min.css";
import ShoppingCart from "./ShoppingCartNotification";
import { truncateText } from "../utils/TruncateText";
import { useSessionContext } from "../context/SessionContext";
import useLogout from "../utils/useLogout";
import { useNotification } from "../context/GlobalNotificationContext";

const UserButtons = () => {
  const { userData } = useSessionContext();
  const { showNotification } = useNotification();
  const logout = useLogout();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showNotification( "We hope to see you again soon " + userData?.user_firstname + '!' , 'warningMessage')
  };

  if (!userData) {
    return (
      <div className="flex space-x-2">
        <button
          className="px-4 py-1 bg-transparent text-white rounded-lg shadow-none hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none transition duration-600 ease-in-out text-sm"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
        <button
          className="px-4 py-1 bg-transparent text-white rounded-lg shadow-none hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none transition duration-600 ease-in-out text-sm"
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </div>
    );
  }

  return (
    <div>
      {userData?.user_id ? (
        // Show "Logout" button and user's name if user is logged in
        <div className="flex items-center space-x-2">
          <ShoppingCart />
          <Link className="text-gray-300 hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium" to={"/EditUser/" + userData.user_id}>
            <span className="text-white font-medium">
              Logged in as:
              <br />
              {userData?.user_role === "Owner" && (
                <span className="mr-1">
                  <i className="bx bxs-crown bx-flashing" style={{ color: "#f0ff00" }}></i>
                </span>
              )}
              {userData?.user_role === "Admin" && (
                <span className="mr-1">
                  <i className="bx bxs-briefcase bx-flashing" style={{ color: "#27ff00" }}></i>
                </span>
              )}
              {userData?.user_role === "Client" && (
                <span className="mr-1">
                  <i className="bx bx-user-pin"></i>
                </span>
              )}
              {truncateText(userData.user_firstname, 10)}
            </span>
          </Link>

          <button
            className="px-4 py-1 bg-transparent text-white rounded-lg shadow-none hover:bg-red-700 dark:hover:bg-red-700 focus:outline-none transition duration-600 ease-in-out text-sm"
            onClick={handleLogout}
          >
            <i className="bx bxs-door-open"></i> Logout
          </button>
        </div>
      ) : (
        // Show "Login" and "Register" buttons if no user is logged in
        <div className="flex space-x-2">
          <button
            className="px-4 py-1 bg-transparent text-white rounded-lg shadow-none hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none transition duration-600 ease-in-out text-sm"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className="px-4 py-1 bg-transparent text-white rounded-lg shadow-none hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none transition duration-600 ease-in-out text-sm"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
      )}
    </div>
  );
};

export default UserButtons;
