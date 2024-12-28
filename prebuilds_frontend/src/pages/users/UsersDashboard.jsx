import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import setTitle from "../../utils/DocumentTitle";
import apiService from "../../api/apiService";
import LoadingSpinner from "../../components/PreBuildsLoading";
import { truncateText } from "../../utils/TruncateText";
import useRoleRedirect from "../../hooks/useRoleRedirect";

const UsersDashboard = ({ userData, title }) => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]); // Initialize as an empty array
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null); // Store the user to delete
  const [isClosing, setIsClosing] = useState(false); // Track if modal is closing
  const navigate = useNavigate();
  setTitle(title);

  useRoleRedirect(userData, ["Owner"]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiService.get("/api/users/", { withCredentials: true });
        if (response.data) {
          setUsers(response.data);
        }
      } catch (err) {
        navigate("/editUser/" + userData.user_id || "/");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });

    const sortedUsers = [...users].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

    setUsers(sortedUsers);
  };

  const openDeleteModal = (user_id) => {
    setUserToDelete(user_id);
    setShowModal(true);
  };

  const closeDeleteModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setIsClosing(false);
    }, 300);
  };

  const handleDeleteUser = async () => {
    try {
      await apiService.delete("/api/users/" + userToDelete, { withCredentials: true });
      setUsers((prevUsers) => prevUsers.filter((user) => user.user_id !== userToDelete));
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
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
                <th onClick={() => handleSort("user_id")} className="py-2 px-4 border-b dark:border-gray-600 cursor-pointer">
                  ID🠻
                </th>
                <th onClick={() => handleSort("user_username")} className="py-2 px-4 border-b dark:border-gray-600 cursor-pointer">
                  Username🠻
                </th>
                <th onClick={() => handleSort("user_lastname")} className="py-2 px-4 border-b dark:border-gray-600 cursor-pointer">
                  Full Name🠻
                </th>
                <th className="py-2 px-4 border-b dark:border-gray-600">Phone</th>
                <th onClick={() => handleSort("user_country")} className="py-2 px-4 border-b dark:border-gray-600 cursor-pointer">
                  Country
                </th>
                <th className="py-2 px-4 border-b dark:border-gray-600">Address</th>
                <th className="py-2 px-4 border-b dark:border-gray-600">Email</th>
                <th onClick={() => handleSort("user_registration_date")} className="py-2 px-4 border-b dark:border-gray-600 cursor-pointer">
                  Registration Date🠻
                </th>
                <th onClick={() => handleSort("user_last_logged_at")} className="py-2 px-4 border-b dark:border-gray-600 cursor-pointer">
                  Last Logged🠻
                </th>
                <th onClick={() => handleSort("user_role")} className="py-2 px-4 border-b dark:border-gray-600 cursor-pointer">
                  Role🠻
                </th>
                <th onClick={() => handleSort("user_account_status")} className="py-2 px-4 border-b dark:border-gray-600 cursor-pointer">
                  Status🠻
                </th>
                <th className="py-2 px-4 border-b dark:border-gray-600">⚙️ Settings</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(users) && users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.user_id}>
                    <td className="py-2 px-4 border-b dark:border-gray-600">{user.user_id}</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">{truncateText(user.user_username, 10)}</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">{truncateText(user.user_lastname + " " + user.user_firstname, 20)}</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">{user.user_phone}</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">{user.user_country}</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">{truncateText(user.user_address, 20)}</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">{truncateText(user.user_email, 20)}</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">{user.user_registration_date}</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">{user.user_last_logged_at}</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">{user.user_role}</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">{user.user_account_status}</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600 space-x-2">
                      <Link to={`/editUser/${user.user_id}`} className="bg-green-700 text-white py-1 px-2 rounded hover:bg-green-500 text-sm">
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
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="text-center py-4">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`bg-white dark:bg-gray-800 p-6 rounded-lg w-96 transition-all duration-300 ease-in-out transform ${
              isClosing ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
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
