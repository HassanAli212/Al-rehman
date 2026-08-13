// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useCart } from "../context/CartContext";
// import { useWishlist } from "../context/WishlistContext";
// import { useAuth } from "../context/AuthContext";
// import Logo from "./Logo";
// import ScrollLink from "./ScrollLink";

// const navIcon = (type) => {
//   const common = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8 };
//   const icons = {
//     home: <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />,
//     products: <path d="M4 7h3l2-2h6l2 2h3v13H4V7z" />,
//     gallery: <path d="M3 5h18v14H3zM3 15l5-5 4 4 5-5 4 4" />,
//     about: <path d="M12 8a4 4 0 100 8 4 4 0 000-8zM4 21v-1a7 7 0 0114 0v1" />,
//     contact: <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />,
//   };
//   return <svg {...common}>{icons[type]}</svg>;
// };

// const categoryPreview = [
//   { key: "single-bucket", label: "Single Bucket" },
//   { key: "double-bucket", label: "Double Bucket" },
//   { key: "spare-parts", label: "Spare Parts" },
//   { key: "dairy-essentials", label: "Dairy Essentials" },
// ];

// const NavLink = ({ children, active, className = "", ...props }) => (
//   <span className={`relative group ${className}`} {...props}>
//     {children}
//     <span
//       className={`absolute left-0 -bottom-1 h-[2px] bg-accent-600 transition-all duration-300 ${
//         active ? "w-full" : "w-0 group-hover:w-full"
//       }`}
//     />
//   </span>
// );

// // Bottom-bar icon set (Kissan Mall style: Menu / Account / Search / Wishlist)
// const bottomIcon = (type) => {
//   const common = { width: 21, height: 21, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7 };
//   const icons = {
//     menu: <path d="M3 6h18M3 12h18M3 18h18" />,
//     account: (
//       <>
//         <circle cx="12" cy="8" r="4" />
//         <path d="M4 21v-1a7 7 0 0114 0v1" />
//       </>
//     ),
//     search: (
//       <>
//         <circle cx="11" cy="11" r="7" />
//         <path d="M21 21l-4.3-4.3" />
//       </>
//     ),
//     wishlist: <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />,
//   };
//   return <svg {...common}>{icons[type]}</svg>;
// };

// const Navbar = () => {
//   const { cartItems } = useCart();
//   const { wishlistItems } = useWishlist();
//   const { userInfo, logout } = useAuth();
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const [productsHover, setProductsHover] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 8);
//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   // Lock body scroll while the mobile drawer is open
//   useEffect(() => {
//     document.body.style.overflow = menuOpen ? "hidden" : "";
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [menuOpen]);

//   const handleLogout = () => {
//     logout();
//     setMenuOpen(false);
//     navigate("/");
//   };

//   const navLinks = [
//     { to: "/", label: "Home", refresh: true, icon: "home" },
//     { to: "/products", label: "Products", icon: "products", dropdown: true },
//     { to: "/gallery", label: "Gallery", icon: "gallery" },
//     { to: "/about", label: "About Us", icon: "about" },
//     { to: "/contact", label: "Contact", icon: "contact" },
//   ];

//   const isActive = (to) => (to === "/" ? location.pathname === "/" : location.pathname.startsWith(to));

//   return (
//     <>
//       <header className="sticky top-0 z-50">
//         {/* TOP BAR — scrolling ticker */}
//         <div className="relative overflow-hidden bg-ink-950 py-2">
//           <div className="absolute inset-0 dot-texture text-brand-600 opacity-30" />
//           <div className="relative flex whitespace-nowrap">
//             <motion.div
//               className="flex shrink-0 gap-16 pr-16"
//               animate={{ x: ["0%", "-50%"] }}
//               transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
//             >
//               {Array(4).fill(0).map((_, i) => (
//                 <span key={i} className="text-white text-[11px] md:text-xs font-medium tracking-wide flex items-center gap-2">
//                   <span className="w-1 h-1 rounded-full bg-accent-600" />
//                   <span className="text-accent-600 font-semibold">Al Rahman Milking Machines</span>
//                   {" "}— Genuine Dairy Equipment &amp; Spare Parts Delivered Across Pakistan
//                 </span>
//               ))}
//             </motion.div>
//           </div>
//         </div>
//         <div className="stripe-band" />

