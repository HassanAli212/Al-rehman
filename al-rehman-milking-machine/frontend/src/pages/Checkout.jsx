import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const fieldIcon = (type) => {
  const common = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8 };
  const icons = {
    name: <path d="M12 8a4 4 0 100 8 4 4 0 000-8zM4 21v-1a7 7 0 0114 0v1" />,
    phone: <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.12.9.34 1.79.66 2.65a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.43-1.27a2 2 0 012.11-.45c.86.32 1.75.54 2.65.66A2 2 0 0122 16.92z" />,
    street: <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />,
    city: <path d="M4 21V7a2 2 0 012-2h4v16M14 21V3h6v18M4 21h16M9 9h.01M9 13h.01M17 8h.01M17 12h.01M17 16h.01" />,
    pin: <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0118 0zM12 13a3 3 0 100-6 3 3 0 000 6z" />,
  };
  return <svg {...common}>{icons[type]}</svg>;
};

const fieldVariants = {
  hidden: { opacity: 0, y: 14 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: 0.08 + i * 0.06, ease: [0.16, 1, 0.3, 1] },
  }),
};

const InputField = ({ icon, custom, ...props }) => (
  <motion.div variants={fieldVariants} custom={custom} className="relative">
    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-500/60">
      {fieldIcon(icon)}
    </span>
    <motion.input
      {...props}
      whileFocus={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="w-full bg-gray-50/70 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm text-ink-950 placeholder:text-gray-600/50 focus:outline-none focus:border-brand-500 focus:bg-white focus:shadow-[0_0_0_4px_var(--color-brand-50)] transition-all"
    />
  </motion.div>
);

const Checkout = () => {
  const { cartItems, itemsPrice, clearCart } = useCart();
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: userInfo?.name || "",
    phone: "",
    street: "",
    city: "",
    province: "",
    postalCode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const shippingPrice = 0;
  const totalPrice = itemsPrice;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const sendWhatsAppOrder = (orderData) => {
    const phone = "923084590379";
    const message = `New Order Received

Customer:
${orderData.shippingAddress.fullName}

Phone:
${orderData.shippingAddress.phone}

Address:
${orderData.shippingAddress.street},
${orderData.shippingAddress.city},
${orderData.shippingAddress.province}

Products:
${orderData.orderItems.map((item) => `${item.name} × ${item.quantity}`).join("\n")}

Total:
Rs ${orderData.totalPrice}

Payment:
${orderData.paymentMethod}`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!userInfo) {
      navigate("/login?redirect=/checkout");
      return;
    }

    setPlacing(true);
    setError("");

    try {
      const orderItems = cartItems.map((item) => ({
        product: item._id,
        name: item.name,
        image: item.images?.[0],
        price: item.discountPrice || item.price,
        quantity: item.quantity,
      }));

      const response = await api.post("/orders", {
        orderItems,
        shippingAddress: form,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
      });

      sendWhatsAppOrder(response.data);
      clearCart();
      navigate("/my-orders");
    } catch (err) {
      setError(err.response?.data?.message || "Could not place order");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-5 py-14">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="font-display text-2xl md:text-3xl font-bold uppercase tracking-wide text-ink-950 mb-8 border-b-2 border-ink-950 pb-4"
      >
        Checkout
      </motion.h1>

      <div className="grid md:grid-cols-3 gap-10">
        <motion.form
          onSubmit={handlePlaceOrder}
          className="md:col-span-2 space-y-4"
          initial="hidden"
          animate="show"
        >
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-accent-600 mb-1">
            Shipping Details
          </h2>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3 overflow-hidden"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <InputField custom={0} icon="name" name="fullName" placeholder="Full name" value={form.fullName} onChange={handleChange} required />
          <InputField custom={1} icon="phone" name="phone" placeholder="Phone number" value={form.phone} onChange={handleChange} required />
          <InputField custom={2} icon="street" name="street" placeholder="Street address" value={form.street} onChange={handleChange} required />

          <div className="grid grid-cols-2 gap-4">
            <InputField custom={3} icon="city" name="city" placeholder="City" value={form.city} onChange={handleChange} required />
            <InputField custom={3} icon="pin" name="province" placeholder="Province" value={form.province} onChange={handleChange} required />
          </div>

          <InputField custom={4} icon="pin" name="postalCode" placeholder="Postal code (optional)" value={form.postalCode} onChange={handleChange} />

          <motion.h2
            variants={fieldVariants}
            custom={5}
            className="font-display text-sm font-semibold uppercase tracking-wide text-accent-600 pt-4"
          >
            Payment Method
          </motion.h2>

          <motion.label
            variants={fieldVariants}
            custom={6}
            className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3.5 cursor-pointer has-[:checked]:border-accent-600 has-[:checked]:bg-accent-50 transition-colors"
          >
            <input
              type="radio"
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
              className="accent-accent-600"
            />
            <span className="text-sm font-medium text-ink-950">Cash on Delivery</span>
          </motion.label>

          <motion.button
            variants={fieldVariants}
            custom={7}
            type="submit"
            disabled={placing || cartItems.length === 0}
            whileHover={!placing ? { scale: 1.02, boxShadow: "0 12px 28px -6px rgba(193,127,42,0.5)" } : {}}
            whileTap={!placing ? { scale: 0.98 } : {}}
            className="clip-tag w-full bg-accent-600 disabled:bg-gray-200 disabled:text-gray-400 text-ink-950 font-display font-semibold uppercase tracking-wide text-xs py-3.5 mt-4 hover:bg-accent-500 transition-colors flex items-center justify-center gap-2"
          >
            {placing && (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-ink-950/30 border-t-ink-950 rounded-full"
              />
            )}
            {placing ? "Placing order..." : "Place Order →"}
          </motion.button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-accent-600 mb-4">
            Order Summary
          </h2>

          <div className="bg-gray-50 border border-gray-200 p-5 space-y-3 text-sm">
            {cartItems.map((item) => (
              <div key={item._id} className="flex justify-between text-gray-600">
                <span className="pr-2">{item.name} × {item.quantity}</span>
                <span className="font-medium text-ink-950 shrink-0">
                  Rs {((item.discountPrice || item.price) * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}

            <div className="border-t border-gray-200 pt-3 flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium text-ink-950">Rs {itemsPrice.toLocaleString()}</span>
            </div>

            <div className="border-t border-gray-200 pt-3 text-xs text-gray-500">
              Delivery charges will be confirmed with you on WhatsApp before dispatch.
            </div>

            <div className="border-t border-gray-200 pt-3 flex justify-between font-display font-bold text-base text-ink-950">
              <span>Total</span>
              <span>Rs {totalPrice.toLocaleString()}</span>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-4 leading-relaxed">
            After placing your order, WhatsApp will open automatically with
            your order details sent to us — this confirms your order faster.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;