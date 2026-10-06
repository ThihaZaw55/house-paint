import Layout from "./components/ui/Layout";
import Home from "./pages/Home";
import { UnitPage } from "./pages/Unit";
import Purchase from "./pages/Purchase";
import Payment from "./pages/Payment";
import Sale from "./pages/ProductList";
import Item from "./pages/Item";
import Product from "./pages/Product";
import Income from "./pages/Income";
import Error from "./components/404";
import { HashRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import PersonalInfoPage from "./pages/PersonalInfoPage";

export default function App() {
  return (
    <HashRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="unit" element={<UnitPage />}></Route>
            <Route path="item" element={<Item />}></Route>
            <Route path="product" element={<Product />}></Route>
            <Route path="purchase" element={<Purchase />}></Route>
            <Route path="productlist" element={<Sale />}></Route>
            <Route path="payment" element={<Payment />}></Route>
            <Route path="income" element={<Income />}></Route>
            <Route path="personalInfoPage" element={<PersonalInfoPage />}></Route>
            <Route path="*" element={<Error />} />
          </Route>
        </Routes>
      </CartProvider>
    </HashRouter>
  );
}
