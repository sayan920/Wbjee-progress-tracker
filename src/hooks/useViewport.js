import { useEffect, useState } from "react";

export default function useViewport() {
  const getWidth = () => window.innerWidth;
  const [width, setWidth] = useState(getWidth);

  useEffect(() => {
    const handleResize = () => setWidth(getWidth());

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    width,
    isPhone: width <= 640,
    isTablet: width <= 980,
    isDesktop: width > 980
  };
}
