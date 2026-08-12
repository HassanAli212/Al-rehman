import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";

const fieldIcon = (type) => {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
  };

  if (type === "email")
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    );

  if (type === "password")
    return (
      <svg {...common}>
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </svg>
    );

  return null;
};

const eyeIcon = (open) =>
  open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
      <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c7 0 10 7 10 7a18.5 18.5 0 0 1-3.1 4.3" />
      <path d="M6.6 6.6C3.8 8.3 2 12 2 12s3.5 7 10 7a10.7 10.7 0 0 0 4.1-.8" />
    </svg>
  );

const fieldVariants = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.15 + i * 0.09,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const MotionInputField = ({ icon, custom, trailing, ...props }) => (
  <motion.div variants={fieldVariants} custom={custom} className="relative">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
      {fieldIcon(icon)}
    </div>

    <motion.input
      {...props}
      whileFocus={{ scale: 1.015 }}
      transition={{ duration: 0.2 }}
      className={`w-full bg-gray-50/70 border border-gray-200 rounded-xl pl-11 ${
        trailing ? "pr-11" : "pr-4"
      } py-3.5 text-sm text-ink-950 placeholder:text-gray-600/50 focus:outline-none focus:border-brand-500 focus:bg-white focus:shadow-[0_0_0_4px_var(--color-brand-50)] transition-all`}
    />

    {trailing}
  </motion.div>
);

