import { motion } from "framer-motion";
import Logo from "./Logo";
import ScrollLink from "./ScrollLink";

const footerVariants = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] },
  }),
};

const socialLinks = {
  facebook: "https://www.facebook.com/profile.php?id=100068328786600&mibextid=ZbWKwL",
  youtube: "https://youtube.com/@alrahmanmilkingmachine3072?si=TKYMfp6qjBs-kZA-",
};

const socialIcon = (type) => {
  const common = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "currentColor" };
  if (type === "facebook")
    return (
      <svg {...common}>
        <path d="M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0022 12z" />
      </svg>
    );
  return (
    <svg {...common}>
      <rect x="2" y="5" width="20" height="14" rx="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10 9l6 3-6 3V9z" />
    </svg>
  );
};

const contactIcon = (type) => {
  const common = { width: 15, height: 15, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8 };
  const icons = {
    pin: <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0118 0zM12 13a3 3 0 100-6 3 3 0 000 6z" />,
    phone: <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.12.9.34 1.79.66 2.65a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.86.32 1.75.54 2.65.66A2 2 0 0122 16.92z" />,
    mail: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 7l10 6 10-6" /></>,
  };
  return <svg {...common}>{icons[type]}</svg>;
};

const infoLinks = [
  { to: "/products", label: "All Products" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact Us" },
];

const contactRows = [
  { icon: "pin", text: "Akbar Chowk, Daroga Wala, Lahore" },
  { icon: "phone", text: "0308-4590379" },
  { icon: "phone", text: "24/7 Helpline: 0304-8482121" },
  { icon: "mail", text: "umargujjar6957088@gmail.com" },
];

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-ink-950 text-white">
      <div className="stripe-band" />
      <div className="absolute inset-0 dot-texture text-brand-600 opacity-[0.12] pointer-events-none" />
      <motion.div
        className="absolute top-10 right-16 w-24 h-24 rounded-full border border-accent-500/20 pointer-events-none"
        animate={{ y: [0, -12, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 left-10 w-14 h-14 rounded-full bg-accent-500/10 pointer-events-none"
        animate={{ y: [0, -10, 0], opacity: [0.3, 0.65, 0.3] }}
        transition={{ duration: 4, delay: 1, repeat: Infinity, ease: "easeInOut" }}
      />




      <div className="relative max-w-6xl mx-auto px-5 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.7fr_1fr_1fr] gap-10">
        {/* BRAND */}
        <motion.div custom={0} variants={footerVariants} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <a href="/" className="flex items-center gap-2.5 mb-5 w-fit">
            <motion.div
              whileHover={{ scale: 1.08 }}
              className="bg-white/10 rounded-full p-1 backdrop-blur-sm ring-1 ring-accent-500/25"
            >
              <Logo size={42} />
            </motion.div>
            <div className="font-display leading-none">
              <div className="text-base font-semibold tracking-wide text-white">Al Rahman</div>
              <div className="text-[9px] text-accent-600 font-semibold tracking-[0.15em] uppercase mt-0.5">
                Milking Machine Co.
              </div>
            </div>
          </a>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-sm text-white/60 leading-relaxed mb-6"
          >
            Supplying durable milking machines, genuine spare parts and dairy
            farming equipment to farmers across Pakistan.
          </motion.p>

          <div className="flex gap-2.5">
            {Object.entries(socialLinks).map(([type, url]) => (
              <motion.a
                key={type}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.12, y: -2 }}
                whileTap={{ scale: 0.92 }}
                className="w-9 h-9 border border-white/20 flex items-center justify-center text-white hover:bg-accent-600 hover:border-accent-600 hover:text-ink-950 transition-colors"
                aria-label={type}
              >
                {socialIcon(type)}
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* INFORMATION */}
        <motion.div custom={1} variants={footerVariants} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <h4 className="font-display font-semibold text-xs uppercase tracking-widest mb-5 text-accent-600">
            Information
          </h4>
          <ul className="space-y-3 text-sm text-white/70">
            {infoLinks.map((link) => (
              <motion.li key={link.label} whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                <ScrollLink to={link.to} className="text-white/70 hover:text-accent-600 transition-colors inline-flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-accent-600/60" />
                  {link.label}
                </ScrollLink>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* CONTACT */}
        <motion.div custom={2} variants={footerVariants} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <h4 className="font-display font-semibold text-xs uppercase tracking-widest mb-5 text-accent-600">
            Contact Us
          </h4>
          <div className="space-y-3.5 text-sm text-white/70">
            {contactRows.map((row, i) => (
              <motion.div key={i} whileHover={{ x: 4 }} className="flex gap-3 items-start">
                <span className="text-accent-600 mt-0.5 shrink-0">{contactIcon(row.icon)}</span>
                <span className="break-words leading-snug">{row.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FIND US */}
        <motion.div custom={3} variants={footerVariants} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <h4 className="font-display font-semibold text-xs uppercase tracking-widest mb-5 text-accent-600">
            Find Us
          </h4>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden border border-white/15 h-40"
          >
            <div className="absolute top-2 left-2 z-10 bg-ink-950/80 backdrop-blur-sm border border-accent-600/40 px-2.5 py-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-600" />
              <span className="text-[9px] font-display font-semibold uppercase tracking-wide text-white">
                Lahore
              </span>
            </div>
            <iframe
              title="Al Rahman Milking Machine location"
              src="https://www.google.com/maps?q=Al+Rehman+milking+machine,+Akbar+chowk,+Wahga+Town,+Lahore,+Punjab+54000&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "grayscale(15%) contrast(1.05)" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* COPYRIGHT — distinct bar */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative bg-black/25 py-6 px-5 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-accent-600/50" />
          <span className="w-2 h-2 border border-accent-600 rotate-45" />
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-accent-600/50" />
        </div>
        <p className="text-sm text-white/60">
          © {new Date().getFullYear()}{" "}
          <a href="/" className="text-white font-semibold hover:text-accent-600 transition-colors">
            Al Rahman Milking Machine
          </a>
          . All rights reserved.
        </p>
      </motion.div>
    </footer>
  );
};

export default Footer;