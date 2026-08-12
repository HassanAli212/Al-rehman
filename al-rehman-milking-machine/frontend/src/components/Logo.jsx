import logoImg from "../assets/logo.jpeg";

const Logo = ({ size = 44 }) => {
  return (
    <img
      src={logoImg}
      alt="Al Rahman Milking Machine"
      width={size}
      height={size}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        objectFit: "cover",
      }}
    />
  );
};

export default Logo;