import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
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
  const navigate = useNavigate();

const handleLogout = () => {
  logout();
  window.location.replace("/admin/login");
};

  const loadProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // IMAGE UPLOAD
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);

    try {
      const uploaded = [];

      for (const file of files) {
        const data = new FormData();
        data.append("image", file);

        const res = await api.post("/upload", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        uploaded.push(res.data.url);
      }

      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...uploaded],
      }));
    } catch (err) {
      setMessage("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        setMessage("Product Updated");
      } else {
        await api.post("/products", payload);
        setMessage("Product Added");
      }

      setForm(emptyProduct);
      setEditingId(null);
      loadProducts();
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyProduct);
    setMessage("");
  };

  const deleteProduct = async (id) => {
    await api.delete(`/products/${id}`);
    if (editingId === id) cancelEdit();
    setConfirmDeleteId(null);
    loadProducts();
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      loadOrders();
    } catch (err) {
      console.log(err);
    }
  };

  // Clicking an overview card jumps to the relevant tab (and pre-filters orders where useful)
  const goToTab = (targetTab, filter = "") => {
    setOrderStatusFilter(filter);
    setTab(targetTab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const stats = useMemo(() => {
    const totalRevenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const pendingOrders = orders.filter((o) => o.status === "pending").length;
    const lowStockProducts = products.filter((p) => p.stock <= LOW_STOCK_THRESHOLD);
    return {
      totalRevenue,
      totalOrders: orders.length,
      pendingOrders,
      totalProducts: products.length,
      lowStockProducts,
    };
  }, [orders, products]);

  const filteredOrders = useMemo(() => {
    if (!orderStatusFilter) return orders;
    return orders.filter((o) => o.status === orderStatusFilter);
  }, [orders, orderStatusFilter]);

  return (
    <div className="min-h-screen bg-gray-50 px-5 py-10">
      <motion.div variants={cardAnimation} initial="hidden" animate="show" className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold uppercase text-ink-950">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">Manage products and orders</p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-ink-950 text-white px-5 py-2 rounded-xl hover:bg-accent-600 hover:text-black transition"
          >
            Logout
          </button>
        </div>

        <div className="flex gap-3 mb-8">
          {["overview", "products", "orders"].map((t) => (
            <button
              key={t}
              onClick={() => {
                if (t === "orders") setOrderStatusFilter("");
                setTab(t);
              }}
              className={`px-6 py-2.5 rounded-xl font-semibold uppercase text-sm transition ${
                tab === t ? "bg-ink-950 text-white" : "border border-gray-300 hover:border-accent-600"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ================= OVERVIEW ================= */}
        {tab === "overview" && (
          <motion.div variants={cardAnimation} initial="hidden" animate="show" className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.button
                onClick={() => goToTab("orders")}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="text-left bg-ink-950 text-white rounded-2xl p-6 shadow-sm cursor-pointer transition-shadow hover:shadow-lg"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs uppercase tracking-wide text-accent-500 font-semibold">Total Revenue</div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40"><path d="M9 18l6-6-6-6" /></svg>
                </div>
                <div className="font-display text-2xl font-bold">Rs {stats.totalRevenue.toLocaleString()}</div>
              </motion.button>

              <motion.button
                onClick={() => goToTab("orders")}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="text-left bg-white border border-gray-200 rounded-2xl p-6 shadow-sm cursor-pointer transition-shadow hover:shadow-lg hover:border-accent-500"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs uppercase tracking-wide text-accent-600 font-semibold">Total Orders</div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300"><path d="M9 18l6-6-6-6" /></svg>
                </div>
                <div className="font-display text-2xl font-bold text-ink-950">{stats.totalOrders}</div>
              </motion.button>

              <motion.button
                onClick={() => goToTab("orders", "pending")}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="text-left bg-white border border-gray-200 rounded-2xl p-6 shadow-sm cursor-pointer transition-shadow hover:shadow-lg hover:border-accent-500"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs uppercase tracking-wide text-accent-600 font-semibold">Pending Orders</div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300"><path d="M9 18l6-6-6-6" /></svg>
                </div>
                <div className="font-display text-2xl font-bold text-ink-950">{stats.pendingOrders}</div>
              </motion.button>

              <motion.button
                onClick={() => goToTab("products")}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="text-left bg-white border border-gray-200 rounded-2xl p-6 shadow-sm cursor-pointer transition-shadow hover:shadow-lg hover:border-accent-500"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs uppercase tracking-wide text-accent-600 font-semibold">Total Products</div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300"><path d="M9 18l6-6-6-6" /></svg>
                </div>
                <div className="font-display text-2xl font-bold text-ink-950">{stats.totalProducts}</div>
              </motion.button>
            </div>

            <AnimatePresence>
              {stats.lowStockProducts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 overflow-hidden"
                >
                  <div className="font-display text-sm font-semibold uppercase tracking-wide text-yellow-800 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                    Low Stock — {stats.lowStockProducts.length} product{stats.lowStockProducts.length > 1 ? "s" : ""} need restocking
                  </div>
                  <div className="space-y-1.5">
                    {stats.lowStockProducts.map((p) => (
                      <button
                        key={p._id}
                        onClick={() => editProduct(p)}
                        className="flex justify-between w-full text-left text-sm text-yellow-900 hover:underline"
                      >
                        <span>{p.name}</span>
                        <span className="font-semibold">{p.stock} left</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-xl uppercase text-ink-950">Recent Orders</h2>
                <button onClick={() => goToTab("orders")} className="text-xs font-semibold uppercase text-accent-600 hover:text-accent-500">
                  View all →
                </button>
              </div>
              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => {
                  const isOpen = expandedOrderId === order._id;
                  return (
                    <motion.div
                      key={order._id}
                      layout
                      className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedOrderId(isOpen ? null : order._id)}
                        className="w-full text-left p-5 flex justify-between items-center hover:bg-gray-50 transition-colors"
                      >
                        <div>
                          <div className="font-mono text-xs text-gray-400">{order._id.slice(-8)}</div>
                          <h3 className="font-semibold text-ink-950">
                            {order.shippingAddress?.fullName || order.user?.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="font-display font-semibold text-ink-950">Rs {order.totalPrice.toLocaleString()}</div>
                            <span className={`inline-block mt-1 text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full ${statusPillColor[order.status] || "bg-gray-100 text-gray-600"}`}>
                              {order.status}
                            </span>
                          </div>
                          <motion.svg
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            className="text-gray-400 shrink-0"
                          >
                            <path d="M6 9l6 6 6-6" />
                          </motion.svg>
                        </div>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden border-t border-gray-100"
                          >
                            <div className="p-5 space-y-4">
                              <div>
                                <p className="text-sm text-gray-600">📞 {order.shippingAddress?.phone}</p>
                                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                  📍 {order.shippingAddress?.street}, {order.shippingAddress?.city}
                                  {order.shippingAddress?.province ? `, ${order.shippingAddress.province}` : ""}
                                  {order.shippingAddress?.postalCode ? ` — ${order.shippingAddress.postalCode}` : ""}
                                </p>
                              </div>

                              <div className="bg-gray-50 rounded-xl p-4 space-y-1.5">
                                {order.orderItems?.map((item, i) => (
                                  <div key={i} className="flex justify-between text-sm text-gray-600">
                                    <span>{item.name} × {item.quantity}</span>
                                    <span>Rs {(item.price * item.quantity).toLocaleString()}</span>
                                  </div>
                                ))}
                              </div>

                              <div className="flex justify-between items-center">
                                <div className="font-display font-bold text-ink-950">
                                  Total: Rs {order.totalPrice?.toLocaleString()}
                                </div>
                                <select
                                  value={order.status}
                                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="border rounded-xl px-4 py-2 text-sm"
                                >
                                  <option value="pending">pending</option>
                                  <option value="processing">processing</option>
                                  <option value="shipped">shipped</option>
                                  <option value="delivered">delivered</option>
                                  <option value="cancelled">cancelled</option>
                                </select>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
                {orders.length === 0 && <p className="text-sm text-gray-500">No orders yet.</p>}
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= PRODUCTS ================= */}
        {tab === "products" && (
          <div className="grid lg:grid-cols-[420px_1fr] gap-8">
            {/* ADD/EDIT PRODUCT FORM */}
            <motion.form
              onSubmit={handleSubmit}
              variants={cardAnimation}
              initial="hidden"
              animate="show"
              className="bg-white rounded-3xl border border-gray-200 p-7 shadow-[0_15px_40px_-20px_rgba(0,0,0,0.2)] space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold uppercase text-xl text-ink-950">
                  {editingId ? "Update Product" : "Add Product"}
                </h2>
                {editingId && (
                  <button type="button" onClick={cancelEdit} className="text-xs text-gray-400 hover:text-ink-950 underline">
                    Cancel edit
                  </button>
                )}
              </div>

              {message && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-green-600 bg-green-50 px-4 py-3 rounded-xl"
                >
                  {message}
                </motion.p>
              )}

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Product Name"
                required
                className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:border-accent-600 transition"
              />

              <input
                name="slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="Product Slug"
                required
                className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:border-accent-600"
              />

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                rows="4"
                required
                className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:border-accent-600"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Price"
                  required
                  className="border rounded-xl px-4 py-3"
                />
                <input
                  name="stock"
                  type="number"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="Stock"
                  required
                  className="border rounded-xl px-4 py-3"
                />
              </div>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              >
                <option value="single-bucket">Single Bucket</option>
                <option value="double-bucket">Double Bucket</option>
                <option value="pipeline">Pipeline</option>
                <option value="spare-parts">Spare Parts</option>
                <option value="dairy-essentials">Dairy Essentials</option>
                <option value="other">Other</option>
              </select>

              {/* IMAGE UPLOAD BOX */}
              <label className="block border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center cursor-pointer hover:border-accent-600 transition">
                <div className="text-sm text-gray-500 flex items-center justify-center gap-2">
                  {uploading && (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      className="w-3.5 h-3.5 border-2 border-accent-200 border-t-accent-600 rounded-full"
                    />
                  )}
                  {uploading ? "Uploading..." : "Click to upload product images"}
                </div>
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>

              {/* IMAGE PREVIEW */}
              <div className="grid grid-cols-3 gap-3">
                <AnimatePresence>
                  {form.images.map((img, index) => (
                    <motion.div
                      key={img}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative"
                    >
                      <img src={img} className="h-24 w-full object-cover rounded-xl" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full text-xs hover:bg-red-600 transition"
                      >
                        ×
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={uploading}
                className="w-full bg-accent-600 text-black font-semibold py-3 rounded-xl transition disabled:opacity-60"
              >
                {editingId ? "Update Product" : "Save Product"}
              </motion.button>
            </motion.form>

            {/* PRODUCT LIST */}
            <div className="space-y-4">
              <h2 className="font-display font-bold text-xl uppercase text-ink-950">Products ({products.length})</h2>

              <AnimatePresence>
                {products.map((p) => (
                  <motion.div
                    key={p._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    whileHover={{ y: -5 }}
                    className="bg-white border rounded-2xl p-5 flex justify-between items-center shadow-sm hover:shadow-lg transition"
                  >
                    <div className="flex gap-4 items-center min-w-0">
                      {p.images?.[0] ? (
                        <img src={p.images[0]} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-600)" strokeWidth="1.6"><path d="M4 7h3l2-2h6l2 2h3v13H4V7z" /></svg>
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="font-semibold text-ink-950 truncate">{p.name}</h3>
                        <p className="text-sm text-gray-500">
                          Rs {p.price}{" "}
                          {p.stock <= LOW_STOCK_THRESHOLD && (
                            <span className="text-yellow-700 font-semibold">· {p.stock} left</span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 shrink-0">
                      <button
                        onClick={() => editProduct(p)}
                        className="text-accent-600 font-semibold hover:scale-110 transition"
                      >
                        Edit
                      </button>
                      {confirmDeleteId === p._id ? (
                        <div className="flex gap-2">
                          <button onClick={() => deleteProduct(p._id)} className="text-red-600 font-semibold text-sm">
                            Confirm
                          </button>
                          <button onClick={() => setConfirmDeleteId(null)} className="text-gray-400 text-sm">
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(p._id)}
                          className="text-red-600 font-semibold hover:scale-110 transition"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {products.length === 0 && <p className="text-sm text-gray-500">No products yet.</p>}
            </div>
          </div>
        )}

        {/* ================= ORDERS ================= */}
        {tab === "orders" && (
          <div className="space-y-5">
            {orderStatusFilter && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                Filtered by:
                <span className="inline-flex items-center gap-1.5 bg-ink-950 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase">
                  {orderStatusFilter}
                  <button onClick={() => setOrderStatusFilter("")} className="hover:text-accent-500">×</button>
                </span>
              </div>
            )}

            <AnimatePresence>
              {filteredOrders.map((order) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-2xl border p-6 shadow-sm"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="font-mono text-xs text-gray-400 mb-1">{order._id}</div>
                      <h3 className="font-bold text-lg text-ink-950">
                        {order.shippingAddress?.fullName || order.user?.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        📞 {order.shippingAddress?.phone}
                      </p>
                      <p className="text-sm text-gray-500 mt-1 leading-relaxed max-w-md">
                        📍 {order.shippingAddress?.street}, {order.shippingAddress?.city}
                        {order.shippingAddress?.province ? `, ${order.shippingAddress.province}` : ""}
                        {order.shippingAddress?.postalCode ? ` — ${order.shippingAddress.postalCode}` : ""}
                      </p>
                    </div>
                    <span className={`text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full shrink-0 ${statusPillColor[order.status] || "bg-gray-100 text-gray-600"}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 my-4 space-y-1.5">
                    {order.orderItems?.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm text-gray-600">
                        <span>{item.name} × {item.quantity}</span>
                        <span>Rs {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="font-display font-bold text-ink-950">
                      Total: Rs {order.totalPrice?.toLocaleString()}
                    </div>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="border rounded-xl px-4 py-2"
                    >
                      <option value="pending">pending</option>
                      <option value="processing">processing</option>
                      <option value="shipped">shipped</option>
                      <option value="delivered">delivered</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {filteredOrders.length === 0 && <p className="text-sm text-gray-500">No orders match.</p>}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Admin;