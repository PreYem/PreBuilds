import { useEffect, useState } from "react";
import { useNotification } from "../context/GlobalNotificationContext";
import useCloseModal from "../hooks/useCloseModal";

// Define animation state type
type AnimationState = "hidden" | "visible" | "exiting";

// Extend the notification types to include "warningMessage"

const AlertNotification = () => {
  const { message, type, clearNotification } = useNotification();
  const [animationState, setAnimationState] = useState<AnimationState>("hidden");
  const FADE_DURATION = 500;

  useEffect(() => {
    if (!message) return;

    setAnimationState("hidden");

    setTimeout(() => {
      setAnimationState("visible");
    }, 10);

    const timer = setTimeout(() => {
      setAnimationState("exiting");
      setTimeout(clearNotification, FADE_DURATION);
    }, 4000);

    return () => clearTimeout(timer);
  }, [message, clearNotification]);

  useCloseModal(() => {
    setAnimationState("exiting");
  });

  if (!message) return null;

  const alertStyles =
    type === "successMessage"
      ? "bg-green-100 border-green-300 text-green-800 dark:bg-green-800 dark:border-green-300 dark:text-green-100"
      : type === "databaseError"
      ? "bg-red-100 border-red-300 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-100"
      : type === "warningMessage"
      ? "bg-orange-300 border-orange-300 text-orange-800 dark:bg-orange-800 dark:border-orange-300 dark:text-orange-100"
      : "";

  // Animation classes based on state
  const animationClasses: Record<AnimationState, string> = {
    hidden: "opacity-0 transform -translate-y-full",
    visible: "opacity-100 transform translate-y-0",
    exiting: "opacity-0 transform -translate-y-full",
  };

  return (
    <div
      className={
        "fixed top-20 z-[9999] flex justify-center transition-all duration-500 w-fit max-w-md mx-auto left-1/2 -translate-x-1/2 " +
        animationClasses[animationState]
      }
      style={{ pointerEvents: animationState === "exiting" ? "none" : "auto" }}
    >
      <div className={`m-4 px-4 py-3 rounded-3xl border ${alertStyles} shadow-lg flex flex-wrap items-center justify-center text-center`}>
        <span className="max-w-5xl break-words text-sm sm:text-base">{message}</span>
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