//         {/* NAVBAR */}
//         <motion.div
//           initial={{ opacity: 0, y: -15 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.05 }}
//           className={`border-b transition-shadow duration-300 ${
//             scrolled ? "bg-white/90 backdrop-blur-md border-gray-200 shadow-[0_4px_20px_-8px_rgba(15,42,68,0.15)]" : "bg-white border-gray-100"
//           }`}
//         >
//           <div className="max-w-6xl mx-auto px-5 flex items-center justify-between h-20">
//             {/* MOBILE BUTTON — opens the side drawer */}
//             <motion.button
//               whileTap={{ scale: 0.9 }}
//               onClick={() => setMenuOpen(true)}
//               className="lg:hidden cursor-pointer text-ink-950"
//               aria-label="Open menu"
//             >
//               <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
//                 <path d="M3 6h18M3 12h18M3 18h18" />
//               </svg>
//             </motion.button>

//             {/* LOGO */}
//             <a href="/" className="flex items-center gap-2.5">
//               <div className="relative">
//                 <motion.div
//                   className="absolute inset-0 rounded-full"
//                   animate={{ boxShadow: ["0 0 0 0 rgba(193,127,42,0.35)", "0 0 0 6px rgba(193,127,42,0)"] }}
//                   transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
//                 />
//                 <motion.div
//                   whileHover={{ scale: 1.08 }}
//                   transition={{ duration: 0.3 }}
//                   className="relative bg-brand-50 rounded-full p-1 ring-1 ring-accent-500/25"
//                 >
//                   <Logo size={44} />
//                 </motion.div>
//               </div>
//               <div className="font-display leading-none">
//                 <div className="text-lg font-bold text-ink-950 tracking-wide">Al Rahman</div>
//                 <div className="text-[10px] text-accent-600 font-semibold tracking-[0.15em] uppercase">
//                   Milking Machine
//                 </div>
//               </div>
//             </a>

//             {/* DESKTOP LINKS */}
//             <nav className="hidden lg:flex items-center gap-8 font-medium text-sm">
//               {navLinks.map((l, i) => {
//                 const linkEl = l.refresh ? (
//                   <a key={l.to} href={l.to}>
//                     <NavLink active={isActive(l.to)} className="text-ink-950 no-underline pb-1">
//                       {l.label}
//                     </NavLink>
//                   </a>
//                 ) : (
//                   <ScrollLink key={l.to} to={l.to} className="no-underline">
//                     <NavLink active={isActive(l.to)} className="text-ink-950 pb-1">
//                       <span className="inline-flex items-center gap-1">
//                         {l.label}
//                         {l.dropdown && (
//                           <motion.svg
//                             width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
//                             animate={{ rotate: productsHover ? 180 : 0 }}
//                             transition={{ duration: 0.2 }}
//                             className="text-accent-600"
//                           >
//                             <path d="M6 9l6 6 6-6" />
//                           </motion.svg>
//                         )}
//                       </span>
//                     </NavLink>
//                   </ScrollLink>
//                 );

//                 return (
//                   <motion.div
//                     key={l.to}
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.4, delay: i * 0.06 }}
//                     className="relative"
//                     onMouseEnter={() => l.dropdown && setProductsHover(true)}
//                     onMouseLeave={() => l.dropdown && setProductsHover(false)}
//                   >
//                     {linkEl}

//                     {l.dropdown && (
//                       <AnimatePresence>
//                         {productsHover && (
//                           <motion.div
//                             initial={{ opacity: 0, y: 8, scale: 0.97 }}
//                             animate={{ opacity: 1, y: 0, scale: 1 }}
//                             exit={{ opacity: 0, y: 8, scale: 0.97 }}
//                             transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
//                             className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-80"
//                           >
//                             <div className="bg-white border border-gray-200 shadow-[0_24px_50px_-14px_rgba(15,42,68,0.3)] overflow-hidden">
//                             <div className="stripe-band" style={{ height: 3 }} />
//                             <div className="p-4">
//                               <div className="text-[10px] font-display font-semibold uppercase tracking-widest text-accent-600 mb-3 px-1">
//                                 Shop by Category
//                               </div>
//                               <div className="grid grid-cols-2 gap-2">
//                                 {categoryPreview.map((c) => (
//                                   <Link
//                                     key={c.key}
//                                     to={`/products?category=${c.key}`}
//                                     className="group/item flex items-center gap-2.5 p-3 border border-gray-100 hover:border-accent-600 hover:bg-accent-50 transition-colors"
//                                   >
//                                     <span className="w-1 h-5 bg-brand-500 group-hover/item:bg-accent-600 transition-colors shrink-0" />
//                                     <span className="text-xs font-semibold text-ink-950">{c.label}</span>
//                                   </Link>
//                                 ))}
//                               </div>
//                               <Link
//                                 to="/products"
//                                 className="clip-tag mt-3 flex items-center justify-center gap-1.5 bg-ink-950 text-white text-xs font-display font-semibold uppercase tracking-wide py-2.5 hover:bg-brand-600 transition-colors"
//                               >
//                                 View All Products →
//                               </Link>
//                             </div>
//                             </div>
//                           </motion.div>
//                         )}
//                       </AnimatePresence>
//                     )}
//                   </motion.div>
//                 );
//               })}
//             </nav>

