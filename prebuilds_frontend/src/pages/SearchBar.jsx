import React, { useEffect, useState, useRef } from "react";
import apiService from "../api/apiService";
import { MaxCharacterFieldCount } from "../utils/MaxCharacterFieldCount";
import { BASE_API_URL } from "../api/apiConfig";
import { Link } from "react-router-dom";
import Logo from "../assets/images/PreBuilds_Logo.png";

const SearchBar = ({ setProductName, productName }) => {
  const [formData, setFormData] = useState({ product_name: "" });
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [inputTouched, setInputTouched] = useState(false); // Track if user has interacted with input
  const searchBarRef = useRef(null); // Ref for the search bar container

  const handleSearchWord = () => {
    setSearchResult([]);
    setLoading(true);

    apiService
      .get("/api/searchBar/" + formData.product_name, { withCredentials: true })
      .then((response) => {
        setSearchResult(response.data.productsResult || []); // Handle empty array gracefully
        setLoading(false);
      })
      .catch((error) => {
        console.error(error); // Log the error but don't stop the app
        setSearchResult([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    // Debounce the API call, only if input is not empty
    if (debounceTimeout) {
      clearTimeout(debounceTimeout); // Clear previous timeout
    }

    if (formData.product_name.trim() !== "") {
      const timeout = setTimeout(() => {
        handleSearchWord();
      }, 300); // 300ms debounce

      setDebounceTimeout(timeout);

      return () => clearTimeout(timeout); // Cleanup on component unmount
    }
  }, [formData.product_name]);

  useEffect(() => {
    // Add event listener to detect clicks outside the search bar
    const handleClickOutside = (event) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setInputTouched(false); // Hide results when clicking outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Cleanup event listener
    };
  }, []);

  return (
    <div className="relative w-full" ref={searchBarRef}>
      {/* Search Input */}
      <input
        onFocus={() => setInputTouched(true)}
        onChange={(e) => {
          const value = e.target.value;
          MaxCharacterFieldCount(e, 15);
          setFormData({ ...formData, product_name: value });
          setProductName(value);
        }}
        type="text"
        className="w-full py-2 pl-10 pr-4 bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
        placeholder="Search for a product..."
      />
      {/* Dropdown for Search Results */}
      {inputTouched && loading && (
        <div className="absolute z-10 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2">
          <div className="flex justify-center items-center h-36">
            <img src={Logo} alt="Loading..." className="h-20 w-24 animate-spin" />
          </div>
        </div>
      )}
      {inputTouched && searchResult.length > 0 && (
        <div className="absolute z-10 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
          <ul>
            {searchResult.map((product) => (
              <li key={product.product_id} className="flex items-center py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                {/* Product Image */}
                <img
                  src={BASE_API_URL + "/" + product.product_picture}
                  alt={product.product_name}
                  className="w-10 h-10 mr-2 object-cover" // Increased width/height and removed rounded-full
                />
                {/* Product Name */}
                <Link to={"/AddProduct"}>
                  <span>{product.product_name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {inputTouched && !loading && searchResult.length === 0 && formData.product_name.trim() !== "" && (
        <div className="absolute z-10 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
          <p>No results found.</p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