const FloatingShape = ({ className, size, delay, duration, filled }) => (
  <motion.div
    className={`absolute rounded-full pointer-events-none ${
      filled
        ? "bg-accent-500/10"
        : "border border-accent-500/25"
    } ${className}`}
    style={{ width: size, height: size }}
    animate={{ y: [0, -14, 0], opacity: [0.35, 0.75, 0.35] }}
    transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

const Login = () => {
  /* Customer remembered credentials */
  const [email, setEmail] = useState(() => {
    try {
      return localStorage.getItem("customerRememberEmail") || "";
    } catch {
      return "";
    }
  });

  const [password, setPassword] = useState(() => {
    try {
      return localStorage.getItem("customerRememberPassword") || "";
    } catch {
      return "";
    }
  });

  const [showPassword, setShowPassword] = useState(false);

  const [rememberMe, setRememberMe] = useState(() => {
    try {
      return Boolean(localStorage.getItem("customerRememberEmail"));
    } catch {
      return false;
    }
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      /* Customer session */
      login(data, rememberMe, "customerUserInfo");

      /* Remember customer credentials */
      if (rememberMe) {
        localStorage.setItem("customerRememberEmail", email);
        localStorage.setItem("customerRememberPassword", password);
      } else {
        localStorage.removeItem("customerRememberEmail");
        localStorage.removeItem("customerRememberPassword");
      }

      navigate(searchParams.get("redirect") || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gray-50 px-4 py-10 overflow-hidden">

      <motion.div
        className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-brand-400/20 blur-[100px] pointer-events-none"
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute -bottom-24 -right-24 w-[420px] h-[420px] rounded-full bg-accent-500/15 blur-[100px] pointer-events-none"
        animate={{ x: [0, -30, 0], y: [0, -40, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ boxShadow: "0 30px 70px -15px rgba(15,42,68,0.32)" }}
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(15,42,68,0.25)] overflow-hidden grid md:grid-cols-2 border border-white"
      >

        {/* Brand Panel */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="hidden md:flex relative p-10 flex-col justify-between overflow-hidden"
          style={{
            background:
              "linear-gradient(160deg, var(--color-ink-950) 0%, var(--color-brand-700) 55%, var(--color-brand-600) 100%)",
          }}
        >
          <div className="absolute inset-0 dot-texture text-white opacity-[0.08]" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-accent-500/10 blur-2xl" />

          <motion.svg
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.06, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            width="340"
            height="340"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="0.6"
            className="absolute -right-16 top-1/2 -translate-y-1/2 pointer-events-none"
          >
            <path d="M4 7h3l2-2h6l2 2h3v13H4V7z" strokeLinejoin="round" />
            <circle cx="12" cy="13" r="3.5" />
          </motion.svg>

          <FloatingShape className="top-10 right-10" size={70} delay={0} duration={5} />
          <FloatingShape className="bottom-28 right-24" size={40} delay={1.2} duration={4} filled />
          <FloatingShape className="top-1/2 -right-6" size={110} delay={0.6} duration={6} />
          <FloatingShape className="top-1/3 left-6" size={22} delay={2} duration={4.5} filled />

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center gap-2.5 mb-12"
            >
              <motion.div
                animate={{ rotate: [0, -4, 4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="bg-white/10 rounded-full p-1 backdrop-blur-sm ring-1 ring-accent-500/20"
              >
                <Logo size={38} />
              </motion.div>

              <div className="font-display leading-none">
                <div className="text-base font-bold text-white">Al Rahman</div>
                <div className="text-[10px] text-accent-500 font-medium tracking-widest uppercase">
                  Milking Machine
                </div>
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="font-display text-[1.7rem] font-semibold uppercase tracking-wide leading-[1.25] text-white mb-5"
            >
              Welcome back to <span className="text-accent-500">Al Rahman</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-white/60 text-sm leading-relaxed max-w-xs"
            >
              Sign in to track your orders, manage your delivery details, and
              check out faster next time.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="relative flex items-center gap-2 text-xs text-white/45"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
            Genuine machines
            <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
            Nationwide delivery
            <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
            Real support
          </motion.div>
        </motion.div>

        {/* Form */}
        <div className="relative p-8 md:p-12 flex flex-col justify-center">
          <div className="absolute top-0 right-0 w-40 h-40 bg-brand-50 rounded-full blur-3xl opacity-60 pointer-events-none" />

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative font-display text-[1.7rem] font-bold uppercase text-ink-950 mb-1.5 tracking-wide"
          >
            Sign In
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative text-sm text-gray-600 mb-8"
          >
            New here?{" "}
            <Link
              to="/register"
              className="text-brand-600 font-semibold hover:text-accent-600 transition-colors"
            >
              Create an account
            </Link>
          </motion.p>

          <motion.form
            onSubmit={handleSubmit}
            className="relative space-y-4"
            initial="hidden"
            animate="show"
          >
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, x: 0 }}
                  animate={{ opacity: 1, height: "auto", x: [0, -8, 8, -6, 6, 0] }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3 overflow-hidden"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <MotionInputField
              custom={0}
              icon="email"
              type="email"
              name="customerEmail"
              autoComplete="username"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <MotionInputField
              custom={1}
              icon="password"
              type={showPassword ? "text" : "password"}
              name="customerPassword"
              autoComplete="current-password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {eyeIcon(showPassword)}
                </button>
              }
            />

            <motion.div
              variants={fieldVariants}
              custom={1.5}
              className="flex items-center justify-between"
            >
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setRememberMe(checked);

                    if (!checked) {
                      localStorage.removeItem("customerRememberEmail");
                      localStorage.removeItem("customerRememberPassword");
                    }
                  }}
                  className="w-4 h-4 rounded accent-brand-600 cursor-pointer"
                />
                Remember me
              </label>
            </motion.div>

            <motion.button
              variants={fieldVariants}
              custom={2}
              type="submit"
              disabled={loading}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 12px 28px -6px rgba(193,127,42,0.5)",
              }}
              whileTap={{ scale: 0.97 }}
              className="w-full text-white font-display font-semibold uppercase tracking-wide text-sm py-4 rounded-xl transition-shadow flex items-center justify-center gap-2 mt-2"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-accent-600) 0%, var(--color-accent-500) 100%)",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading && (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
                />
              )}

              {loading ? "Signing in..." : "Sign In"}
            </motion.button>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;