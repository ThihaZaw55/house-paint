import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Breadcrumb from "./Breadcrumb";
import Footer from "./Footer";
export default function Layout() {
  return (
    <>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 overflow-y-auto p-5 bg-gradient from-gray-100 to-gray-200 min-h-screen">
          <Breadcrumb />
          <Outlet />
        </div>
      </div>
      <Footer />
    </>
  );
}
