import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import setTitle from "../../utils/DocumentTitle";
import apiService from "../../api/apiService";
import LoadingSpinner from "../../components/PreBuildsLoading";

const UsersDashboard = ({ userData, setUserData, title }) => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState(null);
  const navigate = useNavigate();
  setTitle(title);

  useEffect(() => {
    if (!userData || !userData.user_id) {
      // If nobody is logged in, redriect user to the index page.
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

  console.log(users);

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
              {loading ? (
                <tr>
                  <td colSpan="11" className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : (
                users?.map((user) => (
                  <tr key={user.user_id}>
                    <td className="py-2 px-4 border-b dark:border-gray-600">{user.user_id}</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">{user.user_username}</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">
                      {user.user_lastname} {user.user_firstname}{" "}
                    </td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">{user.user_phone}</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">{user.user_country}</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">{user.user_address}</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">{user.user_email}</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">{user.user_registration_date}</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">{user.user_last_logged_at}</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">
                      <span className="mr-1">
                        {user.user_role === "Owner" && <i className="bx bxs-crown bx-flashing mr-1" style={{ color: "#f0ff00" }}></i>}
                        {user.user_role === "Admin" && <i className="bx bxs-briefcase bx-flashing mr-1" style={{ color: "#27ff00" }}></i>}
                        {user.user_role === "Client" && <i class="bx bx-money mr-1 "></i>}
                        {user.user_role}
                      </span>
                    </td>

                    <td className="py-2 px-4 border-b dark:border-gray-600">{user.user_account_status}</td>
                    <td className="py-2 px-4 border-b dark:border-gray-600">
                      <Link
                        to={`/editUser/${user.user_id}`}
                        className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600 text-sm link-spacing"
                      >
                        <i className=" bx bx-cog"></i>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default UsersDashboard;
