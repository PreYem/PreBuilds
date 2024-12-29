export const MaxCharacterFieldCount = (e, maxLength) => {
    const { value } = e.target;
  
    if (value.length <= maxLength) {
      e.target.value = value; // Allow typing
    } else {
      e.target.value = value.slice(0, maxLength); // Truncate input to maxLength if exceeded
    }
  };