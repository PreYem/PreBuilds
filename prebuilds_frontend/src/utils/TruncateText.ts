export const truncateText = (text: string | undefined , length = 20) => {
  if (!text) return "";
  return text.length > length ? text.substring(0, length) + "..." : text;
};
