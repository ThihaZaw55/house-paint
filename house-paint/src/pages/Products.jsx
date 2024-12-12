import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import Unilac from "../component/Unilac";

export default function Products() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to track the menu's open/close state
  const aside = document.getElementById("aside");
  // Function to toggle the menu
  function myFunction() {
    setIsMenuOpen(!isMenuOpen); // Toggle the menu state
    aside.style.display = "block";
  }

  return (
    <section className="container-fluid w-100 d-flex p-0 ">
      {/* Hamburger menu */}

      <aside className="" id="aside">
        <div
          id="aside-menu"
          className={`container ${isMenuOpen ? "change" : ""}`} // Apply 'change' class if the menu is open
          onClick={myFunction} // Toggle menu on click
        >
          <div className="bar1"></div>
          <div className="bar2"></div>
          <div className="bar3"></div>
        </div>
        <h2 className={`p-3 ${isMenuOpen ? "show" : "hide"}`}>UPG Products</h2>
        <nav className={`nav flex-column ${isMenuOpen ? "show" : "hide"}`}>
          <NavLink className="nav-link link-dark" to="unilac">
            UNILAC GLOSS ENAMEL Paints
          </NavLink>
          <NavLink className="nav-link link-dark" to="orient">
            ORIENT EMULSION Paints
          </NavLink>
          <NavLink className="nav-link link-dark" to="unitex">
            UNITEX EMULSION Paints
          </NavLink>
          <NavLink className="nav-link link-dark" to="premier">
            PREMIER Paints
          </NavLink>
        </nav>
      </aside>
      <section className="container mt-5" id="product-card">
        <Outlet />
        <Unilac />
      </section>
    </section>
  );
}
