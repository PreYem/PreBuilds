import axios from "axios";
import React, { useEffect, useState } from "react";
import DarkModeToggle from "./DarkModeToggle";
import Logo from "../assets/images/PreBuilds_Logo.png";
import "@fontsource/roboto";
import UserButtons from "./UserButtons";
import { Link } from "react-router-dom";
import 'boxicons/css/boxicons.min.css';
import apiService from "../api/apiService";


const TopNavbar = ({ userD, setUserD }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    apiService
      .get("/api/categories")
      .then((response) => {
        const categoriesWithChildren = response.data.map((category) => {
          if (category.children && typeof category.children === "object") {
            category.children = Object.values(category.children);
          }
          return category;
        });
        setCategories(categoriesWithChildren);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setCategories([]);
      });
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-15 bg-purple-700 text-white z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="text-xl font-bold flex items-center space-x-2 -ml-20">
          <Link to="/" className="flex items-center">
            <img src={Logo} alt="Logo" className="h-10 w-12 animate-spin-slow" />
            <span className="ml-2" style={{ fontFamily: "Sans", fontSize: "25px" }}>
              PreBuilds
            </span>
          </Link>
        </div>

        <nav className="flex-1 bg-black-700 max-w-[1400px] overflow-x-auto scroll-smooth">
          <ul className="flex space-x-6 justify-center">
            {categories.map((category) => (
              <li key={category.category_id} className="relative group">
                <button className="hover:bg-purple-600 px-3 py-2 rounded">{category.category_name}</button>

                {category.children && category.children.length > 0 && (
                  <ul className="absolute left-0 top-full hidden group-hover:block bg-gray-800 p-2 rounded w-max z-10">
                    {category.children.map((child) => (
                      <li key={child.category_id}>
                        <a
                          href={`./?id=${child.category_id}&Type=SubCategory&Name=${child.category_name.replace(" ", "")}`}
                          className="text-white hover:bg-blue-600 px-3 py-2 rounded block w-full"
                        >
                          {child.category_name}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Dark Mode Toggle - Positioned on the far right edge */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <DarkModeToggle />
        </div>
        <div className="absolute right-20" >
          <UserButtons userD={userD} setUserD={setUserD} />
        </div>

        {/* Mobile Menu Toggle */}
      </div>

      {/* Mobile Menu */}
    </div>
  );
};

export default TopNavbar;
