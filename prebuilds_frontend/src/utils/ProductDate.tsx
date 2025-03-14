export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  // Use a fallback if padStart is not available
  const pad = (num: number) => (num < 10 ? `0${num}` : `${num}`);

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1); // Months are zero-based in JavaScript
  const year = date.getFullYear();

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${day}/${month}/${year} At ${hours}:${minutes}:${seconds}`;
};

export const calculateProductAge = (dateCreatedString: string) => {
  const dateCreated = new Date(dateCreatedString);
  const now = new Date();

  const diffInMilliseconds = now.getTime() - dateCreated.getTime();
  const seconds = Math.floor(diffInMilliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  let product_age = "";
  if (days > 0) {
    product_age = `${days} day${days > 1 ? "s" : ""}`;
  } else if (hours > 0) {
    product_age = `${hours} hour${hours > 1 ? "s" : ""}`;
  } else if (minutes > 0) {
    product_age = `${minutes} minute${minutes > 1 ? "s" : ""}`;
  } else {
    product_age = `${seconds} second${seconds > 1 ? "s" : ""}`;
  }

  return {
    product_age,
    product_age_in_minutes: minutes,
  };
};
