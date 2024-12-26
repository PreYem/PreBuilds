export const truncateText = (text, length = 20) => {
  if (!text) return "";
  return text.length > length ? text.substring(0, length) + "..." : text;
};