//             {/* RIGHT SIDE */}
//             <div className="flex items-center gap-4">
//               {/* PHONE */}
//               <motion.a
//                 href="tel:+923084590379"
//                 initial={{ opacity: 0, y: -10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.35 }}
//                 whileHover={{ scale: 1.03 }}
//                 className="hidden md:flex items-center gap-2 text-brand-600 font-semibold text-sm"
//               >
//                 <span className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center">
//                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                     <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
//                   </svg>
//                 </span>
//                 0308-4590379
//               </motion.a>

//               <span className="hidden md:block w-px h-6 bg-gray-200" />

//               {/* WISHLIST — hidden on mobile, bottom bar covers it there */}
//               <Link to="/wishlist" className="relative hidden sm:flex items-center text-ink-950 group">
//                 <motion.span
//                   whileHover={{ scale: 1.1 }}
//                   className="w-9 h-9 rounded-full flex items-center justify-center group-hover:bg-brand-50 transition-colors"
//                 >
//                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
//                     <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
//                   </svg>
//                 </motion.span>
//                 <AnimatePresence>
//                   {wishlistItems.length > 0 && (
//                     <motion.span
//                       key={wishlistItems.length}
//                       initial={{ scale: 0 }}
//                       animate={{ scale: 1 }}
//                       exit={{ scale: 0 }}
//                       transition={{ type: "spring", stiffness: 400, damping: 15 }}
//                       className="absolute top-0 right-0 bg-accent-600 text-ink-950 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
//                     >
//                       {wishlistItems.length}
//                     </motion.span>
//                   )}
//                 </AnimatePresence>
//               </Link>

//               {/* CART */}
//               <Link to="/cart" className="relative flex items-center text-ink-950 group">
//                 <motion.span
//                   whileHover={{ scale: 1.1 }}
//                   className="w-9 h-9 rounded-full flex items-center justify-center group-hover:bg-brand-50 transition-colors"
//                 >
//                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
//                     <circle cx="9" cy="21" r="1" />
//                     <circle cx="20" cy="21" r="1" />
//                     <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
//                   </svg>
//                 </motion.span>
//                 <AnimatePresence>
//                   {cartCount > 0 && (
//                     <motion.span
//                       key={cartCount}
//                       initial={{ scale: 0 }}
//                       animate={{ scale: 1 }}
//                       exit={{ scale: 0 }}
//                       transition={{ type: "spring", stiffness: 400, damping: 15 }}
//                       className="absolute top-0 right-0 bg-accent-600 text-ink-950 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
//                     >
//                       {cartCount}
//                     </motion.span>
//                   )}
//                 </AnimatePresence>
//               </Link>

//               {/* USER — desktop only, drawer covers mobile */}
//               {userInfo ? (
//                 <motion.div
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5, delay: 0.45 }}
//                   className="hidden md:flex items-center gap-4 text-sm"
//                 >
//                   <Link to="/my-orders">
//                     <NavLink active={isActive("/my-orders")} className="text-ink-950 pb-1">Orders</NavLink>
//                   </Link>
//                   <button onClick={handleLogout} className="cursor-pointer">
//                     <NavLink className="text-ink-950 pb-1">Logout</NavLink>
//                   </button>
//                 </motion.div>
//               ) : (
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.9 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ duration: 0.5, delay: 0.45 }}
//                 >
//                   <Link to="/login">
//                     <motion.span
//                       whileHover={{ scale: 1.04, boxShadow: "0 10px 22px -6px rgba(193,127,42,0.5)" }}
//                       whileTap={{ scale: 0.96 }}
//                       className="clip-tag hidden md:inline-flex items-center gap-1.5 text-xs font-display font-semibold uppercase tracking-wide bg-accent-600 text-ink-950 px-5 py-2.5 hover:bg-accent-500 transition-colors"
//                     >
//                       Sign In →
//                     </motion.span>
//                   </Link>
//                 </motion.div>
//               )}
//             </div>
//           </div>
//         </motion.div>
//       </header>

