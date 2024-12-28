import React, { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import AdminNavBar from "./components/AdminNavBar";
import TopNavbar from "./components/TopNavBar";
import Register from "./pages/users/Register";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/users/Login";
import NotFound from "./pages/PageNotFound";
import Footer from "./components/Footer";
import useSession from "./hooks/useSession";
import useUserCheck from "./hooks/useUserCheck";
import EditUser from "./pages/users/EditUser";
import LoadingSpinner from "./components/PreBuildsLoading";
import UserManagement from "./pages/users/UsersDashboard";
import CategoriesList from "./pages/categories/CategoriesList";
import AddCategory from "./pages/categories/AddCategory";

const App = () => {
  const { userData, setUserData, loading } = useSession();
  useUserCheck(userData, setUserData);

  const [categories, setCategories] = useState([]);

  // Log the user data on each render
  console.log(userData);

  // Ensure loading is handled correctly
  if (loading) {
    return <LoadingSpinner />; // Prevent rendering if loading or userData is not yet available
  }

  return (
    <>
      <ThemeProvider>
        <Router>
          <div className="bg-white dark:bg-gray-900 text-black dark:text-white h-4/5">
            {/* Dark mode toggle button */}

            {/* Top and Admin Navbar */}
            <TopNavbar userData={userData} setUserData={setUserData}  />
            <AdminNavBar userData={userData} setUserData={setUserData} />

            {/* Main content container */}
            <div className="p-1 w-4/5 mx-auto h-1/5">
              <Routes>
                <Route path="/" element={<Home userData={userData} setUserData={setUserData} user_role={userData?.user_role} title="Home" />} />
                <Route path="/register" element={<Register userData={userData} setUserData={setUserData} title="Sign Up" />} />
                <Route path="/login" element={<Login userData={userData} setUserData={setUserData} title="Sign In" />} />
                <Route
                  path="/editUser/:user_id"
                  element={
                    userData ? (
                      <EditUser userData={userData} setUserData={setUserData} title={userData.user_firstname} />
                    ) : (
                      <Navigate to="/login" /> // Redirect to login page if no user data
                    )
                  }
                />
                <Route path="/UsersDashboard" element={<UserManagement userData={userData} setUserData={setUserData} title="Users Dashboard" />} />
                <Route path="/CategoriesList" element={<CategoriesList userData={userData} title="Categories" categories={categories} setCategories={setCategories} />} />
                <Route path="/AddCategory" element={<AddCategory userData={userData} title="Add Category" categories={categories} setCategories={setCategories} />} />

                <Route path="*" element={<NotFound title="Page Not Found" />} />
              </Routes>
            </div>
          </div>
          <Footer />
        </Router>
      </ThemeProvider>
    </>
  );
};

export default App;
