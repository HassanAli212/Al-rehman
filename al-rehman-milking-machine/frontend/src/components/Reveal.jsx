import { motion, useReducedMotion } from "framer-motion";

/**
 * Wraps any section — fades + slides it up the first time it enters the viewport.
 * Usage: <Reveal><section>...</section></Reveal>
 * Optional delay (seconds) for staggering multiple Reveals in sequence.
 */
const Reveal = ({ children, delay = 0, className = "", ...rest }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      {...rest}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