//       {/* SIDE DRAWER — slides in from the left, with backdrop */}
//       <AnimatePresence>
//         {menuOpen && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.25 }}
//               onClick={() => setMenuOpen(false)}
//               className="fixed inset-0 bg-ink-950/50 backdrop-blur-[2px] z-[60] lg:hidden"
//             />
//             <motion.div
//               initial={{ x: "-100%" }}
//               animate={{ x: 0 }}
//               exit={{ x: "-100%" }}
//               transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
//               className="fixed inset-y-0 left-0 w-[82%] max-w-xs bg-white z-[70] lg:hidden flex flex-col shadow-2xl"
//             >
//               {/* Drawer header */}
//               <div className="flex items-center justify-between px-5 h-20 border-b border-gray-100 shrink-0">
//                 <div className="flex items-center gap-2.5">
//                   <Logo size={38} />
//                   <div className="font-display leading-none">
//                     <div className="text-base font-bold text-ink-950">Al Rahman</div>
//                     <div className="text-[9px] text-accent-600 font-semibold tracking-widest uppercase">
//                       Milking Machine
//                     </div>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setMenuOpen(false)}
//                   aria-label="Close menu"
//                   className="w-9 h-9 rounded-full flex items-center justify-center text-ink-950 hover:bg-gray-100 transition-colors"
//                 >
//                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
//                     <path d="M18 6L6 18M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>

//               {/* Drawer body — scrollable */}
//               <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-1 text-sm">
//                 {navLinks.map((l, i) => {
//                   const content = (
//                     <motion.div
//                       initial={{ opacity: 0, x: -12 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ duration: 0.3, delay: i * 0.05 }}
//                       className={`flex items-center gap-3 py-3 transition-colors ${
//                         isActive(l.to) ? "text-accent-600 font-semibold" : "text-ink-950"
//                       }`}
//                     >
//                       <span className="text-accent-600">{navIcon(l.icon)}</span>
//                       {l.label}
//                     </motion.div>
//                   );
//                   return l.refresh ? (
//                     <a key={l.to} href={l.to} onClick={() => setMenuOpen(false)}>
//                       {content}
//                     </a>
//                   ) : (
//                     <ScrollLink key={l.to} to={l.to} onClick={() => setMenuOpen(false)}>
//                       {content}
//                     </ScrollLink>
//                   );
//                 })}

//                 <div className="border-t border-gray-100 my-2" />

//                 <Link
//                   to="/wishlist"
//                   onClick={() => setMenuOpen(false)}
//                   className="flex items-center justify-between py-3 text-ink-950"
//                 >
//                   <span className="flex items-center gap-3">
//                     <span className="text-accent-600">{bottomIcon("wishlist")}</span>
//                     Wishlist
//                   </span>
//                   {wishlistItems.length > 0 && (
//                     <span className="bg-accent-600 text-ink-950 text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
//                       {wishlistItems.length}
//                     </span>
//                   )}
//                 </Link>

//                 <Link
//                   to="/cart"
//                   onClick={() => setMenuOpen(false)}
//                   className="flex items-center justify-between py-3 text-ink-950"
//                 >
//                   <span className="flex items-center gap-3">
//                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-accent-600">
//                       <circle cx="9" cy="21" r="1" />
//                       <circle cx="20" cy="21" r="1" />
//                       <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
//                     </svg>
//                     Cart
//                   </span>
//                   {cartCount > 0 && (
//                     <span className="bg-accent-600 text-ink-950 text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
//                       {cartCount}
//                     </span>
//                   )}
//                 </Link>

//                 <div className="border-t border-gray-100 my-2" />

//                 {userInfo ? (
//                   <>
//                     <Link
//                       to="/my-orders"
//                       onClick={() => setMenuOpen(false)}
//                       className="text-ink-950 py-3"
//                     >
//                       Orders
//                     </Link>
//                     <button
//                       onClick={handleLogout}
//                       className="text-left text-red-600 font-medium py-3 cursor-pointer"
//                     >
//                       Logout
//                     </button>
//                   </>
//                 ) : (
//                   <Link
//                     to="/login"
//                     onClick={() => setMenuOpen(false)}
//                     className="clip-tag inline-flex items-center justify-center gap-1.5 text-xs font-display font-semibold uppercase tracking-wide bg-accent-600 text-ink-950 px-5 py-3 mt-1"
//                   >
//                     Sign In →
//                   </Link>
//                 )}
//               </div>

//               {/* Drawer footer — phone */}
//               <a
//                 href="tel:+923084590379"
//                 className="flex items-center gap-2 px-5 h-16 border-t border-gray-100 text-brand-600 font-semibold text-sm shrink-0"
//               >
//                 <span className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center">
//                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                     <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
//                   </svg>
//                 </span>
//                 0308-4590379
//               </a>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>

