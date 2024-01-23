import { useTheme } from "next-themes";

export const ToggleThemeMatchWithWindow = () => {
    const  {setTheme}  = useTheme()
    function handleColorSchemeChange(event:any) {
        if (event.matches) {
            setTheme('dark')
        } else {
            setTheme('light')
        }
    }
    if (window.matchMedia) {
        const colorSchemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        colorSchemeMediaQuery.addListener(handleColorSchemeChange);
  
  
        handleColorSchemeChange(colorSchemeMediaQuery);
    } else {
        console.log("Trình duyệt không hỗ trợ prefers-color-scheme.");
    }
}