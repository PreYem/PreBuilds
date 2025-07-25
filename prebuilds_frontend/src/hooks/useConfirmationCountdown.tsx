import { useState, useEffect } from 'react';

const useConfirmationCountdown = (initialCount: number, isActive: boolean) => {
  const [countdown, setCountdown] = useState(initialCount);

  useEffect(() => {
    if (!isActive) {
      setCountdown(initialCount);
      return;
    }

    let timer: number = 0;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }

    if (countdown === 0) {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [countdown, isActive, initialCount]);

  return countdown;
};

export default useConfirmationCountdown;
