import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function AppLayout() {
  const location = useLocation();
  const isAdminArea = location.pathname.startsWith("/admin");

  if (isAdminArea) {
    return <Outlet />;
  }

  return (
    <div className="site-shell">
      <Navbar />
      <main className="site-main">
        <div className="container">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
