import React from 'react';
import setTitle from '../utils/DocumentTitle';

const NotFound = ( {title} ) => {
  setTitle(title);
  return (
    <div className="text-center">
      <h1>404</h1>
      <p>The page you're looking for does not exist.</p>
      <a href="/" className="text-blue-500">Go back to the homepage</a>
    </div>
  );
};

export default NotFound;