//       {/* BOTTOM MOBILE NAV BAR — Menu / Account / Search / Wishlist */}
//       <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 flex items-stretch h-16 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
//         <button
//           onClick={() => setMenuOpen(true)}
//           className="flex-1 flex flex-col items-center justify-center gap-1 text-ink-950"
//         >
//           {bottomIcon("menu")}
//           <span className="text-[10px] font-medium">Menu</span>
//         </button>

//         <Link
//           to={userInfo ? "/my-orders" : "/login"}
//           className={`flex-1 flex flex-col items-center justify-center gap-1 ${
//             isActive("/my-orders") || isActive("/login") ? "text-accent-600" : "text-ink-950"
//           }`}
//         >
//           {bottomIcon("account")}
//           <span className="text-[10px] font-medium">Account</span>
//         </Link>

//         <Link
//           to="/products"
//           className={`flex-1 flex flex-col items-center justify-center gap-1 ${
//             isActive("/products") ? "text-accent-600" : "text-ink-950"
//           }`}
//         >
//           {bottomIcon("search")}
//           <span className="text-[10px] font-medium">Search</span>
//         </Link>

//         <Link
//           to="/wishlist"
//           className={`relative flex-1 flex flex-col items-center justify-center gap-1 ${
//             isActive("/wishlist") ? "text-accent-600" : "text-ink-950"
//           }`}
//         >
//           <span className="relative">
//             {bottomIcon("wishlist")}
//             {wishlistItems.length > 0 && (
//               <span className="absolute -top-1.5 -right-2 bg-accent-600 text-ink-950 text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
//                 {wishlistItems.length}
//               </span>
//             )}
//           </span>
//           <span className="text-[10px] font-medium">Wishlist</span>
//         </Link>
//       </nav>
//     </>
//   );
// };

// export default Navbar;

import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";
import ScrollLink from "./ScrollLink";

const navIcon = (type) => {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
  };

  const icons = {
    home: <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />,
    products: <path d="M4 7h3l2-2h6l2 2h3v13H4V7z" />,
    gallery: (
      <>
        <path d="M3 5h18v14H3z" />
        <path d="M3 15l5-5 4 4 5-5 4 4" />
      </>
    ),
    about: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21v-1a7 7 0 0114 0v1" />
      </>
    ),
    contact: <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />,
  };

  return <svg {...common}>{icons[type]}</svg>;
};

const categoryPreview = [
  { key: "single-bucket", label: "Single Bucket" },
  { key: "double-bucket", label: "Double Bucket" },
  { key: "spare-parts", label: "Spare Parts" },
  { key: "dairy-essentials", label: "Dairy Essentials" },
];

const NavLink = ({ children, active, className = "", ...props }) => (
  <span className={`relative group ${className}`} {...props}>
    {children}

    <span
      className={`absolute left-0 -bottom-1 h-[2px] bg-accent-600 transition-all duration-300 ${
        active ? "w-full" : "w-0 group-hover:w-full"
      }`}
    />
  </span>
);

// Bottom-bar icon set
const bottomIcon = (type) => {
  const common = {
    width: 21,
    height: 21,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
  };

  const icons = {
    menu: <path d="M3 6h18M3 12h18M3 18h18" />,

    account: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21v-1a7 7 0 0114 0v1" />
      </>
    ),

    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
      </>
    ),

    wishlist: (
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    ),
  };

  return <svg {...common}>{icons[type]}</svg>;
};

