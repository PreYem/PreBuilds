import setTitle, { TitleType } from "../utils/DocumentTitle";
import Logo from "../assets/images/PreBuilds_Logo.png";
import { Link } from "react-router-dom";

const PageNotFound = ({ title }: TitleType) => {
  setTitle(title);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="text-center space-y-6 max-w-2xl mx-auto px-6 py-12 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h1 className="flex justify-center items-center">
          <img src={Logo} alt="Loading..." className="h-20 w-24 animate-spin-slow" />
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-400">The page you're looking for is not available.</p>
        <Link to={"/"} className="inline-block px-6 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200">
          Go Back to the products page.
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
