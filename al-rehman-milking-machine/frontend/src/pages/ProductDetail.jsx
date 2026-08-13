import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

const ProductDetail = () => {
  const { slug } = useParams();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const [preview, setPreview] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    api
      .get(`/products/${slug}`)
      .then((res) => {
        setProduct(res.data);

        if (res.data.images?.length) {
          setActiveImage(res.data.images[0]);
        }
      })
      .catch(() => setProduct(null));
  }, [slug]);

  // SEO + Product Structured Data
  useEffect(() => {
    if (!product) return;

    const price = product.discountPrice &&
      product.discountPrice < product.price
      ? product.discountPrice
      : product.price;

    const description =
      product.description ||
      `${product.name} available from Al Rahman Milking Machine in Pakistan.`;

    // Browser title
    document.title = `${product.name} | Al Rahman Milking Machine`;

    // Helper for meta tags
    const setMeta = (name, content, property = false) => {
      const attribute = property ? "property" : "name";

      let meta = document.head.querySelector(
        `meta[${attribute}="${name}"]`
      );

      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }

      meta.setAttribute("content", content);
    };

    // SEO description
    setMeta("description", description);

    // Robots
    setMeta("robots", "index, follow");

    // Open Graph
    setMeta("og:type", "product", true);
    setMeta("og:title", product.name, true);
    setMeta("og:description", description, true);
    setMeta(
      "og:url",
      `https://alrahmanmilkingmachines.com/products/${slug}`,
      true
    );

    if (product.images?.length) {
      setMeta("og:image", product.images[0], true);
    }

    // Canonical
    let canonical = document.head.querySelector(
      'link[rel="canonical"]'
    );

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }

    canonical.setAttribute(
      "href",
      `https://alrahmanmilkingmachines.com/products/${slug}`
    );

    // Product Schema
    const schemaId = "product-schema";

    const oldSchema = document.getElementById(schemaId);

    if (oldSchema) {
      oldSchema.remove();
    }

    const schema = document.createElement("script");

    schema.id = schemaId;
    schema.type = "application/ld+json";

    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: description,
      image: product.images || [],
      sku: product._id || slug,
      brand: {
        "@type": "Brand",
        name: "Al Rahman Milking Machine",
      },
      offers: {
        "@type": "Offer",
        url: `https://alrahmanmilkingmachines.com/products/${slug}`,
        priceCurrency: "PKR",
        price: price,
        availability:
          product.stock === 0
            ? "https://schema.org/OutOfStock"
            : "https://schema.org/InStock",
        seller: {
          "@type": "Organization",
          name: "Al Rahman Milking Machine",
        },
      },
    });

    document.head.appendChild(schema);

    return () => {
      const schemaElement = document.getElementById(schemaId);

      if (schemaElement) {
        schemaElement.remove();
      }
    };
  }, [product, slug]);

  // Close image preview with Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") {
        setPreview(false);
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  if (!product) {
    return (
      <div className="min-h-[300px] flex items-center justify-center text-gray-600">
        Loading product...
      </div>
    );
  }

  const hasDiscount =
    product.discountPrice &&
    product.discountPrice < product.price;

  const spec = product.specifications || {};

  const currentPrice = hasDiscount
    ? product.discountPrice
    : product.price;

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-5 py-14">
      <div className="grid md:grid-cols-2 gap-10 items-start">

        {/* IMAGE SECTION */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Main Image */}
          <motion.button
            type="button"
            onClick={() => setPreview(true)}
            whileHover={{ scale: 1.02 }}
            className="w-full aspect-square bg-gray-50 border border-gray-200 rounded-xl overflow-hidden cursor-zoom-in"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                src={activeImage}
                alt={`${product.name} - Al Rahman Milking Machine`}
                title={product.name}
                initial={{
                  opacity: 0,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 1.04,
                }}
                transition={{
                  duration: 0.35,
                }}
                className="w-full h-full object-contain p-4"
              />
            </AnimatePresence>
          </motion.button>

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-3 mt-4">
              {product.images.slice(0, 5).map((img, i) => (
                <motion.button
                  key={i}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  whileHover={{ y: -3 }}
                  className={`aspect-square rounded-lg overflow-hidden border transition-all ${
                    activeImage === img
                      ? "border-brand-600 ring-2 ring-brand-500/20"
                      : "border-gray-200"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} image ${i + 1}`}
                    title={`${product.name} image ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>

        {/* PRODUCT INFO */}
        <motion.div
          initial={{
            opacity: 0,
            x: 20,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.5,
            delay: 0.1,
          }}
        >
          {/* Category */}
          <div className="text-[11px] uppercase tracking-wider text-brand-600 font-semibold mb-2">
            {product.category?.replace("-", " ")}
          </div>

          {/* Product Name */}
          <h1 className="font-display text-3xl md:text-4xl font-bold text-ink-950 mb-5 leading-tight">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-ink-950">
              Rs {currentPrice.toLocaleString()}
            </span>

            {hasDiscount && (
              <span className="text-gray-400 line-through text-lg">
                Rs {product.price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed mb-7 whitespace-pre-line">
            {product.description}
          </p>

          {/* Specifications */}
          {(spec.capacity ||
            spec.motorPower ||
            spec.material ||
            spec.warranty) && (
            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.2,
              }}
              className="border border-gray-200 rounded-xl p-5 mb-7 bg-gray-50/50"
            >
              <h3 className="font-display text-sm uppercase tracking-wide font-semibold text-ink-950 mb-4">
                Product Details
              </h3>

              <div className="grid grid-cols-2 gap-5 text-sm">
                {spec.capacity && (
                  <div>
                    <p className="text-gray-500 text-xs">
                      Capacity
                    </p>

                    <p className="font-medium text-ink-950">
                      {spec.capacity}
                    </p>
                  </div>
                )}

                {spec.motorPower && (
                  <div>
                    <p className="text-gray-500 text-xs">
                      Motor Power
                    </p>

                    <p className="font-medium text-ink-950">
                      {spec.motorPower}
                    </p>
                  </div>
                )}

                {spec.material && (
                  <div>
                    <p className="text-gray-500 text-xs">
                      Material
                    </p>

                    <p className="font-medium text-ink-950">
                      {spec.material}
                    </p>
                  </div>
                )}

                {spec.warranty && (
                  <div>
                    <p className="text-gray-500 text-xs">
                      Warranty
                    </p>

                    <p className="font-medium text-ink-950">
                      {spec.warranty}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-5 mb-6">
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() =>
                  setQty((q) => Math.max(1, q - 1))
                }
                className="px-4 py-2 hover:bg-gray-100 transition"
              >
                −
              </button>

              <span className="px-5 py-2 border-x border-gray-200 font-semibold">
                {qty}
              </span>

              <button
                onClick={() =>
                  setQty((q) => q + 1)
                }
                className="px-4 py-2 hover:bg-gray-100 transition"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <motion.button
            onClick={handleAdd}
            disabled={product.stock === 0}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full md:w-auto bg-brand-600 disabled:bg-gray-200 disabled:text-gray-500 text-ink-950 font-display font-semibold uppercase tracking-wide text-sm px-10 py-3.5 rounded-xl hover:bg-brand-500 transition"
          >
            {added ? "Added ✓" : "Add to Cart"}
          </motion.button>
        </motion.div>
      </div>

      {/* IMAGE PREVIEW */}
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={() => setPreview(false)}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-5 cursor-zoom-out"
          >
            <motion.img
              src={activeImage}
              alt={`${product.name} preview`}
              initial={{
                scale: 0.85,
              }}
              animate={{
                scale: 1,
              }}
              transition={{
                duration: 0.3,
              }}
              onClick={(e) =>
                e.stopPropagation()
              }
              className="max-h-[90vh] max-w-5xl object-contain rounded-xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetail;