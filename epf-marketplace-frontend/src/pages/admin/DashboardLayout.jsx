import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div style={{ minHeight: "80vh", padding: "24px 16px" }}>
      <Outlet />
    </div>
  );
}
