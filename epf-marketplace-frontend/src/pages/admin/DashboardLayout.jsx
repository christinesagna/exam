import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

export default function DashboardLayout() {

  // ✅ Colle le useState ici
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">

      {/* ✅ Colle le composant Sidebar ici */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Contenu principal */}
      <div className="flex flex-col flex-1 overflow-y-auto">

        {/* Bouton burger pour mobile */}
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Pages enfants s'affichent ici */}
        <main className="flex-1 p-6 bg-gray-50">
          <Outlet />
        </main>

      </div>
    </div>
  );
}