import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  /*
   * Load ADMIN remembered credentials only.
   *
   * These keys are completely separate from
   * the normal website user's remembered credentials.
   */
  useEffect(() => {
    const savedAdminEmail = localStorage.getItem(
      "adminRememberEmail"
    );

    const savedAdminPassword = localStorage.getItem(
      "adminRememberPassword"
    );

    if (savedAdminEmail) {
      setEmail(savedAdminEmail);
    }

    if (savedAdminPassword) {
      setPassword(savedAdminPassword);
    }

    if (savedAdminEmail && savedAdminPassword) {
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      /*
       * Admin check
       */
      if (data.role !== "admin") {
        setError(
          "This account does not have admin access."
        );

        setLoading(false);
        return;
      }

      /*
       * ADMIN REMEMBER ME
       *
       * These are separate from normal website login.
       */
      if (rememberMe) {
        localStorage.setItem(
          "adminRememberEmail",
          email
        );

        localStorage.setItem(
          "adminRememberPassword",
          password
        );
      } else {
        localStorage.removeItem(
          "adminRememberEmail"
        );

        localStorage.removeItem(
          "adminRememberPassword"
        );
      }

      /*
       * Save admin session
       */
      login(data, rememberMe);

      /*
       * Go to Admin Dashboard
       */
      navigate("/admin");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-[85vh] flex items-center justify-center px-5 py-12"
      style={{
        background:
          "radial-gradient(circle at 15% 20%, var(--color-brand-50), transparent 40%), var(--color-ink-950)",
      }}
    >
      <motion.div
        initial={{
          opacity: 0,
          y: 30,
          scale: 0.96,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.6,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="w-full max-w-md bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] p-8 border border-white"
      >
        {/* Logo */}
        <motion.div
          initial={{
            opacity: 0,
            y: -15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.2,
          }}
          className="flex justify-center mb-4"
        >
          <motion.div
            animate={{
              rotate: [0, -4, 4, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Logo size={52} />
          </motion.div>
        </motion.div>

        {/* Brand */}
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.3,
          }}
          className="text-brand-600 text-xs font-semibold tracking-[0.25em] uppercase text-center"
        >
          Al Rahman
        </motion.p>

        {/* Heading */}
        <motion.h1
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.35,
          }}
          className="font-display text-2xl font-bold uppercase text-ink-950 text-center mb-8"
        >
          Admin Portal
        </motion.h1>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-4"
          initial="hidden"
          animate="show"
        >
          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                }}
                className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email */}
          <motion.input
            whileFocus={{
              scale: 1.02,
            }}
            type="email"
            placeholder="Admin email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition"
          />

          {/* Password */}
          <motion.input
            whileFocus={{
              scale: 1.02,
            }}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition"
          />

          {/* Remember Me */}
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 0.25,
            }}
            className="flex items-center justify-between"
          >
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) =>
                  setRememberMe(
                    e.target.checked
                  )
                }
                className="w-4 h-4 rounded accent-brand-600 cursor-pointer"
              />

              Remember me
            </label>
          </motion.div>

          {/* Sign In */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.97,
            }}
            className="w-full bg-accent-600 text-ink-950 font-semibold py-3.5 rounded-xl transition"
          >
            {loading
              ? "Signing in..."
              : "Sign In"}
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
