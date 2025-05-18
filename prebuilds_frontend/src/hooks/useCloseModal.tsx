import { useEffect } from 'react';

const useCloseModal = (
  modalRef: React.RefObject<HTMLElement>,
  modalClosingFunction: () => void
) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        modalClosingFunction();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        modalClosingFunction();
      }
    };

    window.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modalRef, modalClosingFunction]);
};

export default useCloseModal;
