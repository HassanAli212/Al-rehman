import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import Reveal from "../components/Reveal";
import heroBanner from "../assets/hero-banner.jpg";

const FloatingShapeHome = ({ className, size, delay, duration, filled }) => (
  <motion.div
    className={`absolute rounded-full pointer-events-none ${
      filled ? "bg-accent-500/15" : "border border-accent-500/30"
    } ${className}`}
    style={{ width: size, height: size }}
    animate={{ y: [0, -14, 0], opacity: [0.35, 0.75, 0.35] }}
    transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

const categories = [
  { key: "single-bucket", label: "Single Bucket", icon: "M4 7h3l2-2h6l2 2h3v13H4V7z" },
  { key: "double-bucket", label: "Double Bucket", icon: "M6 8h5l1.5-2h3L17 8h2v12H6V8z" },
  { key: "spare-parts", label: "Spare Parts", icon: "M12 8a4 4 0 100 8 4 4 0 000-8z" },
  { key: "dairy-essentials", label: "Dairy Essentials", icon: "M4 4h16v6H4zM4 14h16v6H4z" },
];

const whyUs = [
  { title: "High Results", text: "We provide the best milking machines in Pakistan for single and commercial use.", icon: "M14 9V5a3 3 0 00-6 0v4M5 9h14l-1 11H6L5 9z" },
  { title: "Long Term Relations", text: "We believe in long-term business with fair, transparent machine prices.", icon: "M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m5-4a4 4 0 100-8 4 4 0 000 8z" },
  { title: "Qualified Staff", text: "Our team is experienced in dairy equipment sales, service, and installation.", icon: "M12 8a4 4 0 100 8 4 4 0 000-8zM4 21v-1a7 7 0 0114 0v1" },
  { title: "Online Support", text: "Reach us anytime on WhatsApp — we reply fast during business hours.", icon: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" },
  { title: "Genuine Parts", text: "Vacuum pumps, pulsators, liners, gaskets — sourced and tested for dairy use.", icon: "M12 9a3 3 0 100 6 3 3 0 000-6z" },
  { title: "After-Sales Support", text: "Installation guidance and repair support for every machine we sell.", icon: "M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94z" },
];

const reviews = [
  { text: "Do saal pehle Al Rahman se double-bucket machine li thi — abhi tak roz chal rahi hai, koi masla nahi aaya. Jab ek part kharab hua to 2 din mein naya part mil gaya.", name: "Muhammad Aslam", location: "Sheikhupura", product: "Double Bucket Machine" },
  { text: "Meine single bucket machine li thi apne ghar ke liye, quality bohat achi hai aur price bhi fair tha. WhatsApp pe order kiya, 3 din mein meri city pahunch gayi.", name: "Rashid Mehmood", location: "Kasur", product: "Single Bucket Machine" },
  { text: "Pipeline system lagwaya apni dairy pe, staff ne installation mein bhi help ki. Ab milking ka time aadha reh gaya hai. Bohat satisfied hun is service se.", name: "Imran Bhatti", location: "Okara", product: "Pipeline System" },
  { text: "Spare parts ki availability sabse acchi baat hai — jab bhi vacuum pump ya liner kharab hua, 1-2 din mein mil jata hai. Kabhi machine band nahi rehni parti.", name: "Zafar Iqbal", location: "Sahiwal", product: "Spare Parts" },
  { text: "Rubber mats aur dairy fan bhi liye the inse — quality genuine hai, market ke sasty items jaisa nahi. Recommend karta hun sabko.", name: "Waseem Akram", location: "Pattoki", product: "Dairy Essentials" },
  { text: "Price transparent tha, koi bargaining ka drama nahi. Machine time pe deliver hui aur ab tak perfect chal rahi hai. Al Rahman pe bharosa hai.", name: "Nasir Hussain", location: "Nankana Sahib", product: "Single Bucket Machine" },
];

const tickerItems = [
  "GENUINE VACUUM PUMPS",
  "SINGLE & DOUBLE BUCKET UNITS",
  "PULSATORS & LINER SETS",
  "NATIONWIDE DELIVERY",
  "2 YEAR MOTOR WARRANTY",
  "WHATSAPP SUPPORT",
];

const heroContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const heroItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [activeReview, setActiveReview] = useState(0);
  const [tickerPaused, setTickerPaused] = useState(false);

  useEffect(() => {
    api.get("/products")
      .then((res) => setFeatured(res.data.slice(0, 6)))
      .catch(() => setFeatured([]));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveReview((prev) => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const review = reviews[activeReview];

  return (
    <div className="overflow-hidden">
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes productSlide {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>

      {/* Hero */}
      <motion.section
        className="relative overflow-hidden bg-ink-950 mx-5 mt-5 leading-none max-w-4xl md:mx-auto"
        style={{ clipPath: "polygon(0 0,100% 0,100% 96%,0 100%)" }}
        variants={heroContainer}
        initial="hidden"
        animate="show"
      >
        <div className="absolute inset-0 dot-texture text-brand-600 opacity-30" />
        <motion.div variants={heroItem} className="relative block leading-none">
          <Link to="/products" className="block leading-none">
            <img src={heroBanner} alt="Al Rahman Milking Machine" className="w-full h-auto block opacity-95" />
          </Link>
        </motion.div>
      </motion.section>

      {/* Ticker */}
      <div
        className="relative overflow-hidden bg-accent-600 py-3.5 mt-5 group cursor-pointer"
        onClick={() => setTickerPaused((prev) => !prev)}
        style={{
          maskImage: "linear-gradient(90deg,transparent,black 5%,black 95%,transparent)",
          WebkitMaskImage: "linear-gradient(90deg,transparent,black 5%,black 95%,transparent)",
        }}
      >
        <div
          className={`flex whitespace-nowrap gap-10 w-max [animation:marquee_18s_linear_infinite] ${
            tickerPaused
              ? "[animation-play-state:paused]"
              : "group-hover:[animation-play-state:paused]"
          }`}
        >
          {[...Array(2)].map((_, rep) => (
            <div key={rep} className="flex gap-10 shrink-0">
              {tickerItems.map((item) => (
                <span
                  key={`${rep}-${item}`}
                  className="font-display text-xs md:text-sm font-bold text-ink-950 tracking-widest uppercase flex items-center gap-3"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-ink-950/50 shrink-0" />
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      {featured.length > 0 && (
        <Reveal className="py-16">
          <div className="max-w-6xl mx-auto px-5 flex items-end justify-between mb-6 border-b-2 border-ink-950 pb-3">
            <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-ink-950">
              Featured Products
            </h2>
            <Link to="/products" className="text-xs font-semibold uppercase tracking-wide text-accent-600 hover:text-accent-500">
              View all →
            </Link>
          </div>

          <div
            className="relative overflow-hidden group/slider"
            style={{
              maskImage: "linear-gradient(90deg,transparent,black 3%,black 97%,transparent)",
              WebkitMaskImage: "linear-gradient(90deg,transparent,black 3%,black 97%,transparent)",
            }}
          >
            <div className="flex gap-4 w-max [animation:productSlide_35s_linear_infinite] group-hover/slider:[animation-play-state:paused] pl-5">
              {[...Array(2)].map((_, rep) => (
                <div key={rep} className="flex gap-4 shrink-0">
                  {featured.map((product, index) => (
                    <div key={`${rep}-${product._id}`} className="w-44 sm:w-52 shrink-0">
                      <ProductCard product={product} index={index} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      )}

      {/* Welcome */}
      <Reveal className="relative overflow-hidden bg-ink-950 py-16 mt-6">
        <div className="absolute inset-0 dot-texture text-brand-600 opacity-30" />
        <div className="relative max-w-6xl mx-auto px-5 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="text-accent-600 font-display text-xs font-semibold uppercase tracking-[0.2em] mb-2">
              Welcome to
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-semibold text-white mb-4 uppercase tracking-wide">
              Al Rahman Milking Machine
            </h1>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Al Rahman supplies durable milking machines and genuine spare parts to dairy farms across Pakistan. Whether you're milking one cow at home or running a commercial dairy, our machines are built to run every morning, every evening, every season — backed by spare parts availability and real after-sales support.
            </p>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }} className="inline-block">
              <Link to="/products" className="clip-tag inline-flex items-center gap-2 bg-accent-600 text-ink-950 font-display font-semibold text-xs uppercase tracking-wide px-6 py-3 hover:bg-accent-500 transition-colors">
                Browse Machines →
              </Link>
            </motion.div>
          </div>

          <div className="relative grid grid-cols-2 gap-3 stagger">
            {categories.map((category) => (
              <motion.div key={category.key} whileHover={{ scale: 1.03, y: -3 }} transition={{ duration: 0.2 }}>
                <Link to={`/products?category=${category.key}`} className="group block border border-white/20 hover:border-accent-600 p-5 text-center transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-600)" strokeWidth="1.6" className="mx-auto mb-2">
                    <path d={category.icon} />
                  </svg>
                  <div className="font-display text-[11px] font-semibold text-white uppercase tracking-wide">
                    {category.label}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Why Us */}
      <Reveal className="py-16">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-center font-display text-lg md:text-xl font-semibold text-ink-950 uppercase tracking-wide mb-10">
            Why Customers Love Us
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-10 stagger">
            {whyUs.map((item) => (
              <motion.div key={item.title} whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="text-center flex flex-col items-center">
                <div className="w-11 h-11 rounded-full border-2 border-accent-600 flex items-center justify-center mb-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-950)" strokeWidth="1.6">
                    <path d={item.icon} />
                  </svg>
                </div>
                <div className="font-display font-semibold text-ink-950 text-sm uppercase tracking-wide mb-1">
                  {item.title}
                </div>
                <p className="text-xs text-gray-600 max-w-[220px] leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Reviews */}
      <Reveal className="relative overflow-hidden bg-ink-950 py-14 md:py-16">
        <div className="absolute inset-0 dot-texture text-brand-600 opacity-20" />
        <FloatingShapeHome className="top-8 left-8" size={38} delay={0} duration={5} />
        <FloatingShapeHome className="bottom-8 right-10" size={28} delay={1} duration={4.5} filled />

        <div className="relative max-w-4xl mx-auto px-5">
          <div className="text-center mb-7">
            <div className="inline-flex items-center gap-2 text-accent-600 font-display text-[9px] font-semibold uppercase tracking-[0.22em] mb-1.5">
              <span className="w-5 h-px bg-accent-600" />
              Customer Reviews
              <span className="w-5 h-px bg-accent-600" />
            </div>
            <h2 className="font-display text-lg md:text-xl font-semibold text-white uppercase tracking-wide">
              What Our Farmers Say
            </h2>
          </div>

          <div className="relative max-w-xl mx-auto">
            <div className="absolute -inset-3 bg-accent-600/5 blur-2xl rounded-3xl pointer-events-none" />

            <div className="relative bg-[#151a21] rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
              <div className="h-1 bg-accent-600" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeReview}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="px-5 py-5 md:px-7 md:py-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-9 h-9 rounded-xl bg-accent-600/10 border border-accent-600/20 flex items-center justify-center">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="var(--color-accent-600)">
                        <path d="M7.17 6C4.87 8 3.5 10.6 3.5 13.6c0 3 2.1 5.4 4.8 5.4 2.2 0 3.8-1.6 3.8-3.7 0-1.9-1.3-3.4-3.1-3.6-.2 0-.4 0-.5-.1.5-1.8 1.9-3.4 3.6-4.5L7.17 6zm10 0c-2.3 2-3.7 4.6-3.7 7.6 0 3 2.1 5.4 4.8 5.4 2.2 0 3.8-1.6 3.8-3.7 0-1.9-1.3-3.4-3.1-3.6-.2 0-.4 0-.5-.1.5-1.8 1.9-3.4 3.6-4.5L17.17 6z" />
                      </svg>
                    </div>

                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} width="11" height="11" viewBox="0 0 24 24" fill="var(--color-accent-600)">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                  </div>

                  <div className="min-h-[82px] flex items-center">
                    <p className="font-display text-sm md:text-[15px] text-white/75 leading-relaxed text-left">
                      "{review.text}"
                    </p>
                  </div>

                  <div className="border-t border-white/10 my-4" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-accent-600 text-ink-950 flex items-center justify-center font-display font-bold text-[10px]">
                          {review.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                      </div>

                      <div>
                        <div className="font-display font-semibold text-xs text-white">{review.name}</div>
                        <div className="text-[10px] text-white/40 mt-0.5">
                          {review.location} · {review.product}
                        </div>
                      </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wide text-white/30">
                      Verified
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 mt-5">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveReview(index)}
                aria-label={`Show review ${index + 1}`}
                className="p-1.5 cursor-pointer"
              >
                <motion.span
                  animate={{
                    width: index === activeReview ? 20 : 5,
                    opacity: index === activeReview ? 1 : 0.3,
                  }}
                  className="block h-1.5 rounded-full bg-accent-600"
                />
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      {/* CTA */}
      <Reveal className="relative overflow-hidden bg-brand-600 py-16 text-center">
        <div className="absolute inset-0 dot-texture text-brand-500 opacity-40" />

        <div className="relative max-w-3xl mx-auto px-5">
          <h2 className="font-display text-xl md:text-2xl font-semibold text-white uppercase tracking-wide mb-3">
            Get Free Pricing
          </h2>

          <p className="text-white/70 text-sm mb-6 leading-relaxed">
            We're always available to help you choose the right milking machine for your farm and give you honest, upfront pricing.
          </p>

          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }} className="inline-block">
            <Link
              to="/contact"
              className="clip-tag inline-flex items-center gap-2 bg-accent-600 text-ink-950 font-display font-semibold text-xs uppercase tracking-wide px-7 py-3 hover:bg-accent-500 transition-colors"
            >
              Contact Us →
            </Link>
          </motion.div>
        </div>
      </Reveal>

      <div className="stripe-band" />
    </div>
  );
};

export default Home;