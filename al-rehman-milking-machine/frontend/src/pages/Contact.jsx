import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const fieldIcon = (type) => {
  const common = {
    width: 17,
    height: 17,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
  };

  const icons = {
    name: (
      <path d="M12 8a4 4 0 100 8 4 4 0 000-8zM4 21v-1a7 7 0 0114 0v1" />
    ),
    email: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
      </>
    ),
    phone: (
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.12.9.34 1.79.66 2.65a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.43-1.27a2 2 0 012.11-.45c.86.32 1.75.54 2.65.66A2 2 0 0122 16.92z" />
    ),
    message: (
      <>
        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
      </>
    ),
  };

  return <svg {...common}>{icons[type]}</svg>;
};

const fieldVariants = {
  hidden: {
    opacity: 0,
    y: 14,
  },

  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      delay: 0.08 + i * 0.07,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const InputField = ({ icon, custom, ...props }) => (
  <motion.div
    variants={fieldVariants}
    custom={custom}
    className="relative"
  >
    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-500/60 pointer-events-none">
      {fieldIcon(icon)}
    </span>

    <motion.input
      {...props}
      whileFocus={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="w-full bg-gray-50/70 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm text-ink-950 placeholder:text-gray-600/50 focus:outline-none focus:border-brand-500 focus:bg-white focus:shadow-[0_0_0_4px_var(--color-brand-50)] transition-all"
    />
  </motion.div>
);

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setSending(true);

    const text = `Name: ${form.name}
Email: ${form.email}
Phone: ${form.phone}
Message: ${form.message}`;

    const url = `https://wa.me/923084590379?text=${encodeURIComponent(text)}`;

    setTimeout(() => {
      window.open(url, "_blank");
      setSending(false);
    }, 500);
  };

  return (
    <div className="max-w-5xl mx-auto px-5 py-14">
      {/* Page Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="font-display text-2xl md:text-3xl font-bold uppercase tracking-wide text-ink-950 mb-8 border-b-2 border-ink-950 pb-4"
      >
        Contact Us
      </motion.h1>

      <div className="grid md:grid-cols-3 gap-10">
        {/* Contact Form */}
        <motion.div
          className="md:col-span-2"
          initial="hidden"
          animate="show"
        >
          <motion.h2
            variants={fieldVariants}
            custom={0}
            className="font-display text-sm font-semibold uppercase tracking-wide text-accent-600 mb-2"
          >
            Get In Touch
          </motion.h2>

          <motion.p
            variants={fieldVariants}
            custom={1}
            className="text-gray-600 text-sm leading-relaxed mb-6"
          >
            Send us your details and we&apos;ll reply on WhatsApp, or call us
            directly at{" "}
            <a
              href="tel:+923084590379"
              className="text-brand-600 font-semibold hover:text-brand-500 transition-colors"
            >
              0308-4590379
            </a>
            .
          </motion.p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              custom={2}
              icon="name"
              name="name"
              placeholder="Full name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <InputField
              custom={3}
              icon="email"
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
            />

            <InputField
              custom={4}
              icon="phone"
              name="phone"
              placeholder="Phone number"
              value={form.phone}
              onChange={handleChange}
              required
            />

            <motion.div
              variants={fieldVariants}
              custom={5}
              className="relative"
            >
              <span className="absolute left-4 top-4 text-brand-500/60 pointer-events-none">
                {fieldIcon("message")}
              </span>

              <motion.textarea
                name="message"
                placeholder="How can we help you?"
                value={form.message}
                onChange={handleChange}
                rows={5}
                required
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className="w-full bg-gray-50/70 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm text-ink-950 placeholder:text-gray-600/50 focus:outline-none focus:border-brand-500 focus:bg-white focus:shadow-[0_0_0_4px_var(--color-brand-50)] transition-all resize-none"
              />
            </motion.div>

            <motion.button
              variants={fieldVariants}
              custom={6}
              type="submit"
              disabled={sending}
              whileHover={
                !sending
                  ? {
                      scale: 1.02,
                      boxShadow:
                        "0 12px 28px -6px rgba(193,127,42,0.5)",
                    }
                  : {}
              }
              whileTap={!sending ? { scale: 0.98 } : {}}
              className="clip-tag w-full bg-accent-600 disabled:bg-gray-200 disabled:text-gray-400 text-ink-950 font-display font-semibold uppercase tracking-wide text-xs py-3.5 mt-2 hover:bg-accent-500 transition-colors flex items-center justify-center gap-2"
            >
              {sending && (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="w-4 h-4 border-2 border-ink-950/30 border-t-ink-950 rounded-full"
                />
              )}

              {sending ? "Opening WhatsApp..." : "Send via WhatsApp →"}
            </motion.button>
          </form>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.15,
          }}
        >
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-accent-600 mb-4">
            Contact Information
          </h2>

          <div className="bg-gray-50 border border-gray-200 p-5 space-y-5">
            <motion.a
              href="tel:+923084590379"
              whileHover={{ x: 4 }}
              className="flex items-start gap-3 group"
            >
              <span className="text-brand-500 mt-0.5">
                {fieldIcon("phone")}
              </span>

              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                  Phone
                </p>
                <p className="text-sm font-medium text-ink-950 group-hover:text-brand-600 transition-colors">
                  0308-4590379
                </p>
              </div>
            </motion.a>

            <div className="border-t border-gray-200" />

            <motion.div
              whileHover={{ x: 4 }}
              className="flex items-start gap-3"
            >
              <span className="text-brand-500 mt-0.5">
                {fieldIcon("message")}
              </span>

              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                  WhatsApp
                </p>
                <p className="text-sm font-medium text-ink-950">
                  Available for orders &amp; inquiries
                </p>
              </div>
            </motion.div>

            <div className="border-t border-gray-200" />

            <motion.div
              whileHover={{ x: 4 }}
              className="flex items-start gap-3"
            >
              <span className="text-brand-500 mt-0.5">
                {fieldIcon("email")}
              </span>

              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                  Response
                </p>
                <p className="text-sm font-medium text-ink-950">
                  We&apos;ll get back to you shortly
                </p>
              </div>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="text-xs text-gray-500 mt-4 leading-relaxed"
          >
            Your message will open directly in WhatsApp with your details
            already filled in, making it faster for us to respond.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;

