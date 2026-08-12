import { motion } from "framer-motion";
import Reveal from "../components/Reveal";

const FloatingShape = ({ className, size, delay, duration, filled }) => (
  <motion.div
    className={`absolute rounded-full pointer-events-none ${filled ? "bg-accent-500/10" : "border border-accent-500/25"} ${className}`}
    style={{ width: size, height: size }}
    animate={{ y: [0, -14, 0], opacity: [0.35, 0.75, 0.35] }}
    transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

const stats = [
  { label: "2 Year", sub: "Pump Warranty" },
  { label: "2 Year", sub: "Motor Warranty" },
  { label: "6 Month", sub: "Rubber Parts" },
  { label: "Pakistan", sub: "Wide Delivery" },
];

const sections = [
  {
    title: "Built for Real Farm Conditions",
    text: "Al Rahman Milking Machine supplies durable, dairy-grade milking equipment to farms across Pakistan — from small household setups to full commercial dairies. We started this business with one simple goal: give farmers machines that actually hold up to the daily grind of milking, morning and evening, in every season, on every kind of farm — not equipment that breaks down after a few months of hard use.",
    icon: "M4 7h3l2-2h6l2 2h3v13H4V7z",
  },
  {
    title: "Our Range",
    text: "Whether you're milking one or two cows at home or running a full commercial dairy operation, we carry the right setup for your scale. Single-bucket single-cluster machines for small households, double-bucket double-cluster systems for larger herds, complete pipeline milking systems for commercial dairies, plus genuine spare parts — vacuum pumps, pulsators, liner sets, gaskets — and everyday dairy essentials like rubber floor mats and cattle fans.",
    icon: "M6 8h5l1.5-2h3L17 8h2v12H6V8z",
  },
  {
    title: "Genuine Parts, Honest Pricing",
    text: "Every machine we sell is tested before it leaves our hands, and every part is genuine — no shortcuts, no unbranded knock-offs that fail within weeks. That's why we back our machines with real warranty coverage: 2 years on the pump, 2 years on the motor, and 6 months on rubber components. Pricing is upfront and the same for every customer — no inflated 'first quote' followed by a discount game.",
    icon: "M9 12l2 2 4-4M12 3l7 4v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V7l7-4z",
  },
  {
    title: "Nationwide Delivery & Real Support",
    text: "We deliver machines and spare parts to every corner of Pakistan. But the relationship doesn't end at delivery — our team stays reachable on WhatsApp for installation guidance, troubleshooting, and repairs, because a milking machine that isn't running is a farmer losing money that morning.",
    icon: "M3 7h11v8H3zM14 10h4l3 3v2h-7zM6 18a2 2 0 100-4 2 2 0 000 4zM17 18a2 2 0 100-4 2 2 0 000 4z",
  },
];

const About = () => {
  return (
    <div>
      <div className="stripe-band" />

      {/* Hero */}
      <div className="relative overflow-hidden bg-ink-950 py-20 text-center">
        <div className="absolute inset-0 dot-texture text-brand-600 opacity-30" />
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-accent-500/10 blur-2xl" />
        <FloatingShape className="top-8 right-14" size={60} delay={0} duration={5} />
        <FloatingShape className="bottom-8 right-32" size={32} delay={1} duration={4} filled />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-2xl mx-auto px-5"
        >
          <div className="text-accent-600 font-display text-xs font-semibold uppercase tracking-[0.25em] mb-3">
            Who We Are
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-white uppercase tracking-wide mb-4">
            About Al Rahman Milking Machine
          </h1>
          <p className="text-white/60 text-sm leading-relaxed">
            A Lahore-based dairy equipment supplier, trusted by farmers who
            need machines that work every single day — not just on demo day.
          </p>
        </motion.div>
      </div>

      {/* Stats strip */}
      <Reveal className="grid grid-cols-2 md:grid-cols-4 mx-5 -mt-px" delay={0.05}>
        {stats.map((s) => (
          <div key={s.sub} className="bg-accent-600 text-center py-5 px-2 border-r border-ink-950/20 last:border-r-0">
            <div className="font-display text-lg font-bold text-ink-950">{s.label}</div>
            <div className="font-display text-[10px] font-semibold text-ink-950/80 uppercase tracking-wide mt-0.5">
              {s.sub}
            </div>
          </div>
        ))}
      </Reveal>

      {/* Content sections */}
      <div className="max-w-4xl mx-auto px-5 py-20 space-y-16">
        {sections.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.06}>
            <div className="flex gap-6 items-start">
              <div className="shrink-0 w-14 h-14 rounded-full border-2 border-accent-600 flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink-950)" strokeWidth="1.6">
                  <path d={s.icon} />
                </svg>
              </div>
              <div>
                <h2 className="font-display text-xl md:text-2xl font-bold uppercase tracking-wide text-ink-950 mb-3">
                  {s.title}
                </h2>
                <p className="text-[15px] text-gray-600 leading-[1.8]">{s.text}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* CTA */}
      <Reveal className="relative overflow-hidden bg-brand-600 py-16 text-center">
        <div className="absolute inset-0 dot-texture text-brand-500 opacity-40" />
        <FloatingShape className="top-6 left-12" size={44} delay={0.2} duration={5} />
        <FloatingShape className="bottom-6 right-16" size={28} delay={1.1} duration={4} filled />

        <div className="relative max-w-2xl mx-auto px-5">
          <h2 className="font-display text-2xl font-semibold text-white uppercase tracking-wide mb-3">
            Talk to Us Directly
          </h2>
          <p className="text-white/70 text-sm mb-7 leading-relaxed">
            Reach us anytime for orders, installation guidance, or repairs —
            we're a WhatsApp message away.
          </p>
          <motion.div whileHover={{ scale: 1.04, boxShadow: "0 12px 28px -6px rgba(193,127,42,0.5)" }} whileTap={{ scale: 0.98 }} className="inline-block">
            <a
              href="https://wa.me/923084590379"
              target="_blank"
              rel="noopener noreferrer"
              className="clip-tag inline-flex items-center gap-2 bg-accent-600 text-ink-950 font-display font-semibold text-xs uppercase tracking-wide px-7 py-3.5 hover:bg-accent-500 transition-colors"
            >
              WhatsApp: 0308-4590379 →
            </a>
          </motion.div>
        </div>
      </Reveal>

      <div className="stripe-band" />
    </div>
  );
};

export default About;