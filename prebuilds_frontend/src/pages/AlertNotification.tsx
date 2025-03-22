import { useEffect, useState } from "react";
import { useNotification } from "../context/GlobalNotificationContext";

// Define animation state type
type AnimationState = "hidden" | "visible" | "exiting";

const AlertNotification = () => {
  const { message, type, clearNotification } = useNotification();
  const [animationState, setAnimationState] = useState<AnimationState>("hidden");
  const FADE_DURATION = 500;

  useEffect(() => {
    if (!message) return;

    // Start with the component mounted but off-screen
    setAnimationState("hidden");

    // Force a reflow before starting the entrance animation
    setTimeout(() => {
      setAnimationState("visible");
    }, 10);

    // Set timeout for auto-dismiss
    const timer = setTimeout(() => {
      setAnimationState("exiting");
      // Clear message after exit animation completes
      setTimeout(clearNotification, FADE_DURATION);
    }, 4000);

    return () => clearTimeout(timer);
  }, [message, clearNotification]);

  if (!message) return null;

  // Define styles based on notification type
  const alertStyles =
    type === "successMessage"
      ? "bg-green-100 border-green-300 text-green-800 dark:bg-green-800 dark:border-green-300 dark:text-green-100"
      : "bg-red-100 border-red-300 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-100";

  // Animation classes based on state
  const animationClasses: Record<AnimationState, string> = {
    hidden: "opacity-0 transform -translate-y-full",
    visible: "opacity-100 transform translate-y-0",
    exiting: "opacity-0 transform -translate-y-full",
  };

  return (
    <div
      className={`fixed top-20 left-0 right-0 z-[9999] flex justify-center transition-all duration-500 ${animationClasses[animationState]}`}
      style={{ pointerEvents: animationState === "exiting" ? "none" : "auto" }}
    >
      <div className={`m-4 px-4 py-3 rounded border ${alertStyles} shadow-lg flex items-center justify-between max-w-md`}>
        <span>{message}</span>
        <button
          onClick={() => setAnimationState("exiting")}
          className="ml-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default AlertNotification;
