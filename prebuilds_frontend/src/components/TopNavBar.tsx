import DarkModeToggle from "./DarkModeToggle";
import Logo from "../assets/images/PreBuilds_Logo.png";
import "@fontsource/roboto";
import UserButtons from "./UserButtons";
import { Link } from "react-router-dom";
import "boxicons/css/boxicons.min.css";
import { truncateText } from "../utils/TruncateText";
import { WEBSITE_NAME } from "../utils/DocumentTitle";

import { useCategories } from "../context/Category-SubCategoryContext";
import { useState } from "react";

const TopNavbar = () => {
  const { categories, subCategories, loading } = useCategories(); // ✅ Use context data

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-15 bg-purple-700 text-white z-50">
      <div className="container  mx-auto px-4 py-3 flex items-center justify-between -ml-4">
        {" "}
        {/* Logo */}
        <div className="flex items-center ml-8">
          <Link to="/" className="flex items-center">
            <img src={Logo} alt="Logo" className="h-8 w-10 animate-spin-slow" />
            <span className="md:inline customFont">{WEBSITE_NAME} +</span>
          </Link>
        </div>
        {/* Mobile Menu Toggle (for smaller screens) */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-white focus:outline-none">
            <i className="bx bx-menu text-2xl"></i>
          </button>
        </div>
        {/* Navigation - Responsive Behavior */}
        <nav
          className={`
          fixed inset-0 bg-purple-900 z-60 transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}
          md:static md:translate-x-0 md:bg-transparent
        `}
        >
          {/* Close Button for Mobile */}
          <button onClick={toggleMobileMenu} className="md:hidden absolute top-4 right-4 text-white text-2xl">
            <i className="bx bx-x"></i>
          </button>

          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="flex space-x-2 animate-pulse">
                <div className="w-3 h-3 bg-purple-200 rounded-full"></div>
                <div className="w-3 h-3 bg-purple-300 rounded-full"></div>
                <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
              </div>
            </div>
          ) : (
            <ul className="flex flex-col md:flex-row space-y-4 mr-12 md:space-y-0 md:space-x-2 justify-start items-center h-full p-4 md:p-0 md:transform md:-translate-x-12">
              {categories.map((category) => {
                const hasSubcategories = subCategories.some((subcategory) => subcategory.category_id === category.category_id);

                return (
                  <li key={category.category_id} className="relative group w-full md:w-auto text-center">
                    <Link
                      to={"/c-" + category.category_id + "-" + category.category_name.replace(/\s+/g, "")}
                      className="hover:bg-purple-800 px-3 py-2 rounded font-roboto-mono block md:inline-blockw-full text-sm"
                      onClick={isMobileMenuOpen ? toggleMobileMenu : undefined}
                    >
                      {truncateText(category.category_name, 15)}
                    </Link>

                    {/* Dropdown for Subcategories - Mobile Friendly */}
                    {hasSubcategories && (
                      <ul
                        className="
                        md:absolute 
                        left-0 
                        top-full 
                        hidden 
                        md:group-hover:block 
                        bg-gray-800 
                        p-2 
                        rounded 
                        w-full 
                        md:w-max 
                        z-60
                      "
                      >
                        {subCategories
                          .filter((subcategory) => subcategory.category_id === category.category_id)
                          .map((subcategory) => (
                            <li key={subcategory.subcategory_id} className="w-full">
                              <Link
                                to={"/s-" + subcategory.subcategory_id + "-" + subcategory.subcategory_name.replace(/\s+/g, "")}
                                className="
                                  text-white 
                                  hover:bg-purple-600 
                                  px-3 
                                  py-2 
                                  rounded 
                                  block 
                                  w-full 
                                  whitespace-nowrap 
                                  overflow-hidden 
                                  text-ellipsis
                                "
                                onClick={isMobileMenuOpen ? toggleMobileMenu : undefined}
                              >
                                {subcategory.subcategory_name}
                              </Link>
                            </li>
                          ))}
                      </ul>
                    )}
                  </li>
                );
              })}
              {/* Additional Buttons - Mobile Friendly */}
              <li className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
                <Link
                  className="
                    font-roboto-mono 
                    hover:bg-green-800 
                    rounded 
                    text-sm 
                    whitespace-nowrap 
                    px-3 
                    py-2 
                    block 
                    text-center 
                    w-full 
                    md:w-auto
                  "
                  to={"/NewestProducts"}
                  onClick={isMobileMenuOpen ? toggleMobileMenu : undefined}
                >
                  <i className="bx bxs-star-half bx-flashing mr-1" style={{ color: "orange" }}></i>
                  New
                  <i className="bx bxs-star-half bx-flashing ml-1" style={{ color: "orange" }}></i>
                </Link>
                <Link
                  className="
                    font-roboto-mono 
                    hover:bg-yellow-800 
                    rounded 
                    text-sm 
                    whitespace-nowrap 
                    px-3 
                    py-2 
                    block 
                    text-center 
                    w-full 
                    md:w-auto
                  "
                  to={"/DiscountedProducts"}
                  onClick={isMobileMenuOpen ? toggleMobileMenu : undefined}
                >
                  <i className="bx bxs-purchase-tag bx-flashing mr-1" style={{ color: "yellow" }}></i>
                  On Sale
                  <i className="bx bxs-purchase-tag bx-flashing ml-1" style={{ color: "yellow" }}></i>
                </Link>
              </li>
            </ul>
          )}
        </nav>
        {/* Dark Mode Toggle - Positioned Appropriately */}
        <div className="hidden md:block absolute right-2 top-1/2 transform -translate-y-1/2">
          <DarkModeToggle />
        </div>
        {/* User Buttons - Positioned Appropriately */}
        <div className="hidden md:block absolute mr-16 right-1 top-1/2 transform -translate-y-1/2">
          <UserButtons />
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
