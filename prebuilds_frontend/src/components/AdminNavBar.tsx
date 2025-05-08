import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useSessionContext } from "../context/SessionContext";

const AdminNavBar = () => {
  const { userData } = useSessionContext();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [shouldDisplayNavbar, setShouldDisplayNavbar] = useState(false);
  const navbarRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (userData && userData.user_role && userData.user_role !== "Client") {
      setShouldDisplayNavbar(true);
    } else {
      setShouldDisplayNavbar(false);
    }
  }, [userData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navbarRef.current && event.target instanceof Node && !navbarRef.current.contains(event.target)) {
        setIsCollapsed(true);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.altKey && event.key === "m") {
        setIsCollapsed(!isCollapsed);
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [isCollapsed]);

  return (
    <>
      {shouldDisplayNavbar ? (
        <div className="z-50" >
          {/* Right-side Navbar */}
          <div
            ref={navbarRef}
            className={`fixed top-14 right-0 h-screen bg-blue-900 text-white p-6 overflow-y-auto transition-all duration-300 ${
              isCollapsed ? "w-[15px] p-2" : "w-56 pt-2 z-20 "
            }`}
          >
            {/* Collapse Button */}
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-white text-2xl mb-6 focus:outline-none -ml-2">
              {isCollapsed ? <i className="bx bx-list-ul bx-rotate-180"></i> : <i className="bx bx-exit"></i>} {/* Menu and Close emojis */}
            </button>

            {/* Navbar Content */}
            {!isCollapsed && (
              <div>
                <h2 className="text-lg font-bold mb-4">Admin Dashboard</h2>

                {/* Products Section */}
                <div className="mb-2">
                  <h3 className="text-base font-medium mb-3 border-b pb-1">Products</h3>
                  <ul>
                    <li className="mb-4">
                      <Link to="/AddProduct" className="hover:bg-purple-700 p-1.5 rounded w-full text-left text-sm">
                        <i className="bx bxs-add-to-queue"></i> Add Product
                      </Link>
                    </li>
                    <li className="mb-4">
                      <Link to="/ProductsList" className="hover:bg-purple-700 p-1.5 rounded w-full text-left text-sm">
                        <i className="bx bx-list-ul"></i> Product List
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Categories Section */}
                <div className="mb-2">
                  <h3 className="text-base font-medium mb-3 border-b pb-1">Categories</h3>
                  <ul>
                    {userData?.user_role === "Owner" && (
                      <li className="mb-4">
                        <Link className="hover:bg-purple-700 p-1.5 rounded w-full text-left text-sm" to="/AddCategory">
                          <i className="bx bxs-add-to-queue"></i> Add Category
                        </Link>
                      </li>
                    )}

                    <li className="mb-4">
                      <Link className="hover:bg-purple-700 p-1.5 rounded w-full text-left text-sm" to="/CategoriesList">
                        <i className="bx bx-list-ul"></i> Categories List
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* SubCategories Section */}
                <div className="mb-2">
                  <h3 className="text-base font-medium mb-3 border-b pb-1">Sub-Categories</h3>
                  <ul>
                    {userData?.user_role === "Owner" && (
                      <li className="mb-4">
                        <Link className="hover:bg-purple-700 p-1.5 rounded w-full text-left text-sm" to="/AddSubCategory">
                          <i className="bx bxs-add-to-queue"></i> Add Sub-Category
                        </Link>
                      </li>
                    )}

                    <li className="mb-4">
                      <Link className="hover:bg-purple-700 p-1.5 rounded w-full text-left text-sm" to="/SubCategoriesList">
                        <i className="bx bx-list-ul"></i> Sub-Categories List
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Pending Orders Section */}
                <div className="mb-2">
                  <h3 className="text-base font-medium mb-3 border-b pb-1">Orders</h3>
                  <ul>
                    <li className="mb-4">
                      <Link to={"/"} className="hover:bg-purple-700 p-1.5 rounded w-full text-left text-sm">
                        <i className="bx bx-bell"></i> Pending Orders
                      </Link>
                    </li>
                  </ul>
                </div>

                {userData?.user_role === "Owner" && (
                  <div>
                    <h3 className="text-base font-medium mb-3 border-b pb-1">User Management</h3>
                    <ul>
                      <li className="mb-4">
                        <div className="mb-2">
                          <Link className="hover:bg-purple-700 p-1.5 rounded w-full text-left text-sm" to="/UsersDashboard">
                            <i className="bx bxs-key"></i> Users Dashboard
                          </Link>
                        </div>
                        <div>
                          <Link className="hover:bg-purple-700 p-1.5 rounded w-full text-left text-sm" to="/PreBuildsSettings">
                            <i className="bx bx-cog bx-spin"></i> Settings
                          </Link>
                        </div>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default AdminNavBar;