const Navbar = () => {
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { userInfo, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [productsHover, setProductsHover] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  const navLinks = [
    {
      to: "/",
      label: "Home",
      refresh: true,
      icon: "home",
    },
    {
      to: "/products",
      label: "Products",
      icon: "products",
      dropdown: true,
    },
    {
      to: "/gallery",
      label: "Gallery",
      icon: "gallery",
    },
    {
      to: "/about",
      label: "About Us",
      icon: "about",
    },
    {
      to: "/contact",
      label: "Contact",
      icon: "contact",
    },
  ];

  const isActive = (to) =>
    to === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(to);

  return (
    <>
      <header className="sticky top-0 z-50">
        {/* TOP BAR */}
        <div className="relative overflow-hidden bg-ink-950 py-2">
          <div className="absolute inset-0 dot-texture text-brand-600 opacity-30" />

          <div className="relative flex whitespace-nowrap">
            <motion.div
              className="flex shrink-0 gap-16 pr-16"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                duration: 22,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <span
                    key={i}
                    className="text-white text-[11px] md:text-xs font-medium tracking-wide flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-accent-600" />

                    <span className="text-accent-600 font-semibold">
                      Al Rahman Milking Machines
                    </span>

                    {" "}— Genuine Dairy Equipment &amp; Spare Parts
                    Delivered Across Pakistan
                  </span>
                ))}
            </motion.div>
          </div>
        </div>

        <div className="stripe-band" />

        {/* NAVBAR */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.05,
          }}
          className={`border-b transition-shadow duration-300 ${
            scrolled
              ? "bg-white/90 backdrop-blur-md border-gray-200 shadow-[0_4px_20px_-8px_rgba(15,42,68,0.15)]"
              : "bg-white border-gray-100"
          }`}
        >
          <div className="max-w-6xl mx-auto px-5 flex items-center justify-between h-20">
            {/* MOBILE MENU BUTTON */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMenuOpen(true)}
              className="lg:hidden cursor-pointer text-ink-950"
              aria-label="Open menu"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </motion.button>

            {/* LOGO */}
            <a href="/" className="flex items-center gap-2.5">
              <div className="relative">
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(193,127,42,0.35)",
                      "0 0 0 6px rgba(193,127,42,0)",
                    ],
                  }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />

                <motion.div
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.3 }}
                  className="relative bg-brand-50 rounded-full p-1 ring-1 ring-accent-500/25"
                >
                  <Logo size={44} />
                </motion.div>
              </div>

              <div className="font-display leading-none">
                <div className="text-lg font-bold text-ink-950 tracking-wide">
                  Al Rahman
                </div>

                <div className="text-[10px] text-accent-600 font-semibold tracking-[0.15em] uppercase">
                  Milking Machine
                </div>
              </div>
            </a>

            {/* DESKTOP LINKS */}
            <nav className="hidden lg:flex items-center gap-8 font-medium text-sm">
              {navLinks.map((l, i) => {
                const linkEl = l.refresh ? (
                  <a key={l.to} href={l.to}>
                    <NavLink
                      active={isActive(l.to)}
                      className="text-ink-950 no-underline pb-1"
                    >
                      {l.label}
                    </NavLink>
                  </a>
                ) : (
                  <ScrollLink
                    key={l.to}
                    to={l.to}
                    className="no-underline"
                  >
                    <NavLink
                      active={isActive(l.to)}
                      className="text-ink-950 pb-1"
                    >
                      <span className="inline-flex items-center gap-1">
                        {l.label}

                        {l.dropdown && (
                          <motion.svg
                            width="11"
                            height="11"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            animate={{
                              rotate: productsHover ? 180 : 0,
                            }}
                            transition={{ duration: 0.2 }}
                            className="text-accent-600"
                          >
                            <path d="M6 9l6 6 6-6" />
                          </motion.svg>
                        )}
                      </span>
                    </NavLink>
                  </ScrollLink>
                );

                return (
                  <motion.div
                    key={l.to}
                    initial={{
                      opacity: 0,
                      y: -10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.4,
                      delay: i * 0.06,
                    }}
                    className="relative"
                    onMouseEnter={() =>
                      l.dropdown && setProductsHover(true)
                    }
                    onMouseLeave={() =>
                      l.dropdown && setProductsHover(false)
                    }
                  >
                    {linkEl}

                    {l.dropdown && (
                      <AnimatePresence>
                        {productsHover && (
                          <motion.div
                            initial={{
                              opacity: 0,
                              y: 8,
                              scale: 0.97,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                              scale: 1,
                            }}
                            exit={{
                              opacity: 0,
                              y: 8,
                              scale: 0.97,
                            }}
                            transition={{
                              duration: 0.18,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-80"
                          >
                            <div className="bg-white border border-gray-200 shadow-[0_24px_50px_-14px_rgba(15,42,68,0.3)] overflow-hidden">
                              <div
                                className="stripe-band"
                                style={{ height: 3 }}
                              />

                              <div className="p-4">
                                <div className="text-[10px] font-display font-semibold uppercase tracking-widest text-accent-600 mb-3 px-1">
                                  Shop by Category
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  {categoryPreview.map((c) => (
                                    <Link
                                      key={c.key}
                                      to={`/products?category=${c.key}`}
                                      className="group/item flex items-center gap-2.5 p-3 border border-gray-100 hover:border-accent-600 hover:bg-accent-50 transition-colors"
                                    >
                                      <span className="w-1 h-5 bg-brand-500 group-hover/item:bg-accent-600 transition-colors shrink-0" />

                                      <span className="text-xs font-semibold text-ink-950">
                                        {c.label}
                                      </span>
                                    </Link>
                                  ))}
                                </div>

                                <Link
                                  to="/products"
                                  className="clip-tag mt-3 flex items-center justify-center gap-1.5 bg-ink-950 text-white text-xs font-display font-semibold uppercase tracking-wide py-2.5 hover:bg-brand-600 transition-colors"
                                >
                                  View All Products →
                                </Link>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </motion.div>
                );
              })}
            </nav>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-4">
              {/* PHONE */}
              <motion.a
                href="tel:+923084590379"
                initial={{
                  opacity: 0,
                  y: -10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.35,
                }}
                whileHover={{ scale: 1.03 }}
                className="hidden md:flex items-center gap-2 text-brand-600 font-semibold text-sm"
              >
                <span className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                </span>

                0308-4590379
              </motion.a>

              <span className="hidden md:block w-px h-6 bg-gray-200" />

              {/* WISHLIST */}
              <Link
                to="/wishlist"
                className="relative hidden sm:flex items-center text-ink-950 group"
              >
                <motion.span
                  whileHover={{ scale: 1.1 }}
                  className="w-9 h-9 rounded-full flex items-center justify-center group-hover:bg-brand-50 transition-colors"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </motion.span>

                <AnimatePresence>
                  {wishlistItems.length > 0 && (
                    <motion.span
                      key={wishlistItems.length}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 15,
                      }}
                      className="absolute top-0 right-0 bg-accent-600 text-ink-950 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      {wishlistItems.length}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {/* CART */}
              <Link
                to="/cart"
                className="relative flex items-center text-ink-950 group"
              >
                <motion.span
                  whileHover={{ scale: 1.1 }}
                  className="w-9 h-9 rounded-full flex items-center justify-center group-hover:bg-brand-50 transition-colors"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
                  </svg>
                </motion.span>

                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 15,
                      }}
                      className="absolute top-0 right-0 bg-accent-600 text-ink-950 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {/* USER */}
              {userInfo ? (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: 0.45,
                  }}
                  className="hidden md:flex items-center gap-4 text-sm"
                >
                  <Link to="/my-orders">
                    <NavLink
                      active={isActive("/my-orders")}
                      className="text-ink-950 pb-1"
                    >
                      Orders
                    </NavLink>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="cursor-pointer"
                  >
                    <NavLink className="text-ink-950 pb-1">
                      Logout
                    </NavLink>
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: 0.45,
                  }}
                  className="hidden md:flex items-center gap-4"
                >
                  {/* CUSTOMER SIGN IN */}
                  <Link to="/login">
                    <motion.span
                      whileHover={{
                        scale: 1.04,
                        boxShadow:
                          "0 10px 22px -6px rgba(193,127,42,0.5)",
                      }}
                      whileTap={{ scale: 0.96 }}
                      className="clip-tag inline-flex items-center gap-1.5 text-xs font-display font-semibold uppercase tracking-wide bg-accent-600 text-ink-950 px-5 py-2.5 hover:bg-accent-500 transition-colors"
                    >
                      Sign In →
                    </motion.span>
                  </Link>

                  {/* ADMIN LOGIN */}
                  <Link to="/admin/login">
                    <motion.span
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className="text-xs font-semibold text-ink-950 hover:text-accent-600 transition-colors cursor-pointer"
                    >
                      Admin
                    </motion.span>
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </header>

      {/* SIDE DRAWER */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* BACKDROP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-ink-950/50 backdrop-blur-[2px] z-[60] lg:hidden"
            />

            {/* DRAWER */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                duration: 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="fixed inset-y-0 left-0 w-[82%] max-w-xs bg-white z-[70] lg:hidden flex flex-col shadow-2xl"
            >
              {/* DRAWER HEADER */}
              <div className="flex items-center justify-between px-5 h-20 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-2.5">
                  <Logo size={38} />

                  <div className="font-display leading-none">
                    <div className="text-base font-bold text-ink-950">
                      Al Rahman
                    </div>

                    <div className="text-[9px] text-accent-600 font-semibold tracking-widest uppercase">
                      Milking Machine
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="w-9 h-9 rounded-full flex items-center justify-center text-ink-950 hover:bg-gray-100 transition-colors"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* DRAWER BODY */}
              <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-1 text-sm">
                {navLinks.map((l, i) => {
                  const content = (
                    <motion.div
                      initial={{
                        opacity: 0,
                        x: -12,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        duration: 0.3,
                        delay: i * 0.05,
                      }}
                      className={`flex items-center gap-3 py-3 transition-colors ${
                        isActive(l.to)
                          ? "text-accent-600 font-semibold"
                          : "text-ink-950"
                      }`}
                    >
                      <span className="text-accent-600">
                        {navIcon(l.icon)}
                      </span>

                      {l.label}
                    </motion.div>
                  );

                  return l.refresh ? (
                    <a
                      key={l.to}
                      href={l.to}
                      onClick={() => setMenuOpen(false)}
                    >
                      {content}
                    </a>
                  ) : (
                    <ScrollLink
                      key={l.to}
                      to={l.to}
                      onClick={() => setMenuOpen(false)}
                    >
                      {content}
                    </ScrollLink>
                  );
                })}

                <div className="border-t border-gray-100 my-2" />

                {/* WISHLIST */}
                <Link
                  to="/wishlist"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between py-3 text-ink-950"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-accent-600">
                      {bottomIcon("wishlist")}
                    </span>

                    Wishlist
                  </span>

                  {wishlistItems.length > 0 && (
                    <span className="bg-accent-600 text-ink-950 text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {wishlistItems.length}
                    </span>
                  )}
                </Link>

                {/* CART */}
                <Link
                  to="/cart"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between py-3 text-ink-950"
                >
                  <span className="flex items-center gap-3">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="text-accent-600"
                    >
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
                    </svg>

                    Cart
                  </span>

                  {cartCount > 0 && (
                    <span className="bg-accent-600 text-ink-950 text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <div className="border-t border-gray-100 my-2" />

                {/* CUSTOMER AUTH */}
                {userInfo ? (
                  <>
                    <Link
                      to="/my-orders"
                      onClick={() => setMenuOpen(false)}
                      className="text-ink-950 py-3"
                    >
                      Orders
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="text-left text-red-600 font-medium py-3 cursor-pointer"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    {/* CUSTOMER LOGIN */}
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="clip-tag inline-flex items-center justify-center gap-1.5 text-xs font-display font-semibold uppercase tracking-wide bg-accent-600 text-ink-950 px-5 py-3 mt-1"
                    >
                      Sign In →
                    </Link>

                    {/* ADMIN LOGIN */}
                    <Link
                      to="/admin/login"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 py-3 mt-2 text-ink-950 hover:text-accent-600 transition-colors"
                    >
                      <span className="text-accent-600">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="M12 2l7 4v5c0 5-3 9-7 11-4-2-7-6-7-11V6l7-4z" />
                          <path d="M9 12l2 2 4-4" />
                        </svg>
                      </span>

                      Admin Login
                    </Link>
                  </>
                )}
              </div>

              {/* DRAWER FOOTER */}
              <a
                href="tel:+923084590379"
                className="flex items-center gap-2 px-5 h-16 border-t border-gray-100 text-brand-600 font-semibold text-sm shrink-0"
              >
                <span className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0022 16.92z" />
                  </svg>
                </span>

                0308-4590379
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MOBILE BOTTOM NAV */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 flex items-stretch h-16 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        {/* MENU */}
        <button
          onClick={() => setMenuOpen(true)}
          className="flex-1 flex flex-col items-center justify-center gap-1 text-ink-950"
        >
          {bottomIcon("menu")}

          <span className="text-[10px] font-medium">
            Menu
          </span>
        </button>

        {/* ACCOUNT */}
        <Link
          to={userInfo ? "/my-orders" : "/login"}
          className={`flex-1 flex flex-col items-center justify-center gap-1 ${
            isActive("/my-orders") || isActive("/login")
              ? "text-accent-600"
              : "text-ink-950"
          }`}
        >
          {bottomIcon("account")}

          <span className="text-[10px] font-medium">
            Account
          </span>
        </Link>

        {/* SEARCH */}
        <Link
          to="/products"
          className={`flex-1 flex flex-col items-center justify-center gap-1 ${
            isActive("/products")
              ? "text-accent-600"
              : "text-ink-950"
          }`}
        >
          {bottomIcon("search")}

          <span className="text-[10px] font-medium">
            Search
          </span>
        </Link>

        {/* WISHLIST */}
        <Link
          to="/wishlist"
          className={`relative flex-1 flex flex-col items-center justify-center gap-1 ${
            isActive("/wishlist")
              ? "text-accent-600"
              : "text-ink-950"
          }`}
        >
          <span className="relative">
            {bottomIcon("wishlist")}

            {wishlistItems.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-accent-600 text-ink-950 text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {wishlistItems.length}
              </span>
            )}
          </span>

          <span className="text-[10px] font-medium">
            Wishlist
          </span>
        </Link>
      </nav>
    </>
  );
};

export default Navbar;