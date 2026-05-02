import { useState } from 'react';

export const useComingSoon = () => {
  const [isVisible, setIsVisible] = useState(false);

  const trigger = () => {
    if (isVisible) return; 
    setIsVisible(true);
    setTimeout(() => setIsVisible(false), 3000); // Message stays for 3 seconds
  };

  return { isVisible, trigger };
};