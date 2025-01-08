export const MaxCharacterFieldCount = (e, maxLength) => {
  const { value } = e.target;

  // Ensure the input length does not exceed maxLength
  if (value.length <= maxLength) {
    e.target.value = value; // Allow typing
  } else {
    e.target.value = value.slice(0, maxLength); // Truncate input to maxLength if exceeded
  }

  // Return the current length of the input value
  return e.target.value.length;
};
