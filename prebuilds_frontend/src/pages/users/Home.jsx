import React from "react";


const Home = () => {
  document.title = "Home | PreBuilds"
  return (
    <div className="flex justify-center items-center h-full">
      <div className="text-center">
        <p className="text-lg">Hello, world!</p>
        <h1 className="text-3xl font-bold">Welcome to the Home Page</h1>
      </div>
    </div>
  );
};

export default Home;