import logo from "../assets/images/Si Thu Paint.jpeg";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
function Header() {
  const menuHandel = () => {
    const sidebar = document.getElementById("sidebar");
    const menu = document.getElementById("menu");

    sidebar.style.width = "250px";

    menu.style.display = "none";
  };

  const closeHandel = () => {
    const sidebar = document.getElementById("sidebar");

    sidebar.style.width = "0px";
    menu.style.display = "inline-block";
  };

  const navbar = document.getElementById("navbar");
  var prev = window.scrollY;

  // window.onscroll = function () {
  //   var current = window.scrollY;
  //   if (prev > current) {
  //     navbar.style.top = "0"; // Show navbar when scrolling up
  //   } else {
  //     navbar.style.top = "-50px"; // Hide navbar when scrolling down (adjust -50px as needed)
  //   }
  //   prev = current;
  // };
  const [scrollY, setScrollY] = useState(window.scrollY);
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className="container-fluid d-block orange p-0 shadow"
      // style={{ top: scrollY > 50 ? "-50px" : "0" }}
      id="navbar"
    >
      {/* Side bar */}
      <ul id="sidebar" className="navbar-nav vh-100 z-3 mb-2 mb-lg-0">
        <li onClick={() => closeHandel()} className="nav-item px-1" id="close">
          <span className="nav-link pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="26px"
              viewBox="0 -960 960 960"
              width="26px"
              fill="#5f6368"
            >
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
            </svg>
          </span>
        </li>

        <li className="nav-item px-1">
          <NavLink
            className="nav-link ps-2"
            style={({ isActive }) => {
              return { color: isActive ? "tomato" : "black" };
            }}
            to="/"
          >
            Home
          </NavLink>
        </li>
        <li className="nav-item px-1">
          <NavLink
            className="nav-link ps-2"
            style={({ isActive }) => {
              return { color: isActive ? "tomato" : "black" };
            }}
            to="/products"
          >
            Products
          </NavLink>
        </li>
        <li className="nav-item px-1">
          <NavLink
            className="nav-link ps-2"
            style={({ isActive }) => {
              return { color: isActive ? "tomato" : "black" };
            }}
            to="/services"
          >
            Services
          </NavLink>
        </li>
        <li className="nav-item px-1">
          <NavLink
            className="nav-link ps-2"
            style={({ isActive }) => {
              return { color: isActive ? "tomato" : "black" };
            }}
            to="/contact"
          >
            Contact
          </NavLink>
        </li>
        <li className="nav-item px-1">
          <NavLink
            className="nav-link ps-2"
            style={({ isActive }) => {
              return { color: isActive ? "tomato" : "black" };
            }}
            to="/about"
          >
            About
          </NavLink>
        </li>
      </ul>
      {/* Side bar */}

      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <NavLink className="navbar-brand" to="/">
            <img src={logo} alt="" width={70} className="rounded-circle" />
          </NavLink>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 " id="sidemap">
            <li className="nav-item px-1">
              <NavLink
                className="nav-link"
                style={({ isActive }) => {
                  return { color: isActive ? "#ddd" : "black" };
                }}
                to="/"
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item px-1">
              <NavLink
                className="nav-link"
                style={({ isActive }) => {
                  return { color: isActive ? "#ddd" : "black" };
                }}
                to="/products"
              >
                Products
              </NavLink>
            </li>
            <li className="nav-item px-1">
              <NavLink
                className="nav-link"
                style={({ isActive }) => {
                  return { color: isActive ? "#ddd" : "black" };
                }}
                to="/services"
              >
                Services
              </NavLink>
            </li>
            <li className="nav-item px-1">
              <NavLink
                className="nav-link"
                style={({ isActive }) => {
                  return { color: isActive ? "#ddd" : "black" };
                }}
                to="/contact"
              >
                Contact Us
              </NavLink>
            </li>
            <li className="nav-item px-1">
              <NavLink
                className="nav-link"
                style={({ isActive }) => {
                  return { color: isActive ? "#ddd" : "black" };
                }}
                to="/about"
              >
                About Us
              </NavLink>
            </li>

            {/* <li className="nav-item px-1">
              <a className="nav-link" to="#">
                <i class="bi bi-linkedin text-primary"></i>
              </a>
            </li>
            <li className="nav-item px-1">
              <a className="nav-link" to="https://github.com/ThihaZaw55/">
                <i class="bi bi-github text-primary"></i>
              </a>
            </li>
            <li className="nav-item px-1">
              <a className="nav-link" to="#">
                <i class="bi bi-facebook text-primary"></i>
              </a>
            </li>
            <li className="nav-item px-1">
              <a className="nav-link" to="#">
                <i class="bi bi-envelope-at-fill text-primary"></i>
              </a>
            </li> */}
            <li
              onClick={() => menuHandel()}
              className="nav-item d-lg-none d-md-inline"
              id="menu"
            >
              <span className="nav-link mx-2 pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="26px"
                  viewBox="0 -960 960 960"
                  width="26px"
                  fill="#5f6368"
                >
                  <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
                </svg>
              </span>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
export default Header;
