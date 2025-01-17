import { useEffect } from 'react';

const useCloseModal = (modalClosingFunction) => {
  useEffect(() => {
    const handleEscape = (event) => {
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