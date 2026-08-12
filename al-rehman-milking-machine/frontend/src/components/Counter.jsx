import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

/**
 * Counts up from 0 to `value` when it scrolls into view.
 * Usage: <Counter value={500} suffix="+" />
 */
const Counter = ({ value, suffix = "", prefix = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const motionVal = useMotionValue(0);
  const springVal = useSpring(motionVal, { duration: 1.2, bounce: 0 });

  useEffect(() => {
    if (isInView) motionVal.set(value);
  }, [isInView, value, motionVal]);

  useEffect(() => {
    return springVal.on("change", (v) => {
      if (ref.current) ref.current.textContent = `${prefix}${Math.round(v).toLocaleString()}${suffix}`;
    });
  }, [springVal, prefix, suffix]);

  return <motion.span ref={ref}>{prefix}0{suffix}</motion.span>;
};

export default Counter;
