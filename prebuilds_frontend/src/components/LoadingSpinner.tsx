import Logo from "../assets/images/PreBuilds_Logo.png";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <img src={Logo} alt="Loading..." className="h-20 w-24 animate-spin" />
    </div>
  );
};

export default LoadingSpinner;
