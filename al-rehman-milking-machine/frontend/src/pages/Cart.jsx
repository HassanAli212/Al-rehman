import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";

const FloatingShape = ({ className, size, delay, duration, filled }) => (
  <motion.div
    className={`absolute rounded-full pointer-events-none ${filled ? "bg-accent-500/10" : "border border-accent-500/25"} ${className}`}
    style={{ width: size, height: size }}
    animate={{ y: [0, -14, 0], opacity: [0.35, 0.75, 0.35] }}
    transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, itemsPrice } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="relative overflow-hidden bg-ink-950 min-h-[70vh] flex items-center justify-center">
        <div className="absolute inset-0 dot-texture text-brand-600 opacity-30" />
        <FloatingShape className="top-16 left-16" size={70} delay={0} duration={5} />
        <FloatingShape className="bottom-20 right-24" size={40} delay={1.1} duration={4} filled />

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-md mx-auto px-5 text-center"
        >
          <div className="w-16 h-16 rounded-full border-2 border-accent-600 flex items-center justify-center mx-auto mb-6">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-600)" strokeWidth="1.6">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
            </svg>
          </div>
          <h1 className="font-display text-2xl font-semibold uppercase tracking-wide text-white mb-2">
            Your Cart Is Empty
          </h1>
          <p className="text-white/60 text-sm mb-8">
            Add a machine or spare part to get started.
          </p>
          <motion.div whileHover={{ scale: 1.04, boxShadow: "0 12px 28px -6px rgba(193,127,42,0.5)" }} whileTap={{ scale: 0.98 }} className="inline-block">
            <Link
              to="/products"
              className="clip-tag inline-flex items-center gap-2 bg-accent-600 text-ink-950 font-display font-semibold text-xs uppercase tracking-wide px-7 py-3.5 hover:bg-accent-500 transition-colors"
            >
              Browse Products →
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-5 py-14">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="font-display text-2xl md:text-3xl font-bold uppercase tracking-wide text-ink-950 mb-2 border-b-2 border-ink-950 pb-4"
      >
        Your Cart
      </motion.h1>
      <p className="text-xs text-gray-600 mb-6">
        {cartItems.length} item{cartItems.length > 1 ? "s" : ""} in cart
      </p>

      <div className="divide-y divide-gray-200 border-y border-gray-200">
        <AnimatePresence initial={false}>
          {cartItems.map((item) => (
            <motion.div
              key={item._id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0, x: -40 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-4 py-4 overflow-hidden"
            >
              <div className="w-20 h-20 bg-gray-100 shrink-0 flex items-center justify-center overflow-hidden">
                {item.images?.[0] ? (
                  <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-600)" strokeWidth="1.6">
                    <path d="M4 7h3l2-2h6l2 2h3v13H4V7z" strokeLinejoin="round" />
                    <circle cx="12" cy="13" r="3.5" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display font-semibold text-ink-950 truncate">{item.name}</div>
                <div className="text-sm text-accent-600 font-semibold">
                  Rs {(item.discountPrice || item.price).toLocaleString()}
                </div>
              </div>
              <div className="flex items-center border border-gray-200">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  className="px-3 py-1.5 hover:bg-gray-50 transition-colors"
                >
                  −
                </motion.button>
                <span className="px-3 py-1.5 border-x border-gray-200 text-sm font-medium">{item.quantity}</span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  className="px-3 py-1.5 hover:bg-gray-50 transition-colors"
                >
                  +
                </motion.button>
              </div>
              <div className="w-24 text-right font-display font-semibold text-ink-950">
                Rs {((item.discountPrice || item.price) * item.quantity).toLocaleString()}
              </div>
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => removeFromCart(item._id)}
                className="text-gray-400 hover:text-red-600 transition-colors"
                aria-label="Remove item"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.div layout className="flex justify-end mt-8">
        <div className="w-full md:w-80 bg-gray-50 border border-gray-200 p-6">
          <div className="flex justify-between mb-2 text-sm text-gray-600">
            <span>Subtotal</span>
            <span className="font-display font-semibold text-ink-950">Rs {itemsPrice.toLocaleString()}</span>
          </div>
          <p className="text-xs text-gray-600/70 mb-5">Shipping calculated at checkout.</p>
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 12px 28px -6px rgba(193,127,42,0.5)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/checkout")}
            className="clip-tag w-full bg-accent-600 text-ink-950 font-display font-semibold uppercase tracking-wide text-xs py-3.5 hover:bg-accent-500 transition-colors"
          >
            Proceed to Checkout →
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Cart;