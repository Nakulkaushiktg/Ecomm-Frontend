import { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop.jsx";
import TopProgressBar from "./components/TopProgressBar.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Banner from "./components/Banner.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import BackToTop from "./components/BackToTop.jsx";
import WhatsAppButton from "./components/WhatsAppButton.jsx";
import Loader from "./components/Loader.jsx";
import Home from "./pages/Home.jsx"; // eager — landing page

// lazily loaded on demand — keeps the initial bundle small & first load fast
const Shop = lazy(() => import("./pages/Shop.jsx"));
const ProductDetail = lazy(() => import("./pages/ProductDetail.jsx"));
const Cart = lazy(() => import("./pages/Cart.jsx"));
const Checkout = lazy(() => import("./pages/Checkout.jsx"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess.jsx"));
const TrackOrder = lazy(() => import("./pages/TrackOrder.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const Wishlist = lazy(() => import("./pages/Wishlist.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Info = lazy(() => import("./pages/Info.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Account = lazy(() => import("./pages/Account.jsx"));
const Orders = lazy(() => import("./pages/Orders.jsx"));

function StoreLayout({ children }) {
  const { pathname } = useLocation();
  return (
    <div className="flex min-h-screen flex-col">
      <div className="sticky top-0 z-40">
        <Banner />
        <Navbar />
      </div>
      <main className="flex-1">
        <div key={pathname} className="animate-page">
          <Suspense fallback={<Loader />}>{children}</Suspense>
        </div>
      </main>
      <Footer />
      <CartDrawer />
      <BackToTop />
      <WhatsAppButton />
    </div>
  );
}

export default function App() {
  return (
    <>
      <TopProgressBar />
      <ScrollToTop />
      <Routes>
        {/* storefront */}
        <Route path="/" element={<StoreLayout><Home /></StoreLayout>} />
        <Route path="/shop" element={<StoreLayout><Shop /></StoreLayout>} />
        <Route path="/shop/:category" element={<StoreLayout><Shop /></StoreLayout>} />
        <Route path="/product/:slug" element={<StoreLayout><ProductDetail /></StoreLayout>} />
        <Route path="/cart" element={<StoreLayout><Cart /></StoreLayout>} />
        <Route path="/checkout" element={<StoreLayout><Checkout /></StoreLayout>} />
        <Route path="/order/:id" element={<StoreLayout><OrderSuccess /></StoreLayout>} />
        <Route path="/track" element={<StoreLayout><TrackOrder /></StoreLayout>} />
        <Route path="/contact" element={<StoreLayout><Contact /></StoreLayout>} />
        <Route path="/wishlist" element={<StoreLayout><Wishlist /></StoreLayout>} />
        <Route path="/about" element={<StoreLayout><About /></StoreLayout>} />
        <Route path="/info/:page" element={<StoreLayout><Info /></StoreLayout>} />
        <Route path="/login" element={<StoreLayout><Login /></StoreLayout>} />
        <Route path="/account" element={<StoreLayout><Account /></StoreLayout>} />
        <Route path="/orders" element={<StoreLayout><Orders /></StoreLayout>} />
      </Routes>
    </>
  );
}
