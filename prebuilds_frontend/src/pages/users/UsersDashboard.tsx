import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import setTitle, { TitleType } from "../../utils/DocumentTitle";
import apiService from "../../api/apiService";
import LoadingSpinner from "../../components/LoadingSpinner";
import useRoleRedirect from "../../hooks/useRoleRedirect";
import useCloseModal from "../../hooks/useCloseModal";
import DeleteModal from "../DeleteModal";
import useConfirmationCountdown from "../../hooks/useConfirmationCountdown";
import { useSessionContext } from "../../context/SessionContext";
import { UserData } from "../../hooks/useSession";
import { truncateText } from "../../utils/TruncateText";

interface SortConfig {
  key: keyof UserData | null;
  direction: "ascending" | "descending";
}

const UsersDashboard = ({ title }: TitleType) => {
  const { userData } = useSessionContext();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserData[]>([]); // Initialize as an empty array
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: "ascending" });
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number>(); // Store the user to delete
  const [isClosing, setIsClosing] = useState(false); // Track if modal is closing
  const navigate = useNavigate();
  setTitle(title);

  const countdown = useConfirmationCountdown(3, showModal); // Use the custom countdown hook

  useRoleRedirect(["Owner"]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiService.get("/api/users/", { withCredentials: true });
        if (response.data) {
          setUsers(response.data);
        }
      } catch (err) {
        navigate("/editUser/" + userData?.user_id || "/");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleSort = (key: keyof UserData) => {
    let direction: "ascending" | "descending" = "ascending";

    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    
    setSortConfig({ key, direction });

    const sortedUsers = [...users].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
    });

    setUsers(sortedUsers);
  };

  const openDeleteModal = (user_id: number) => {
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

  useCloseModal(closeDeleteModal);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="pt-20 items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 w-max -ml-20 ">
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
                    <td className="py-2 px-4 border-b dark:border-gray-600">{truncateText(user.user_country, 10)}</td>
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
                  <td colSpan={11} className="text-center py-4">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteModal
        showModal={showModal}
        isClosing={isClosing}
        countdown={countdown}
        closeDeleteModal={closeDeleteModal}
        handleDelete={handleDeleteUser}
        target={"User"}
        disclaimer={
          <>
            <span className="font-semibold text-red-600 dark:text-red-400">Disclaimer:</span> It is recommended that you lock the user's account
            instead of deleting it permanently.
          </>
        }
      />
    </>
  );
};

export default UsersDashboard;
