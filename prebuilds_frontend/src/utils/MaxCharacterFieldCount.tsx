import React from "react";

export const MaxCharacterFieldCount = (e: React.ChangeEvent<HTMLInputElement>, maxLength: number): number => {
  const { value } = e.target;

  if (value.length <= maxLength) {
    e.target.value = value; 
  } else {
    e.target.value = value.slice(0, maxLength); 
  }

  return e.target.value.length;
};
