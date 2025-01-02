import React, { useEffect, useState } from "react";
import DarkModeToggle from "./DarkModeToggle";
import Logo from "../assets/images/PreBuilds_Logo.png";
import "@fontsource/roboto";
import UserButtons from "./UserButtons";
import { Link } from "react-router-dom";
import "boxicons/css/boxicons.min.css";
import apiService from "../api/apiService";
import Font from "react-font";
import { truncateText } from "../utils/TruncateText";



const TopNavbar = ({ userData, setUserData }) => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = () => {
      apiService
        .get("/api/NavBarCategories")
        .then((response) => {
          setCategories(response.data.categories);
          setSubCategories(response.data.subcategories);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching categories:", error);
          setCategories([]);
        });
    };
  
    // Initial fetch
    fetchCategories();
  
    // Set up the interval to fetch categories every 5 seconds (5000ms)
    const intervalId = setInterval(fetchCategories, 5000);
  
    // Cleanup the interval when the component unmounts or the effect is re-run
    return () => clearInterval(intervalId);
  }, []);


  
  
  return (
    <div className="fixed top-0 left-0 w-full h-15 bg-purple-700 text-white z-50">
      <div className="container mx-auto px-4 py-3 flex items-center  justify-between ">
        <div className="text-xl font-bold flex items-center space-x-2 -ml-48">
          <Link to="/" className="flex items-center">
            <img src={Logo} alt="Logo" className="h-10 w-12 animate-spin-slow" />
            <span className="ml-2">
              <Font family="Audiowide">PreBuilds</Font>
            </span>
          </Link>
        </div>
        {loading ? (
          <div className="flex-1 bg-black-700 ml-[700px] overflow-x-auto scroll-smooth relative">
            <div className="flex space-x-2 animate-pulse">
              <div className="w-3 h-3 bg-purple-200 rounded-full"></div>
              <div className="w-3 h-3 bg-purple-300 rounded-full"></div>
              <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
            </div>
          </div>
        ) : (
          <nav className="flex-1 bg-black-700 max-w-[1275px] overflow-x-auto scroll-smooth mr-[235px] relative ">
            <ul className="flex space-x-2 justify-center">
              {/* Dynamic List Items */}
              {categories.map((category) => {
                // Only show category if it has a name and no subcategory is "Unspecified"
                const hasSubcategories = subCategories.some((subcategory) => subcategory.category_id === category.category_id);

                return (
                  <li key={category.category_id} className="relative group text-sm ">
                    <Link to={"/c-" + category.category_id + "-" + category.category_name.replace(/\s+/g, '') }  className="hover:bg-purple-800 px-3 py-2 rounded font-roboto-mono">{truncateText(category.category_name, 15)}</Link>

                    {/* Only show the dropdown if subcategories exist */}
                    {hasSubcategories && (
                      <ul className="absolute left-0 top-full hidden group-hover:block bg-gray-800 p-2 rounded w-max z-10 pt-1 ">
                        {subCategories
                          .filter((subcategory) => subcategory.category_id === category.category_id)
                          .map((subcategory) => (
                            <li key={subcategory.subcategory_id}>
                              <Link to={"/s-" + subcategory.subcategory_id + "-" + subcategory.subcategory_name.replace(/\s+/g, '') } className="text-white hover:bg-purple-600 px-3 py-2 rounded block w-full">
                                {subcategory.subcategory_name}
                              </Link>
                            </li>
                          ))}
                      </ul>
                    )}
                  </li>
                );
              })}

              {/* Additional Buttons */}
              <li className="flex ml-62 ">
                <button className="font-roboto-mono hover:bg-purple-800  rounded text-sm ">{<i className='bx bxs-star-half bx-flashing mr-1' style={{color: "orange"}} ></i>}New{<i className='bx bxs-star-half bx-flashing ml-1' style={{color: "orange"}} ></i>}</button>
                <button className="font-roboto-mono hover:bg-purple-800  rounded text-sm w-28 ">{<i className='bx bxs-purchase-tag bx-flashing mr-1' style={{color: "yellow"}} ></i>}On Sale{<i className='bx bxs-purchase-tag bx-flashing ml-1' style={{color: "yellow"}} ></i>}</button>
              </li>
            </ul>
          </nav>
        )}
        {/* Dark Mode Toggle - Positioned on the far right edge */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <DarkModeToggle />
        </div>
        <div className="absolute right-20">
          <UserButtons userData={userData} setUserData={setUserData} />
        </div>

        {/* Mobile Menu Toggle */}
      </div>

      {/* Mobile Menu */}
    </div>
  );
};

export default TopNavbar;
