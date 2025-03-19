export const MaxCharacterFieldCount = (
  e: React.FormEvent<Element>, // Handle general form events for both input and textarea
  maxLength: number
): number => {
  const target = e.currentTarget as HTMLInputElement | HTMLTextAreaElement; // Narrow the type

  const { value } = target;

  if (value.length <= maxLength) {
    target.value = value; // Set the value if within max length
  } else {
    target.value = value.slice(0, maxLength); // Slice value if over max length
  }

  return target.value.length;
};
