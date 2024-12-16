import axios from "axios";
import React, { useState, useEffect } from "react";
import apiService from "../api/apiService";

const AdminNavBar = ({ userData, setUserData }) => {
  

  const [isCollapsed, setIsCollapsed] = useState(true);

  // Check if user is logged in and not a client
  const shouldDisplayNavbar = userData && userData.user_role !== "Client";

  return (
    <>
      {shouldDisplayNavbar && (
        <div>
          {/* Right-side Navbar */}
          <div
            className={`fixed top-16 right-0 h-screen bg-blue-900 text-white p-6 overflow-y-auto transition-all duration-300 ${
              isCollapsed ? "w-[15px] p-2" : "w-56 p-6"
            }`}
          >
            {/* Collapse Button */}
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-white text-2xl mb-4 focus:outline-none -ml-2">
              {isCollapsed ? "☰" : "✖️"} {/* Menu and Close emojis */}
            </button>

            {/* Navbar Content */}
            {!isCollapsed && (
              <div>
                <h2 className="text-xl font-bold mb-6">Admin Dashboard </h2>

                <ul>
                  <li className="mb-4">
                    <button className="hover:bg-gray-700 p-2 rounded w-full text-left"><i className='bx bxs-add-to-queue' ></i> New Product</button>
                  </li>
                  <li className="mb-4">
                    <button className="hover:bg-gray-700 p-2 rounded w-full text-left"><i className='bx bxs-add-to-queue' ></i> New Category</button>
                  </li>
                  <li className="mb-4">
                    <button className="hover:bg-gray-700 p-2 rounded w-full text-left"><i className='bx bx-list-ul' ></i> Category List</button>
                  </li>
                  <li className="mb-4">
                    <button className="hover:bg-gray-700 p-2 rounded w-full text-left"><i className='bx bx-bell' ></i> Pending Orders</button>
                  </li>
                  {userData.user_role === "Owner" ? (
                    <li className="mb-4">
                      <button className="hover:bg-gray-700 p-2 rounded w-full text-left"><i className='bx bxs-key'></i> Users Dashboard</button>
                    </li>
                  ) : null}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminNavBar;
