import { Outlet } from "react-router-dom";
import NavBar from "../pages/NavBar/";
import Footer from "../pages/Footer/";

export default function Layout() {
  return (
    <div>
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  );
}
