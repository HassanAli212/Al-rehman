import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useWishlist } from "../context/WishlistContext";

const ProductCard = ({ product, index = 0 }) => {
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const tag = String(index + 1).padStart(2, "0");
  const { isInWishlist, toggleWishlist } = useWishlist();
  const liked = isInWishlist(product._id);
  const navigate = useNavigate();

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (liked) {
      // Already saved — take them to the wishlist page instead of removing it here
      navigate("/wishlist");
    } else {
      toggleWishlist(product);
    }
  };

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}>
      <Link
        to={`/products/${product.slug}`}
        className="group block bg-white border border-gray-200 hover:border-accent-600 hover:shadow-lg transition-shadow duration-300"
      >
        <div className="aspect-square bg-gray-100 overflow-hidden relative flex items-center justify-center">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
          ) : (
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-brand-500 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-600)" strokeWidth="1.6">
                <path d="M4 7h3l2-2h6l2 2h3v13H4V7z" strokeLinejoin="round" />
                <circle cx="12" cy="13" r="3.5" />
              </svg>
            </div>
          )}
          <div className="absolute top-2 left-2 bg-ink-950 text-accent-600 font-display text-[9px] font-semibold px-1.5 py-0.5 tracking-wide">
            NO. {tag}
          </div>
          {hasDiscount && (
            <span className="absolute bottom-2 left-2 bg-accent-600 text-ink-950 text-[10px] font-semibold px-2 py-0.5">
              Sale
            </span>
          )}

          {/* Wishlist heart button */}
          <div className="absolute top-2 right-2 group/heart">
            <motion.button
              type="button"
              onClick={handleLike}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.85 }}
              className="w-8 h-8 rounded-full bg-white shadow-[0_2px_8px_rgba(15,42,68,0.18)] flex items-center justify-center transition-shadow hover:shadow-[0_4px_12px_rgba(15,42,68,0.28)]"
              aria-label={liked ? "Go to wishlist" : "Add to wishlist"}
            >
              <motion.svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={liked ? "#e0342f" : "none"}
                stroke={liked ? "#e0342f" : "#0f2a44"}
                strokeWidth="1.8"
                animate={liked ? { scale: [1, 1.35, 1] } : { scale: 1 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </motion.svg>
            </motion.button>
            <span className="pointer-events-none absolute right-0 top-full mt-1.5 whitespace-nowrap bg-ink-950 text-white text-[10px] font-medium px-2 py-1 rounded opacity-0 group-hover/heart:opacity-100 transition-opacity duration-200">
              {liked ? "Browse Wishlist" : "Add to Wishlist"}
            </span>
          </div>
        </div>
        <div className="p-3">
          <div className="text-[9px] uppercase tracking-wide text-accent-600 font-semibold mb-1">
            {product.category?.replace("-", " ")}
          </div>
          <h3 className="text-[13px] text-ink-950 leading-snug mb-2 line-clamp-2 font-medium">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-semibold text-sm text-ink-950">
              Rs {(hasDiscount ? product.discountPrice : product.price).toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-600/60 line-through">
                Rs {product.price.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;