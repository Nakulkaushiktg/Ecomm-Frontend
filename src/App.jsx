import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Banner from "./components/Banner.jsx";
import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import TrackOrder from "./pages/TrackOrder.jsx";
import Contact from "./pages/Contact.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import About from "./pages/About.jsx";
import Info from "./pages/Info.jsx";
import Login from "./pages/Login.jsx";
import Account from "./pages/Account.jsx";
import Orders from "./pages/Orders.jsx";

function StoreLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Banner />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
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
  );
}
