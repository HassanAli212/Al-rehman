import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

const categories = [
  { key: "", label: "All" },
  { key: "single-bucket", label: "Single Bucket" },
  { key: "double-bucket", label: "Double Bucket" },
  { key: "pipeline", label: "Pipeline" },
  { key: "spare-parts", label: "Spare Parts" },
  { key: "dairy-essentials", label: "Dairy Essentials" },
];

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);

    const params = {};
    if (category) params.category = category;
    if (search) params.search = search;

    api
      .get("/products", { params })
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, search]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-5 py-10">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-display text-2xl md:text-3xl font-bold uppercase tracking-wide text-ink-950 border-b-2 border-ink-950 pb-4"
          >
            Milking Machines & Parts
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 mt-3"
          >
            Premium quality dairy equipment for modern farming
          </motion.p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-10">
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((c, i) => (
              <motion.button
                key={c.key}
                custom={i}
                variants={itemVariants}
                initial="hidden"
                animate="show"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSearchParams(c.key ? { category: c.key } : {})}
                className={`px-4 py-2 text-sm font-medium rounded-full border transition ${
                  category === c.key
                    ? "bg-ink-950 text-white border-ink-950"
                    : "bg-white border-gray-200 text-gray-600 hover:border-brand-500"
                }`}
              >
                {c.label}
              </motion.button>
            ))}
          </div>

          <motion.input
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            type="text"
            placeholder="Search machines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="md:ml-auto w-full md:w-72 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-brand-500"
          />
        </div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-gray-600 mb-5">
          {products.length} product{products.length !== 1 ? "s" : ""} found
        </motion.p>

        {loading ? (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-600">
            Loading products...
          </motion.p>
        ) : products.length === 0 ? (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-600">
            No products found in this category yet.
          </motion.p>
        ) : (
          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-5" initial="hidden" animate="show">
            {products.map((p, i) => (
              <motion.div
                key={p._id}
                variants={itemVariants}
                custom={i}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.25 }}
              >
                <ProductCard product={p} index={i} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Products;