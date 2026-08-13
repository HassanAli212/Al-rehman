import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const emptyProduct = {
  name: "",
  slug: "",
  description: "",
  price: "",
  category: "single-bucket",
  stock: "",
  videoUrl: "",
  images: [],
};

const LOW_STOCK_THRESHOLD = 5;

const cardAnimation = {
  hidden: { opacity: 0, y: 25 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const statusPillColor = {
  pending: "bg-yellow-50 text-yellow-700",
  processing: "bg-blue-50 text-blue-700",
  shipped: "bg-purple-50 text-purple-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
};

const Admin = () => {
  const [tab, setTab] = useState("overview");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.replace("/admin/login");
  };

  // ================= LOAD PRODUCTS =================

  const loadProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.log("Products error:", err);
    }
  };

  // ================= LOAD ORDERS =================

  const loadOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.log("Orders error:", err);
    }
  };

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  // ================= FORM =================

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ================= IMAGE UPLOAD =================

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    setUploading(true);
    setMessage("");

    try {
      const uploaded = [];

      for (const file of files) {
        const data = new FormData();
        data.append("image", file);

        const res = await api.post("/upload", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        uploaded.push(res.data.url);
      }

      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...uploaded],
      }));

      setMessage("Images uploaded successfully");
    } catch (err) {
      console.log("Upload error:", err);
      setMessage("Image upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // ================= REMOVE IMAGE =================

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // ================= SUBMIT PRODUCT =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    if (form.images.length === 0) {
      setMessage("Please upload at least one image.");
      return;
    }

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      };

      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        setMessage("Product updated successfully");
      } else {
        await api.post("/products", payload);
        setMessage("Product added successfully");
      }

      setForm(emptyProduct);
      setEditingId(null);

      await loadProducts();
    } catch (err) {
      console.log("Product save error:", err);

      setMessage(
        err.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  // ================= EDIT PRODUCT =================

  const editProduct = (product) => {
    setEditingId(product._id);

    setForm({
      name: product.name || "",
      slug: product.slug || "",
      description: product.description || "",
      price: product.price || "",
      category: product.category || "single-bucket",
      stock: product.stock || "",
      videoUrl: product.videoUrl || "",
      images: product.images || [],
    });

    setMessage("");
    setTab("products");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ================= CANCEL EDIT =================

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyProduct);
    setMessage("");
  };

  // ================= DELETE PRODUCT =================

  const deleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);

      if (editingId === id) {
        cancelEdit();
      }

      setConfirmDeleteId(null);

      await loadProducts();
    } catch (err) {
      console.log("Delete error:", err);
      setMessage("Failed to delete product");
    }
  };

  // ================= ORDER STATUS =================

  const handleStatusChange = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, {
        status,
      });

      await loadOrders();
    } catch (err) {
      console.log("Status update error:", err);
    }
  };

  // ================= TAB NAVIGATION =================

  const goToTab = (targetTab, filter = "") => {
    setOrderStatusFilter(filter);
    setTab(targetTab);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ================= STATS =================

  const stats = useMemo(() => {
    const totalRevenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    const pendingOrders = orders.filter(
      (o) => o.status === "pending"
    ).length;

    const lowStockProducts = products.filter(
      (p) => p.stock <= LOW_STOCK_THRESHOLD
    );

    return {
      totalRevenue,
      totalOrders: orders.length,
      pendingOrders,
      totalProducts: products.length,
      lowStockProducts,
    };
  }, [orders, products]);

  // ================= FILTER ORDERS =================

  const filteredOrders = useMemo(() => {
    if (!orderStatusFilter) return orders;

    return orders.filter(
      (o) => o.status === orderStatusFilter
    );
  }, [orders, orderStatusFilter]);

  return (
    <div className="min-h-screen bg-gray-50 px-3 sm:px-5 py-5 sm:py-10">
      <motion.div
        variants={cardAnimation}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto w-full"
      >
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
          <div className="min-w-0">
            <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase text-ink-950 break-words">
              Admin Dashboard
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Manage products and orders
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full sm:w-auto bg-ink-950 text-white px-5 py-2.5 rounded-xl hover:bg-accent-600 hover:text-black transition font-semibold"
          >
            Logout
          </button>
        </div>

        {/* ================================================= */}
        {/* TABS */}
        {/* ================================================= */}

        <div className="grid grid-cols-3 gap-2 sm:flex sm:gap-3 mb-6 sm:mb-8">
          {["overview", "products", "orders"].map((t) => (
            <button
              key={t}
              onClick={() => {
                if (t === "orders") {
                  setOrderStatusFilter("");
                }

                setTab(t);
              }}
              className={`w-full sm:w-auto px-2 sm:px-6 py-2.5 rounded-xl font-semibold uppercase text-[11px] sm:text-sm transition ${
                tab === t
                  ? "bg-ink-950 text-white"
                  : "bg-white border border-gray-300 hover:border-accent-600"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ================================================= */}
        {/* OVERVIEW */}
        {/* ================================================= */}

        {tab === "overview" && (
          <motion.div
            variants={cardAnimation}
            initial="hidden"
            animate="show"
            className="space-y-6 sm:space-y-8"
          >
            {/* STATS */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* REVENUE */}

              <motion.button
                onClick={() => goToTab("orders")}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="text-left bg-ink-950 text-white rounded-2xl p-5 sm:p-6 shadow-sm cursor-pointer transition-shadow hover:shadow-lg"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs uppercase tracking-wide text-accent-500 font-semibold">
                    Total Revenue
                  </div>

                  <span className="text-white/40">→</span>
                </div>

                <div className="font-display text-2xl font-bold">
                  Rs {stats.totalRevenue.toLocaleString()}
                </div>
              </motion.button>

              {/* ORDERS */}

              <motion.button
                onClick={() => goToTab("orders")}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="text-left bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm cursor-pointer transition-shadow hover:shadow-lg hover:border-accent-500"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs uppercase tracking-wide text-accent-600 font-semibold">
                    Total Orders
                  </div>

                  <span className="text-gray-300">→</span>
                </div>

                <div className="font-display text-2xl font-bold text-ink-950">
                  {stats.totalOrders}
                </div>
              </motion.button>

              {/* PENDING */}

              <motion.button
                onClick={() =>
                  goToTab("orders", "pending")
                }
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="text-left bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm cursor-pointer transition-shadow hover:shadow-lg hover:border-accent-500"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs uppercase tracking-wide text-accent-600 font-semibold">
                    Pending Orders
                  </div>

                  <span className="text-gray-300">→</span>
                </div>

                <div className="font-display text-2xl font-bold text-ink-950">
                  {stats.pendingOrders}
                </div>
              </motion.button>

              {/* PRODUCTS */}

              <motion.button
                onClick={() => goToTab("products")}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="text-left bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm cursor-pointer transition-shadow hover:shadow-lg hover:border-accent-500"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs uppercase tracking-wide text-accent-600 font-semibold">
                    Total Products
                  </div>

                  <span className="text-gray-300">→</span>
                </div>

                <div className="font-display text-2xl font-bold text-ink-950">
                  {stats.totalProducts}
                </div>
              </motion.button>
            </div>

            {/* LOW STOCK */}

            <AnimatePresence>
              {stats.lowStockProducts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                  }}
                  className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 sm:p-6 overflow-hidden"
                >
                  <div className="font-display text-sm font-semibold uppercase tracking-wide text-yellow-800 mb-3 flex items-start sm:items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse mt-1.5 sm:mt-0 shrink-0" />

                    <span>
                      Low Stock —{" "}
                      {stats.lowStockProducts.length} product
                      {stats.lowStockProducts.length > 1
                        ? "s"
                        : ""}{" "}
                      need restocking
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {stats.lowStockProducts.map((p) => (
                      <button
                        key={p._id}
                        onClick={() => editProduct(p)}
                        className="flex flex-col xs:flex-row sm:flex-row justify-between gap-1 w-full text-left text-sm text-yellow-900 hover:underline"
                      >
                        <span className="truncate">
                          {p.name}
                        </span>

                        <span className="font-semibold shrink-0">
                          {p.stock} left
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* RECENT ORDERS */}

            <div>
              <div className="flex items-center justify-between mb-4 gap-3">
                <h2 className="font-display font-bold text-lg sm:text-xl uppercase text-ink-950">
                  Recent Orders
                </h2>

                <button
                  onClick={() => goToTab("orders")}
                  className="text-xs font-semibold uppercase text-accent-600 hover:text-accent-500 shrink-0"
                >
                  View all →
                </button>
              </div>

              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => {
                  const isOpen =
                    expandedOrderId === order._id;

                  return (
                    <motion.div
                      key={order._id}
                      layout
                      className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
                    >
                      {/* ORDER HEADER */}

                      <button
                        type="button"
                        onClick={() =>
                          setExpandedOrderId(
                            isOpen ? null : order._id
                          )
                        }
                        className="w-full text-left p-4 sm:p-5 flex justify-between items-center gap-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="min-w-0">
                          <div className="font-mono text-xs text-gray-400">
                            {order._id.slice(-8)}
                          </div>

                          <h3 className="font-semibold text-ink-950 truncate">
                            {order.shippingAddress?.fullName ||
                              order.user?.name}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                          <div className="text-right">
                            <div className="font-display font-semibold text-ink-950 text-sm sm:text-base">
                              Rs{" "}
                              {order.totalPrice?.toLocaleString()}
                            </div>

                            <span
                              className={`inline-block mt-1 text-[9px] sm:text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full ${
                                statusPillColor[
                                  order.status
                                ] ||
                                "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>

                          <motion.svg
                            animate={{
                              rotate: isOpen ? 180 : 0,
                            }}
                            transition={{
                              duration: 0.2,
                            }}
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-gray-400 shrink-0"
                          >
                            <path d="M6 9l6 6 6-6" />
                          </motion.svg>
                        </div>
                      </button>

                      {/* ORDER DETAILS */}

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{
                              height: 0,
                              opacity: 0,
                            }}
                            animate={{
                              height: "auto",
                              opacity: 1,
                            }}
                            exit={{
                              height: 0,
                              opacity: 0,
                            }}
                            transition={{
                              duration: 0.25,
                              ease: [
                                0.16,
                                1,
                                0.3,
                                1,
                              ],
                            }}
                            className="overflow-hidden border-t border-gray-100"
                          >
                            <div className="p-4 sm:p-5 space-y-4">
                              <div>
                                <p className="text-sm text-gray-600 break-words">
                                  📞{" "}
                                  {order.shippingAddress?.phone}
                                </p>

                                <p className="text-sm text-gray-600 mt-1 leading-relaxed break-words">
                                  📍{" "}
                                  {
                                    order.shippingAddress
                                      ?.street
                                  }
                                  ,{" "}
                                  {
                                    order.shippingAddress
                                      ?.city
                                  }
                                  {order.shippingAddress
                                    ?.province
                                    ? `, ${order.shippingAddress.province}`
                                    : ""}
                                  {order.shippingAddress
                                    ?.postalCode
                                    ? ` — ${order.shippingAddress.postalCode}`
                                    : ""}
                                </p>
                              </div>

                              <div className="bg-gray-50 rounded-xl p-3 sm:p-4 space-y-2">
                                {order.orderItems?.map(
                                  (item, i) => (
                                    <div
                                      key={i}
                                      className="flex justify-between gap-3 text-sm text-gray-600"
                                    >
                                      <span className="min-w-0 break-words">
                                        {item.name} ×{" "}
                                        {item.quantity}
                                      </span>

                                      <span className="shrink-0">
                                        Rs{" "}
                                        {(
                                          item.price *
                                          item.quantity
                                        ).toLocaleString()}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>

                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                                <div className="font-display font-bold text-ink-950">
                                  Total: Rs{" "}
                                  {order.totalPrice?.toLocaleString()}
                                </div>

                                <select
                                  value={order.status}
                                  onChange={(e) =>
                                    handleStatusChange(
                                      order._id,
                                      e.target.value
                                    )
                                  }
                                  onClick={(e) =>
                                    e.stopPropagation()
                                  }
                                  className="w-full sm:w-auto border rounded-xl px-4 py-2 text-sm bg-white"
                                >
                                  <option value="pending">
                                    pending
                                  </option>
                                  <option value="processing">
                                    processing
                                  </option>
                                  <option value="shipped">
                                    shipped
                                  </option>
                                  <option value="delivered">
                                    delivered
                                  </option>
                                  <option value="cancelled">
                                    cancelled
                                  </option>
                                </select>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}

                {orders.length === 0 && (
                  <p className="text-sm text-gray-500">
                    No orders yet.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ================================================= */}
        {/* PRODUCTS */}
        {/* ================================================= */}

        {tab === "products" && (
          <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-5 sm:gap-8">
            {/* ADD / EDIT FORM */}

            <motion.form
              onSubmit={handleSubmit}
              variants={cardAnimation}
              initial="hidden"
              animate="show"
              className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 p-4 sm:p-7 shadow-[0_15px_40px_-20px_rgba(0,0,0,0.2)] space-y-4"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display font-bold uppercase text-lg sm:text-xl text-ink-950">
                  {editingId
                    ? "Update Product"
                    : "Add Product"}
                </h2>

                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="text-xs text-gray-400 hover:text-ink-950 underline shrink-0"
                  >
                    Cancel edit
                  </button>
                )}
              </div>

              {/* MESSAGE */}

              {message && (
                <motion.p
                  initial={{
                    opacity: 0,
                    y: -10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className={`text-sm px-4 py-3 rounded-xl ${
                    message.toLowerCase().includes("failed") ||
                    message.toLowerCase().includes("wrong") ||
                    message.toLowerCase().includes("please")
                      ? "text-red-600 bg-red-50"
                      : "text-green-600 bg-green-50"
                  }`}
                >
                  {message}
                </motion.p>
              )}

              {/* NAME */}

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Product Name"
                required
                className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:border-accent-600 transition"
              />

              {/* SLUG */}

              <input
                name="slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="Product Slug"
                required
                className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:border-accent-600"
              />

              {/* DESCRIPTION */}

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                rows="4"
                required
                className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:border-accent-600 resize-none"
              />

              {/* PRICE + STOCK */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Price"
                  required
                  className="w-full border rounded-xl px-4 py-3"
                />

                <input
                  name="stock"
                  type="number"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="Stock"
                  required
                  className="w-full border rounded-xl px-4 py-3"
                />
              </div>

              {/* CATEGORY */}

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 bg-white"
              >
                <option value="single-bucket">
                  Single Bucket
                </option>

                <option value="double-bucket">
                  Double Bucket
                </option>

                <option value="pipeline">
                  Pipeline
                </option>

                <option value="spare-parts">
                  Spare Parts
                </option>

                <option value="dairy-essentials">
                  Dairy Essentials
                </option>

                <option value="other">Other</option>
              </select>

              {/* VIDEO URL */}

              <input
                name="videoUrl"
                value={form.videoUrl}
                onChange={handleChange}
                placeholder="Video URL (optional)"
                className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:border-accent-600"
              />

              {/* IMAGE UPLOAD */}

              <label className="block border-2 border-dashed border-gray-300 rounded-2xl p-5 sm:p-6 text-center cursor-pointer hover:border-accent-600 transition">
                <div className="text-sm text-gray-500 flex flex-col sm:flex-row items-center justify-center gap-2">
                  {uploading && (
                    <motion.span
                      animate={{
                        rotate: 360,
                      }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-3.5 h-3.5 border-2 border-accent-200 border-t-accent-600 rounded-full"
                    />
                  )}

                  <span>
                    {uploading
                      ? "Uploading..."
                      : "Click to upload product images"}
                  </span>
                </div>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {/* IMAGE PREVIEW */}

              {form.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <AnimatePresence>
                    {form.images.map((img, index) => (
                      <motion.div
                        key={`${img}-${index}`}
                        initial={{
                          opacity: 0,
                          scale: 0.8,
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0.8,
                        }}
                        className="relative"
                      >
                        <img
                          src={img}
                          alt={`Product ${index + 1}`}
                          className="h-28 sm:h-24 w-full object-cover rounded-xl"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeImage(index)
                          }
                          className="absolute top-1 right-1 bg-red-500 text-white w-7 h-7 rounded-full text-xs hover:bg-red-600 transition"
                        >
                          ×
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* SAVE BUTTON */}

              <motion.button
                type="submit"
                whileHover={{
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                disabled={uploading}
                className="w-full bg-accent-600 text-black font-semibold py-3 rounded-xl transition disabled:opacity-60"
              >
                {editingId
                  ? "Update Product"
                  : "Save Product"}
              </motion.button>
            </motion.form>

            {/* ================================================= */}
            {/* PRODUCT LIST */}
            {/* ================================================= */}

            <div className="space-y-4 min-w-0">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display font-bold text-lg sm:text-xl uppercase text-ink-950">
                  Products ({products.length})
                </h2>
              </div>

              <AnimatePresence>
                {products.map((p) => (
                  <motion.div
                    key={p._id}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      x: -20,
                    }}
                    whileHover={{
                      y: -3,
                    }}
                    className="bg-white border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center shadow-sm hover:shadow-lg transition"
                  >
                    {/* PRODUCT INFO */}

                    <div className="flex gap-3 sm:gap-4 items-center min-w-0 w-full">
                      {p.images?.[0] ? (
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-16 h-16 rounded-xl object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                          >
                            <path d="M4 7h3l2-2h6l2 2h3v13H4V7z" />
                          </svg>
                        </div>
                      )}

                      <div className="min-w-0">
                        <h3 className="font-semibold text-ink-950 break-words">
                          {p.name}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          Rs{" "}
                          {Number(p.price || 0).toLocaleString()}

                          {p.stock <=
                            LOW_STOCK_THRESHOLD && (
                            <span className="text-yellow-700 font-semibold">
                              {" "}
                              · {p.stock} left
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* ACTIONS */}

                    <div className="flex gap-4 w-full sm:w-auto sm:shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0">
                      <button
                        type="button"
                        onClick={() => editProduct(p)}
                        className="flex-1 sm:flex-none text-accent-600 font-semibold hover:scale-105 transition text-left sm:text-center"
                      >
                        Edit
                      </button>

                      {confirmDeleteId === p._id ? (
                        <div className="flex gap-3 flex-1 sm:flex-none">
                          <button
                            type="button"
                            onClick={() =>
                              deleteProduct(p._id)
                            }
                            className="flex-1 sm:flex-none text-red-600 font-semibold text-sm"
                          >
                            Confirm
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setConfirmDeleteId(null)
                            }
                            className="flex-1 sm:flex-none text-gray-400 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            setConfirmDeleteId(p._id)
                          }
                          className="flex-1 sm:flex-none text-red-600 font-semibold hover:scale-105 transition text-left sm:text-center"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {products.length === 0 && (
                <p className="text-sm text-gray-500">
                  No products yet.
                </p>
              )}
            </div>
          </div>
        )}

        {/* ================================================= */}
        {/* ORDERS */}
        {/* ================================================= */}

        {tab === "orders" && (
          <div className="space-y-5">
            {/* FILTER */}

            {orderStatusFilter && (
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                <span>Filtered by:</span>

                <span className="inline-flex items-center gap-1.5 bg-ink-950 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase">
                  {orderStatusFilter}

                  <button
                    type="button"
                    onClick={() =>
                      setOrderStatusFilter("")
                    }
                    className="hover:text-accent-500"
                  >
                    ×
                  </button>
                </span>
              </div>
            )}

            <AnimatePresence>
              {filteredOrders.map((order) => (
                <motion.div
                  key={order._id}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  className="bg-white rounded-2xl border p-4 sm:p-6 shadow-sm"
                >
                  {/* ORDER TOP */}

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
                    <div className="min-w-0">
                      <div className="font-mono text-[10px] sm:text-xs text-gray-400 mb-1 break-all">
                        {order._id}
                      </div>

                      <h3 className="font-bold text-base sm:text-lg text-ink-950 break-words">
                        {order.shippingAddress
                          ?.fullName ||
                          order.user?.name}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1 break-words">
                        📞{" "}
                        {order.shippingAddress?.phone}
                      </p>

                      <p className="text-sm text-gray-500 mt-1 leading-relaxed break-words">
                        📍{" "}
                        {order.shippingAddress?.street}
                        ,{" "}
                        {order.shippingAddress?.city}

                        {order.shippingAddress
                          ?.province
                          ? `, ${order.shippingAddress.province}`
                          : ""}

                        {order.shippingAddress
                          ?.postalCode
                          ? ` — ${order.shippingAddress.postalCode}`
                          : ""}
                      </p>
                    </div>

                    <span
                      className={`text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full self-start sm:self-auto shrink-0 ${
                        statusPillColor[
                          order.status
                        ] ||
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* ORDER ITEMS */}

                  <div className="bg-gray-50 rounded-xl p-3 sm:p-4 my-4 space-y-2">
                    {order.orderItems?.map(
                      (item, i) => (
                        <div
                          key={i}
                          className="flex justify-between gap-3 text-sm text-gray-600"
                        >
                          <span className="min-w-0 break-words">
                            {item.name} ×{" "}
                            {item.quantity}
                          </span>

                          <span className="shrink-0">
                            Rs{" "}
                            {(
                              item.price *
                              item.quantity
                            ).toLocaleString()}
                          </span>
                        </div>
                      )
                    )}
                  </div>

                  {/* TOTAL + STATUS */}

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div className="font-display font-bold text-ink-950">
                      Total: Rs{" "}
                      {order.totalPrice?.toLocaleString()}
                    </div>

                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(
                          order._id,
                          e.target.value
                        )
                      }
                      className="w-full sm:w-auto border rounded-xl px-4 py-2.5 bg-white"
                    >
                      <option value="pending">
                        pending
                      </option>

                      <option value="processing">
                        processing
                      </option>

                      <option value="shipped">
                        shipped
                      </option>

                      <option value="delivered">
                        delivered
                      </option>

                      <option value="cancelled">
                        cancelled
                      </option>
                    </select>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredOrders.length === 0 && (
              <p className="text-sm text-gray-500">
                No orders match.
              </p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Admin;