import React from "react";
import "boxicons/css/boxicons.min.css";

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-gray-800 text-white text-center py-1 shadow-md z-20">
      <p className="flex justify-center items-center">
        {" "}
        <span className="mr-2 mt-1">
          <i className="bx bxl-php mr-1 "></i> {/* PHP Logo */}
          <i className="bx bxl-react mr-1 "></i> {/* React Logo */}
          <i className="bx bxl-tailwind-css mr-1 "></i> {/* Tailwind Logo */}
          <i className="bx bxl-typescript mr-1"></i> {/* Typescript Logo */}
        </span>
        Website by{" "}
        <span className="ml-1 text-lg text-white hover:text-gray-300 hover:underline transition-colors animate-textColorChange">PreYem</span>{" "} | Going offline on the 27th of May 2025
        <a href={"https://github.com/PreYem"} target="_blank" rel="noopener noreferrer" className="ml-2">
          <i className="bx bxl-github text-xl bx-spin-slow hover:text-gray-300"></i> {/* GitHub Icon */}
        </a>
        <a href={"https://gitlab.com/PreYem"} target="_blank" rel="noopener noreferrer" className="ml-2">
          <i className="bx bxl-gitlab text-xl bx-spin-slow hover:text-gray-300"></i> {/* GitLab Icon */}
        </a>
        <a href={"https://www.linkedin.com/in/elmoumen-preyem"} target="_blank" rel="noopener noreferrer" className="ml-2">
          <i className="bx bxl-linkedin-square text-xl bx-spin-slow hover:text-gray-300"></i> {/* LinkedIn Icon */}
        </a>
      </p>
    </footer>
  );
};

export default Footer;
