import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/users")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setData([]);
      });
  }, []);

  return (
    <>
<div className="bg-blue-500 text-white p-4 rounded-lg">
  <h1 className="text-4xl font-bold">Hello, Tailwind!</h1>
  <ul className="space-y-4 mt-4">
    {data.map((item) => (
      <li key={item.id} className="text-xl text-gray-800">
        <strong>Name:</strong> {item.name} <br />
        <strong>Email:</strong> {item.email}
      </li>
    ))}
  </ul>
</div>

    </>
  );
};

export default App;
