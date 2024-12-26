import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const AdminNavBar = ({ userData }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [shouldDisplayNavbar, setShouldDisplayNavbar] = useState(false);
  const navbarRef = useRef(null);

  useEffect(() => {
    // Determine if the navbar should be displayed
    if (userData && userData.user_role && userData.user_role !== "Client") {
      setShouldDisplayNavbar(true);
    } else {
      setShouldDisplayNavbar(false);
    }
  }, [userData]);

  useEffect(() => {
    // Function to handle click outside the navbar
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsCollapsed(true); // Collapse the navbar when clicking outside
      }
    };

    // Add event listener for clicks on the document
    document.addEventListener("click", handleClickOutside);

    // Clean up the event listener when the component is unmounted or the effect is re-run
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      {shouldDisplayNavbar ? (
        <div>
          {/* Right-side Navbar */}
          <div
            ref={navbarRef}
            className={`fixed top-16 right-0 h-screen bg-blue-900 text-white p-6 overflow-y-auto transition-all duration-300 ${
              isCollapsed ? "w-[15px] p-2" : "w-56 p-6 z-20 "
            }`}
          >
            {/* Collapse Button */}
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-white text-2xl mb-4 focus:outline-none -ml-2">
              {isCollapsed ? <i className="bx bx-list-ul bx-rotate-180"></i> : <i className="bx bx-exit"></i>} {/* Menu and Close emojis */}
            </button>

            {/* Navbar Content */}
            {!isCollapsed && (
              <div>
                <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>

                <ul>
                  <li className="mb-4">
                    <button className="hover:bg-purple-700 p-2 rounded w-full text-left">
                      <i className="bx bxs-add-to-queue"></i> New Product
                    </button>
                  </li>
                  <li className="mb-4">
                    <button className="hover:bg-purple-700 p-2 rounded w-full text-left">
                      <i className="bx bx-list-ul"></i> Product List
                    </button>
                  </li>

                  <li className="mb-4">
                    <button className="hover:bg-purple-700 p-2 rounded w-full text-left">
                      <i className="bx bxs-add-to-queue"></i> New Category
                    </button>
                  </li>
                  <li className="mb-4">
                    <button className="hover:bg-purple-700 p-2 rounded w-full text-left">
                      <i className="bx bx-list-ul"></i> Category List
                    </button>
                  </li>
                  <li className="mb-4">
                    <button className="hover:bg-purple-700 p-2 rounded w-full text-left">
                      <i className="bx bx-bell"></i> Pending Orders
                    </button>
                  </li>
                  {userData.user_role === "Owner" ? (
                    <li className="mb-4">
                      <Link to="/UsersDashboard">
                        <i className="bx bxs-key"></i> Users Dashboard
                      </Link>
                    </li>
                  ) : null}
                </ul>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default AdminNavBar;
