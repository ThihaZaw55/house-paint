import { NavLink } from "react-router-dom";
import SidebarItem from "./SidebarItem";
import {
  PaintbrushVertical,
  Boxes,
  Box,
  ShoppingCart,
  CircleDollarSign,
  BanknoteArrowUp,
  Menu,
} from "lucide-react";
import { useState } from "react";
import Logo from "../../assets/Logo.jpg";
import { useCart } from "../../context/CartContext";

export default function Sidebar() {
  const { cartCount } = useCart();
  const [open, setOpen] = useState(true);
  return (
    <aside
      className={`sticky top-0 h-screen bg-white shadow-lg transition-all duration-300 ${
        open ? "w-35" : "w-15"
      }`}
    >
      <div className="flex items-center justify-between p-2 border-b">
        {open && (
          // <h1 className="text-xl font-bold">
            <img
              src={Logo}
              alt="Logo"
              className="h-10 w-10 rounded-full"
            />
          // </h1>
        )}
        <Menu className="cursor-pointer" onClick={() => setOpen(!open)} />
      </div>

      <nav className="mt-2 space-y-2">
        <NavLink
          to="/productlist"
          className={({ isActive }) =>
            `block rounded-lg ${isActive ? "bg-gray-100" : "hover:bg-gray-100"}`
          }
        >
          <SidebarItem icon={ShoppingCart} label="Product List" open={open} />
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            `block rounded-lg ${isActive ? "bg-gray-100" : "hover:bg-gray-100"}`
          }
          to="/payment"
        >
          <SidebarItem
            icon={CircleDollarSign}
            label="Payment"
            open={open}
            badgeCount={cartCount}
          />
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            `block rounded-lg ${isActive ? "bg-gray-100" : "hover:bg-gray-100"}`
          }
          to="/purchase"
        >
          <SidebarItem
            icon={CircleDollarSign}
            label="Purchase"
            open={open}
            badgeCount={cartCount}
          />
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            `block rounded-lg ${isActive ? "bg-gray-100" : "hover:bg-gray-100"}`
          }
          to="/product"
        >
          <SidebarItem icon={Box} label="Product" open={open} />
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `block rounded-lg ${isActive ? "bg-gray-100" : "hover:bg-gray-100"}`
          }
          to="/item"
        >
          <SidebarItem icon={PaintbrushVertical} label="Item" open={open} />
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `block rounded-lg ${isActive ? "bg-gray-100" : "hover:bg-gray-100"}`
          }
          to="/unit"
        >
          <SidebarItem icon={Boxes} label="Unit" open={open} />
        </NavLink>
        
        <NavLink
          className={({ isActive }) =>
            `block rounded-lg ${isActive ? "bg-gray-100" : "hover:bg-gray-100"}`
          }
          to="/income"
        >
          <SidebarItem icon={BanknoteArrowUp} label="Income" open={open} />
        </NavLink>
      </nav>
    </aside>
  );
}
