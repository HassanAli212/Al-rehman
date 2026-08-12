import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import BackToTop from "./components/BackToTop";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyOrders from "./pages/MyOrders";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import AdminRoute from "./components/AdminRoute";
import ScrollToTop from "./components/ScrollToTop";

const PageFade = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.25, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

function App() {
  const location = useLocation();
  const isAdminSection = location.pathname.startsWith("/admin");

  return (
    // pb-16 reserves space so the fixed mobile bottom nav bar (added in Navbar)
    // never covers the footer/last section on phones. lg:pb-0 removes it on
    // desktop where that bottom bar doesn't render.
    <div className={`flex flex-col min-h-screen ${!isAdminSection ? "pb-16 lg:pb-0" : ""}`}>
      <ScrollToTop />
      {!isAdminSection && <Navbar />}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageFade><Home /></PageFade>} />
            <Route path="/products" element={<PageFade><Products /></PageFade>} />
            <Route path="/products/:slug" element={<PageFade><ProductDetail /></PageFade>} />
            <Route path="/gallery" element={<PageFade><Gallery /></PageFade>} />
            <Route path="/about" element={<PageFade><About /></PageFade>} />
            <Route path="/contact" element={<PageFade><Contact /></PageFade>} />
            <Route path="/cart" element={<PageFade><Cart /></PageFade>} />
            <Route path="/wishlist" element={<PageFade><Wishlist /></PageFade>} />
            <Route path="/checkout" element={<PageFade><Checkout /></PageFade>} />
            <Route path="/login" element={<PageFade><Login /></PageFade>} />
            <Route path="/register" element={<PageFade><Register /></PageFade>} />
            <Route path="/my-orders" element={<PageFade><MyOrders /></PageFade>} />
            <Route path="/admin/login" element={<PageFade><AdminLogin /></PageFade>} />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>
      {!isAdminSection && <Footer />}
      {!isAdminSection && <WhatsAppButton />}
      {!isAdminSection && <BackToTop />}
    </div>
  );
}

export default App;