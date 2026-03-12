import Layout from "./components/Layout";
import Home from "./pages/Home";
import Unit from "./pages/Unit";
import Category from "./pages/Category";
import Payment from "./pages/Payment";
import Sale from "./pages/ProductList";
import Item from "./pages/Item";
import Product from "./pages/Product";
import Income from "./pages/Income";

import Error from "./components/404";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="unit" element={<Unit />}></Route>
            <Route path="category" element={<Category />}></Route>
            <Route path="item" element={<Item />}></Route>
            <Route path="product" element={<Product />}></Route>
            <Route path="productlist" element={<Sale />}></Route>
            <Route path="payment" element={<Payment />}></Route>
            <Route path="income" element={<Income />}></Route>
            <Route path="*" element={<Error />} />
          </Route>
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}
