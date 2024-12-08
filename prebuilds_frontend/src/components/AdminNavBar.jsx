import React, { useState } from "react";

const AdminNavBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="relative flex h-screen">
      {/* Right-side Navbar */}
      <div
        className={`fixed top-16 right-0 h-full bg-blue-900 text-white p-6 overflow-y-auto transition-all duration-300 ${
          isCollapsed ? "w-[15px] p-2" : "w-56 p-6"
        }`}
      >
        {/* Collapse Button */}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-white text-2xl mb-4 focus:outline-none -ml-2 ">
          {isCollapsed ? "☰" : "✖️"} {/* Menu and Close emojis */}
        </button>

        {/* Navbar Content */}
        {!isCollapsed && (
          <div>
            <h2 className="text-1xl font-bold mb-6">Admin Dashboard</h2>

            <ul>
              <li className="mb-4">
                <button className="hover:bg-gray-700 p-2 rounded w-full text-left">Add Product</button>
              </li>
              <li className="mb-4">
                <button className="hover:bg-gray-700 p-2 rounded w-full text-left">Add Category</button>
              </li>
              <li className="mb-4">
                <button className="hover:bg-gray-700 p-2 rounded w-full text-left">Manage Orders</button>
              </li>
              <li className="mb-4">
                <button className="hover:bg-gray-700 p-2 rounded w-full text-left">Manage Users</button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNavBar;
