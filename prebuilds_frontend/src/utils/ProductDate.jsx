export const formatDate = (dateString) => {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day}/${month}/${year} At ${hours}:${minutes}:${seconds}`;
};

export const calculateProductAge = (dateCreatedString) => {
  const dateCreated = new Date(dateCreatedString);
  const now = new Date();

  const diffInMilliseconds = now - dateCreated;
  const seconds = Math.floor(diffInMilliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // Human-readable format
  let product_age = '';
  if (days > 0) {
    product_age = `${days} day${days > 1 ? "s" : ""}`;
  } else if (hours > 0) {
    product_age = `${hours} hour${hours > 1 ? "s" : ""}`;
  } else if (minutes > 0) {
    product_age = `${minutes} minute${minutes > 1 ? "s" : ""}`;
  } else {
    product_age = `${seconds} second${seconds > 1 ? "s" : ""}`;
  }

  // Return both the human-readable string and the total minutes
  return {
    product_age, // Human-readable age
    product_age_in_minutes: minutes, // Total minutes
  };
};
