import { useEffect } from 'react';

const useCloseModal = (modalClosingFunction: () => void ) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        modalClosingFunction();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [modalClosingFunction]);
};

export default useCloseModal;