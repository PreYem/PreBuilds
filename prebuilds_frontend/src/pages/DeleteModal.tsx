import { useEffect, useRef, useState } from "react";
import useCloseModal from "../hooks/useCloseModal";

interface DeleteModalProps {
  showModal: boolean;
  isClosing: boolean;
  countdown: number;
  closeDeleteModal: () => void;
  handleDelete: () => void;
  disclaimer: React.ReactNode;
  target: string;
}

const DeleteModal = ({
  showModal,
  isClosing,
  countdown,
  closeDeleteModal,
  handleDelete,
  disclaimer,
  target,
}: DeleteModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isEntering, setIsEntering] = useState(false);

  useCloseModal(modalRef, closeDeleteModal);

  // Entrance animation trigger
  useEffect(() => {
    if (showModal) {
      const timeout = setTimeout(() => {
        setIsEntering(true);
      }, 10); // Start transition slightly after mount

      return () => clearTimeout(timeout);
    } else {
      setIsEntering(false); // Reset for reuse
    }
  }, [showModal]);

  if (!showModal) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
        isClosing ? "opacity-0" : isEntering ? "opacity-100" : "opacity-0"
      }`}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div
        className={`bg-white dark:bg-gray-800 p-6 rounded-lg w-96 transition-all duration-300 ease-in-out transform ${
          isClosing ? "opacity-0 scale-95" : isEntering ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        style={{
          transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
        }}
        ref={modalRef}
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Are you sure you want to proceed? <br />
        </h3>
        <span className="text-red-500 font-bold bg-yellow-100 p-2 rounded border border-yellow-500 mt-2 inline-block">
          ⚠️ This action is <span className="font-semibold">irreversible</span> and cannot be undone.
        </span>
        {disclaimer && (
          <span className="text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-600 mt-2 inline-block">
            {disclaimer}
          </span>
        )}
        <div className="mt-4 flex justify-end space-x-2">
          <button onClick={closeDeleteModal} className="bg-gray-400 text-white py-1 px-3 rounded hover:bg-gray-500">
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={countdown > 0}
            className={`py-1 px-3 w-auto rounded text-white ${
              countdown > 0 ? "bg-gray-500 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
            } text-sm`}
          >
            {countdown > 0 ? `Delete in ${countdown}s` : `Delete ${target} Permanently`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
