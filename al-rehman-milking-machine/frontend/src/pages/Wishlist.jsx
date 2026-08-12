import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

const FloatingShape = ({ className, size, delay, duration, filled }) => (
  <motion.div
    className={`absolute rounded-full pointer-events-none ${filled ? "bg-accent-500/10" : "border border-accent-500/25"} ${className}`}
    style={{ width: size, height: size }}
    animate={{ y: [0, -14, 0], opacity: [0.35, 0.75, 0.35] }}
    transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  // =========================
  // EMPTY WISHLIST — matches Cart's empty state exactly
  // =========================
  if (wishlistItems.length === 0) {
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
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <h1 className="font-display text-2xl font-semibold uppercase tracking-wide text-white mb-2">
            Your Wishlist Is Empty
          </h1>
          <p className="text-white/60 text-sm mb-8">
            Tap the heart icon on any product to save it here for later.
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

  // =========================
  // WISHLIST — matches Cart's filled layout exactly
  // =========================
  return (
    <div className="max-w-4xl mx-auto px-5 py-14">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="font-display text-2xl md:text-3xl font-bold uppercase tracking-wide text-ink-950 mb-2 border-b-2 border-ink-950 pb-4"
      >
        My Wishlist
      </motion.h1>
      <p className="text-xs text-gray-600 mb-6">
        {wishlistItems.length} item{wishlistItems.length > 1 ? "s" : ""} saved
      </p>

      <div className="divide-y divide-gray-200 border-y border-gray-200">
        <AnimatePresence initial={false}>
          {wishlistItems.map((item) => {
            const hasDiscount = item.discountPrice && item.discountPrice < item.price;
            const currentPrice = hasDiscount ? item.discountPrice : item.price;

            return (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0, x: -40 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-4 py-4 overflow-hidden"
              >
                <Link
                  to={`/products/${item.slug}`}
                  className="w-20 h-20 bg-gray-100 shrink-0 flex items-center justify-center overflow-hidden"
                >
                  {item.images?.[0] ? (
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-600)" strokeWidth="1.6">
                      <path d="M4 7h3l2-2h6l2 2h3v13H4V7z" strokeLinejoin="round" />
                      <circle cx="12" cy="13" r="3.5" />
                    </svg>
                  )}
                </Link>

                <div className="flex-1 min-w-0">
                  <Link
                    to={`/products/${item.slug}`}
                    className="font-display font-semibold text-ink-950 truncate block hover:text-accent-600 transition-colors"
                  >
                    {item.name}
                  </Link>
                  <div className="text-sm text-accent-600 font-semibold">
                    Rs {Number(currentPrice).toLocaleString()}
                    {hasDiscount && (
                      <span className="text-xs text-gray-400 line-through ml-2">
                        Rs {Number(item.price).toLocaleString()}
                      </span>
                    )}
                  </div>
                  {item.category && (
                    <div className="text-[10px] text-gray-400 uppercase tracking-wide mt-1">
                      {item.category.replaceAll("-", " ")}
                    </div>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: "0 8px 20px -6px rgba(193,127,42,0.4)" }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => addToCart(item, 1)}
                  className="clip-tag hidden sm:inline-flex items-center gap-2 bg-accent-600 text-ink-950 font-display font-semibold text-xs uppercase tracking-wide px-5 py-2.5 hover:bg-accent-500 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
                  </svg>
                  Add to Cart
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeFromWishlist(item._id)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                  aria-label="Remove from wishlist"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </motion.button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Wishlist;