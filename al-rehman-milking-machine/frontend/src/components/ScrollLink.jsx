import { Link } from "react-router-dom";

const ScrollLink = ({ to, children, onClick, ...props }) => {
  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  return (
    <Link
      to={to}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
};

export default ScrollLink;