import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";

const imageVariants = {
  hidden: {
    opacity: 0,
    y: 18,
    scale: 0.96,
  },

  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: 0.08 + i * 0.06,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    api
      .get("/products")
      .then((res) => {
        const all = res.data.flatMap((p) => p.images || []);
        setImages(all);
      })
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, []);

  // Close lightbox with Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedImage(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Prevent body scrolling while image is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedImage]);

  return (
    <div className="max-w-6xl mx-auto px-5 py-14">
      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="font-display text-2xl md:text-3xl font-bold uppercase tracking-wide text-ink-950 mb-8 border-b-2 border-ink-950 pb-4"
      >
        Gallery
      </motion.h1>

      {/* Gallery */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="aspect-square rounded-xl bg-gray-100 border border-gray-200 overflow-hidden relative"
              >
                <motion.div
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.05,
                  }}
                  className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                />
              </motion.div>
            ))}
          </motion.div>
        ) : images.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="bg-gray-50 border border-gray-200 rounded-xl px-6 py-12 text-center"
          >
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-brand-500">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>

            <p className="text-gray-600 text-sm">
              Product photos will appear here once machines are added to the
              catalog.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="gallery"
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {images.map((img, i) => (
              <motion.button
                key={i}
                type="button"
                custom={i}
                variants={imageVariants}
                onClick={() => setSelectedImage(img)}
                whileHover={{
                  y: -5,
                  scale: 1.015,
                  transition: {
                    duration: 0.25,
                    ease: "easeOut",
                  },
                }}
                whileTap={{ scale: 0.98 }}
                className="group aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-200 relative cursor-pointer shadow-sm hover:shadow-lg transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              >
                <motion.img
                  src={img}
                  alt={`Milking machine ${i + 1}`}
                  loading="lazy"
                  whileHover={{
                    scale: 1.08,
                    transition: {
                      duration: 0.5,
                      ease: "easeOut",
                    },
                  }}
                  className="w-full h-full object-cover"
                />

                {/* Hover overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0 bg-black/20 pointer-events-none flex items-center justify-center"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <circle cx="11" cy="11" r="7" />
                      <path d="M20 20l-4-4" />
                      <path d="M11 8v6M8 11h6" />
                    </svg>
                  </motion.div>
                </motion.div>

                {/* Image number */}
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-ink-950 text-[10px] font-display font-semibold uppercase tracking-wide px-2.5 py-1 rounded-md shadow-sm">
                  {String(i + 1).padStart(2, "0")}
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 cursor-zoom-out"
          >
            {/* Close Button */}
            <motion.button
              type="button"
              onClick={() => setSelectedImage(null)}
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="absolute top-5 right-5 md:top-7 md:right-7 z-10 w-11 h-11 rounded-full bg-white/95 text-ink-950 flex items-center justify-center shadow-xl hover:bg-white transition-colors"
              aria-label="Close image"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </motion.button>

            {/* Large Image */}
            <motion.img
              src={selectedImage}
              alt="Gallery preview"
              initial={{
                opacity: 0,
                scale: 0.85,
                y: 15,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
              }}
              transition={{
                duration: 0.35,
                ease: [0.16, 1, 0.3, 1],
              }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-[88vh] w-auto h-auto object-contain rounded-lg shadow-2xl cursor-default"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;

