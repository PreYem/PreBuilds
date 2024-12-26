import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import setTitle from "../../utils/DocumentTitle";
import apiService from "../../api/apiService";
import LoadingSpinner from "../../components/PreBuildsLoading";
import { truncateText } from "../../utils/TruncateText";

const UsersDashboard = ({ userData, setUserData, title }) => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null); // Store the user to delete
  const [isClosing, setIsClosing] = useState(false); // Track if modal is closing
  const navigate = useNavigate();
  setTitle(title);

  useEffect(() => {
    if (!userData || !userData.user_id) {
      // If nobody is logged in, redirect user to the index page.
      console.log("No user data found, redirecting to /");
      navigate("*");
    }

    if (userData.user_role !== "Owner") {
      console.log("User is not an owner and trying to edit someone else's data, redirecting...");
      navigate("*");
    }
  }, [userData, navigate]);

  useEffect(() => {
    // Fetch user data based on user_id
    const fetchUsers = async () => {
      try {
        const response = await apiService.get("/api/users/", {
          withCredentials: true, // Include credentials if needed
        });

        if (response.data) {
          setUsers(response.data);
        }
      } catch (err) {
        if (userData.user_id) {
          navigate("/editUser/" + userData.user_id);
        } else {
          navigate("/");
        }
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleDeleteUser = async () => {
    try {
      // Store the response from the delete API call
      const response = await apiService.delete("/api/users/" + userToDelete, { withCredentials: true });

      // Log the response data

      // Optionally, update your users state here to remove the deleted user
      setUsers((prevUsers) => prevUsers.filter((user) => user.user_id !== userToDelete));
      setShowModal(false); // Close the modal after deletion
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const openDeleteModal = (user_id) => {
    setUserToDelete(user_id);
    setShowModal(true); // Show the confirmation modal
  };

  const closeDeleteModal = () => {
    setIsClosing(true); // Set the modal to closing
    setTimeout(() => {
      setShowModal(false); // Actually hide the modal after the animation completes
      setIsClosing(false);
    }, 300); // Ensure the modal stays visible long enough for the animation to complete
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="pt-20 items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 w-max -ml-8">
        <h1 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 text-center">Currently Registered Accounts:</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <thead className="bg-gray-800 dark:bg-gray-700 text-white">
              <tr>
                <th className="py-2 px-4 border-b dark:border-gray-600">ID</th>
                <th className="py-2 px-4 border-b dark:border-gray-600">Username</th>
                <th className="py-2 px-4 border-b dark:border-gray-600">Full Name</th>
                <th className="py-2 px-4 border-b dark:border-gray-600">Phone</th>
                <th className="py-2 px-4 border-b dark:border-gray-600">Country</th>
                <th className="py-2 px-4 border-b dark:border-gray-600">Address</th>
                <th className="py-2 px-4 border-b dark:border-gray-600">Email</th>
                <th className="py-2 px-4 border-b dark:border-gray-600">Registration Date</th>
                <th className="py-2 px-4 border-b dark:border-gray-600">Last Logged</th>
                <th className="py-2 px-4 border-b dark:border-gray-600">Role</th>
                <th className="py-2 px-4 border-b dark:border-gray-600">Status</th>
                <th className="py-2 px-4 border-b dark:border-gray-600">⚙️ Settings</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user.user_id}>
                  <td className="py-2 px-4 border-b dark:border-gray-600">{user.user_id}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-600">{user.user_username}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-600">
                    {user.user_lastname} {user.user_firstname}
                  </td>
                  <td className="py-2 px-4 border-b dark:border-gray-600">{user.user_phone}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-600">{user.user_country}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-600">{truncateText(user.user_address, 20)}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-600">{truncateText(user.user_email, 20)}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-600">{user.user_registration_date}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-600">{user.user_last_logged_at}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-600">
                    <span className="mr-1">
                      {user.user_role === "Owner" && <i className="bx bxs-crown bx-flashing mr-1" style={{ color: "#f0ff00" }}></i>}
                      {user.user_role === "Admin" && <i className="bx bxs-briefcase bx-flashing mr-1" style={{ color: "#27ff00" }}></i>}
                      {user.user_role === "Client" && <i className="bx bx-money mr-1"></i>}
                      {user.user_role}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b dark:border-gray-600">{user.user_account_status}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-600 space-x-2">
                    <Link
                      to={`/editUser/${user.user_id}`}
                      className="bg-green-700 text-white py-1 px-2 rounded hover:bg-green-500 text-sm link-spacing"
                    >
                      <i className="bx bx-cog"></i>
                    </Link>
                    {user.user_role !== "Owner" && (
                      <button
                        onClick={() => openDeleteModal(user.user_id)}
                        className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 transition ease-in-out duration-300 text-sm"
                      >
                        <i className="bx bxs-trash-alt"></i>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`bg-white dark:bg-gray-800 p-6 rounded-lg w-96 transition-all duration-300 ease-in-out transform ${
              isClosing ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
            style={{
              transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
            }}
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Are you sure you want to proceed? <br />
            </h3>
            <span className="text-red-500 font-bold bg-yellow-100 p-2 rounded border border-yellow-500 mt-2 inline-block">
              ⚠️ This action is <span className="font-semibold">irreversible</span> and cannot be undone.
            </span>

            <div className="mt-4 flex justify-end space-x-2">
              <button onClick={closeDeleteModal} className="bg-gray-400 text-white py-1 px-3 rounded hover:bg-gray-500">
                Cancel
              </button>
              <button onClick={handleDeleteUser} className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">
                Delete User Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UsersDashboard;
