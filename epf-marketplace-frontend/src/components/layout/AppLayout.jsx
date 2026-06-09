import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function AppLayout() {
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", color: "#0f172a", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main style={{ flex: 1, maxWidth: 1200, margin: "0 auto", padding: "24px 16px 40px", width: "100%" }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
