import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SessionData = () => {
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    // Make a GET request to retrieve session data
    axios
      .get('http://your-laravel-app-url/api/session', { withCredentials: true })
      .then((response) => {
        setSessionData(response.data); // Store session data in state
      })
      .catch((error) => {
        console.error('Error fetching session data:', error);
      });
  }, []);

  if (!sessionData) {
    return <div>Loading session data...</div>;
  }

  return (
    <div>
      <p>User ID: {sessionData.user_id}</p>
      <p>User Role: {sessionData.user_role}</p>
    </div>
  );
};

export default SessionData;
