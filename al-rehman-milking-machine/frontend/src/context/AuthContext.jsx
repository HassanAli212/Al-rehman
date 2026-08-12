import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(() => {
    try {
      // Admin login uses "userInfo"
      const adminStored =
        localStorage.getItem("userInfo") ||
        sessionStorage.getItem("userInfo");

      if (adminStored) {
        return JSON.parse(adminStored);
      }

      // Customer login uses "customerUserInfo"
      const customerStored =
        localStorage.getItem("customerUserInfo") ||
        sessionStorage.getItem("customerUserInfo");

      if (customerStored) {
        return JSON.parse(customerStored);
      }

      return null;
    } catch (error) {
      console.error("Auth load error:", error);

      localStorage.removeItem("userInfo");
      sessionStorage.removeItem("userInfo");

      localStorage.removeItem("customerUserInfo");
      sessionStorage.removeItem("customerUserInfo");

      return null;
    }
  });

  /*
   * remember = true
   * ----------------
   * User stays logged in after browser restart.
   *
   * remember = false
   * -----------------
   * User stays logged in only during current session.
   *
   * storageKey:
   * -----------------
   * Admin    -> "userInfo"
   * Customer -> "customerUserInfo"
   */
  const login = (
    data,
    remember = true,
    storageKey = "userInfo"
  ) => {
    try {
      if (remember) {
        localStorage.setItem(
          storageKey,
          JSON.stringify(data)
        );

        sessionStorage.removeItem(storageKey);
      } else {
        sessionStorage.setItem(
          storageKey,
          JSON.stringify(data)
        );

        localStorage.removeItem(storageKey);
      }

      setUserInfo(data);
    } catch (error) {
      console.error("Login storage error:", error);

      // Still keep user logged in if storage fails
      setUserInfo(data);
    }
  };

  const logout = () => {
    try {
      /*
       * Remove BOTH possible auth sessions.
       *
       * This is safe because logout means the current
       * authentication session should be cleared.
       */
      localStorage.removeItem("userInfo");
      sessionStorage.removeItem("userInfo");

      localStorage.removeItem("customerUserInfo");
      sessionStorage.removeItem("customerUserInfo");
    } catch (error) {
      console.error("Logout storage error:", error);
    }

    setUserInfo(null);
  };

  return (
    <AuthContext.Provider
      value={{
        userInfo,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

