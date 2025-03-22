import { useEffect, useState } from "react";

type AlertProps = {
  message: string;
  type: "successMessage" | "databaseError";
  onClose: () => void;
  debug?: boolean;
  duration?: number;
};

const AlertNotification = ({ message, type, onClose, debug = false, duration = 5000 }: AlertProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isDropped, setIsDropped] = useState(false);

  const FADE_DURATION = 500;

  useEffect(() => {
    // Drop-down animation
    const dropTimer = setTimeout(() => {
      setIsDropped(true);
    }, 50);

    // Skip auto-close for debug mode
    if (debug) return () => clearTimeout(dropTimer);

    // Start fade-out
    const animationTimer = setTimeout(() => {
      setIsLeaving(true);
    }, duration);

    // Remove component
    const removalTimer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, duration + FADE_DURATION);

    return () => {
      clearTimeout(dropTimer);
      clearTimeout(animationTimer);
      clearTimeout(removalTimer);
    };
  }, [onClose, debug, duration]);

  // Simplified styles
  const alertStyles =
    type === "successMessage"
      ? "bg-green-100 border-green-300 dark:bg-green-800 dark:border-green-300"
      : "bg-red-100 border-red-300 dark:bg-red-900 dark:border-red-700";

  return (
    isVisible && (
      <div
        className={`fixed left-1/2 transform -translate-x-1/2 w-full max-w-sm p-4 ${alertStyles} 
        border rounded-lg shadow-lg flex items-center justify-between z-50
        ${isDropped ? "top-24" : "-top-20"}`}
        style={{
          transition: "all 500ms ease-out",
          opacity: isLeaving ? 0 : 1,
        }}
        role="alert"
      >
        <div className="text-sm font-medium">
          {message}
          {debug && <span className="ml-2 text-xs text-gray-500">[Debug Mode]</span>}
        </div>
        <button
          type="button"
          className="ml-4 text-gray-400 hover:text-gray-500"
          aria-label="Close"
          onClick={() => {
            if (debug) return;
            setIsLeaving(true);
            setTimeout(() => {
              setIsVisible(false);
              onClose();
            }, FADE_DURATION);
          }}
        >
          ✕
        </button>
      </div>
    )
  );
};

export default AlertNotification;
