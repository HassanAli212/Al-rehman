import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Scrolls the window to the top every time the route changes.
// Without this, React Router keeps the previous scroll position,
// so navigating to a new page can land you halfway down it.
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;