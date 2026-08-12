import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";

const statusColor = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  processing: "bg-blue-100 text-blue-800 border-blue-200",
  shipped: "bg-purple-100 text-purple-800 border-purple-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/orders/my-orders")
      .then((res) => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-5 py-14">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="font-display text-2xl md:text-3xl font-bold uppercase tracking-wide text-ink-950 mb-8 border-b-2 border-ink-950 pb-4"
      >
        My Orders
      </motion.h1>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-44 bg-gray-100 rounded-xl border border-gray-200 animate-pulse"
              />
            ))}
          </motion.div>
        ) : orders.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 border border-gray-200 rounded-xl py-12 text-center"
          >
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-white border border-gray-200 flex items-center justify-center text-brand-500">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 2h12l1 20H5L6 2z" />
                <path d="M9 6h6" />
              </svg>
            </div>
            <p className="text-gray-600 text-sm">No orders placed yet.</p>
          </motion.div>
        ) : (
          <motion.div key="orders" initial="hidden" animate="show" className="space-y-5">
            {orders.map((order, index) => (
              <motion.div
                key={order._id}
                variants={cardVariants}
                custom={index}
                whileHover={{ y: -4 }}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg transition-shadow"
              >
                {/* Header */}
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">Order ID</p>
                    <p className="font-mono text-xs md:text-sm text-ink-950 break-all">{order._id}</p>
                  </div>

                  <span
                    className={`text-[10px] md:text-xs font-semibold uppercase px-3 py-1 rounded-full border ${
                      statusColor[order.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Items */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-3 mb-4">
                  {order.orderItems.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex justify-between gap-3 text-sm text-gray-600"
                    >
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-medium text-ink-950 whitespace-nowrap">
                        Rs {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Total */}
                <div className="flex justify-between border-t border-gray-200 pt-3 font-display font-bold text-sm text-ink-950">
                  <span>Total</span>
                  <span>Rs {order.totalPrice.toLocaleString()}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyOrders;