import { NavLink } from "react-router-dom";
import SidebarItem from "./SidebarItem";
import {
  PaintbrushVertical,
  ChartColumnStackedIcon,
  Boxes,
  Box,
  ShoppingCart,
  CircleDollarSign,
  BanknoteArrowUp,
  Menu,
} from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  return (
    <aside
      className={`sticky top-0 h-screen bg-white shadow-lg transition-all duration-300 ${
        open ? "w-60" : "w-20"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {open && (
          <h1 className="text-xl font-bold">
            <img
              src="./src/assets/Si Thu Paint.jpeg"
              alt="Logo"
              className="h-8 w-8 rounded-full"
            />
          </h1>
        )}
        <Menu className="cursor-pointer" onClick={() => setOpen(!open)} />
      </div>

      <nav className="mt-4 space-y-2">
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
          <SidebarItem icon={CircleDollarSign} label="Payment" open={open} />
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
          to="/category"
        >
          <SidebarItem
            icon={ChartColumnStackedIcon}
            label="Category"
            open={open}
          />
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
          to="/product"
        >
          <SidebarItem icon={Box} label="Product" open={open} />
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
