import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./component/Layout";
import Home from "./pages/Home";
import Products from "./pages/Products";

import Unilac from "./component/Unilac";
import Orient from "./component/Orient";
import Unitex from "./component/Unitex";
import Premier from "./component/Premier";

import Services from "./pages/Services";
import Contact from "./pages/Contact";
import About from "./pages/About";

import Error from "./pages/404";

// import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />

          <Route path="/products" element={<Products />}>
            <Route path="unilac" element={<Unilac />} />
            <Route path="orient" element={<Orient />} />
            <Route path="unitex" element={<Unitex />} />
            <Route path="premier" element={<Premier />} />
          </Route>

          <Route path="services" element={<Services />} />
          <Route path="contact" element={<Contact />} />
          <Route path="about" element={<About />} />

          <Route path="*" element={<Error />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
