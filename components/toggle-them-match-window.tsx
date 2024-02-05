'use client'
import { useEffect } from "react";
import { useTheme } from "next-themes";

export const ToggleThemeMatchWithWindow = () => {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleColorSchemeChange = (event: MediaQueryListEvent | MediaQueryList) => {
      if (event.matches) {
        setTheme('dark');
      } else {
        setTheme('light');
      }
    };

    const isSyncWithDevice = localStorage.getItem('isSyncTheme');
    
    if (isSyncWithDevice === 'true') {
      if (window.matchMedia) {
        const colorSchemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        colorSchemeMediaQuery.addListener(handleColorSchemeChange);

        // Initial check
        handleColorSchemeChange(colorSchemeMediaQuery);

        // Cleanup listener on component unmount
        return () => {
          colorSchemeMediaQuery.removeListener(handleColorSchemeChange);
        };
      } else {
        console.log("Trình duyệt không hỗ trợ prefers-color-scheme.");
      }
    } else {
      console.log("Sync with device is turned off. Theme will not be synchronized.");
    }
  }, [setTheme, theme]);

  return null; // or any other JSX you might want
};
