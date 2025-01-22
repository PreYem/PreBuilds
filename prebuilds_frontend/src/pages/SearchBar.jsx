import React, { useEffect, useState } from "react";
import apiService from "../api/apiService";
import { MaxCharacterFieldCount } from "../utils/MaxCharacterFieldCount";
import { BASE_API_URL } from "../api/apiConfig";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/PreBuildsLoading";


const SearchBar = ({ setProductName, productName }) => {
  const [formData, setFormData] = useState({ product_name: "" });
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

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
    // Debounce the API call
    if (debounceTimeout) {
      clearTimeout(debounceTimeout); // Clear previous timeout
    }

    const timeout = setTimeout(() => {
      handleSearchWord();
    }, 300); // 300ms debounce

    setDebounceTimeout(timeout);

    return () => clearTimeout(timeout); // Cleanup on component unmount
  }, [formData.product_name]);

  return (
    <div className="relative w-full"> {/* Relative container */}
      {/* Search Input */}
      <input
        onChange={(e) => {
          const value = e.target.value;
          MaxCharacterFieldCount(e, 15); // Enforce character limit
          setFormData({ ...formData, product_name: value });
          setProductName(value); // Update parent state
        }}
        type="text"
        className="w-full py-2 pl-10 pr-4 bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
        placeholder="Search for a product..."
      />

      {/* Dropdown for Search Results */}

      {!loading && (
        <div className="absolute z-10 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2">
          <div className="flex justify-center items-center h-10">
            <LoadingSpinner />
          </div>
        </div>
      )}

      {searchResult.length > 0 && (
        <div className="absolute z-10 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
          <ul>
            {searchResult.map((product) => (
              <li
                key={product.product_id}
                className="flex items-center py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              >
                {/* Product Image */}
                <img
                  src={BASE_API_URL + "/" + product.product_picture}
                  alt={product.product_name}
                  className="w-8 h-8 rounded-full mr-2 object-cover"
                />
                {/* Product Name */}
                

                <Link to={"/AddProduct"} >
                <span>{product.product_name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {!loading && searchResult.length === 0 && (
        <div className="absolute z-10 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
          <p>No results found.</p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
