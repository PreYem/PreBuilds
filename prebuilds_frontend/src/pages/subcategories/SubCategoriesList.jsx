import React, { useEffect, useState } from "react";
import setTitle from "../../utils/DocumentTitle";
import useRoleRedirect from "../../hooks/useRoleRedirect";
import apiService from "../../api/apiService";
import LoadingSpinner from "../../components/PreBuildsLoading";
import { truncateText } from "../../utils/TruncateText";

const SubCategoriesList = ({ userData, title }) => {
  setTitle(title);
  useRoleRedirect(userData, ["Owner", "Admin"]);
  const [loading, setLoading] = useState(true);
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    apiService
      .get("/api/subcategories")
      .then((response) => {
        setSubCategories(response.data);
        console.log(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setSubCategories([]);
      });
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="pt-20 ml-20 items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 w-max ">
        <h1 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 text-center">List of Currently Registered Sub-Categories</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <thead className="bg-gray-800 dark:bg-gray-700 text-white">
              <tr>
                <th className="py-2 px-4 border-b dark:border-gray-600 cursor-pointer text-sm" >
                  Display Order🠻
                </th>
                <th className="py-2 px-4 border-b dark:border-gray-600 cursor-pointer text-sm " >
                  Sub-Category Name🠻
                </th>
                <th className="py-2 px-4 border-b dark:border-gray-600 cursor-pointer text-sm " >
                  Sub-Category Description🠻
                </th>
                <th className="py-2 px-4 border-b dark:border-gray-600 cursor-pointer text-sm " >
                  Parent Category 🠻
                </th>
                <th className="py-2 px-4 border-b dark:border-gray-600 cursor-pointer text-sm " >
                  Product Count🠻
                </th>
                <th className="py-2 px-4 border-b dark:border-gray-600">⚙️ Settings</th>
              </tr>
            </thead>
            <tbody>
              {subCategories?.map((subCategory) => (
                <tr key={subCategory.subcategory_id}>
                  <td className="py-2 px-4 border-b dark:border-gray-600  ">{subCategory.subcategory_display_order}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-600">{subCategory.subcategory_name}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-600">{truncateText(subCategory.subcategory_description, 100)}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-600">{subCategory.parent_category_name}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-600">{subCategory.product_count}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-600  space-x-2">
                    {subCategory.subcategory_name !== "Unspecified" ? (
                      <>
                        <button
                          
                          className="bg-green-700 text-white py-1 px-2 rounded hover:bg-green-500 text-sm link-spacing"
                        >
                          <i className="bx bx-cog"></i>
                        </button>
                        <button
                          
                          className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 transition ease-in-out duration-300 text-sm"
                        >
                          <i className="bx bxs-trash-alt"></i>
                        </button>
                      </>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default SubCategoriesList;
