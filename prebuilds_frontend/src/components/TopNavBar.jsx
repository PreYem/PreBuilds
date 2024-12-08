import axios from "axios";
import React, { useEffect, useState } from "react";

const TopNavbar = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/categories")
      .then((response) => {
        // Accessing the data inside response.data
        setCategories(response.data); // response.data contains the response body
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setCategories([]); // Handling error by setting an empty array
      });
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full bg-purple-700 text-white z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-bold">PreBuilds</div>

        {/* Navigation Links */}
        <nav>
          <ul className="hidden md:flex space-x-6">
            {categories.map((category) => (
              <li key={category.category_id}>
                {" "}
                {/* Use the unique id as key */}
                <button className="hover:bg-purple-600 px-3 py-2 rounded">
                  {category.category_name} {/* Access the correct field */}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button className="text-xl">☰</button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden bg-purple-800 p-4">
        <ul className="space-y-4">
          {categories.map((category) => (
            <li key={category.category_id}>
              {" "}
              {/* Use the unique id as key */}
              <button className="block w-full text-left hover:bg-purple-600 px-3 py-2 rounded">
                {category.category_name} {/* Access the correct field */}
              </button>
            </li>
          ))}

        </ul>
      </div>
    </div>
  );
};

export default TopNavbar;
