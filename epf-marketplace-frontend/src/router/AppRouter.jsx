import { Route, Routes } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import ProtectedRoute from "./ProtectedRoute";
import RoleGuard from "./RoleGuard";

// Public
import HomePage from "../pages/public/HomePage";
import ProductsPage from "../pages/public/ProductsPage";
import ProductDetailsPage from "../pages/public/ProductDetailsPage";
import SearchResultsPage from "../pages/public/SearchResultsPage";
import SellerPublicPage from "../pages/public/SellerPublicPage";

// Auth
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ProfilePage from "../pages/auth/ProfilePage";

// Buyer
import CartPage from "../pages/buyer/CartPage";
import OrdersPage from "../pages/buyer/OrdersPage";
import OrderDetailPage from "../pages/buyer/OrderDetailPage";
import FavoritesPage from "../pages/buyer/FavoritesPage";
import CheckoutPage from "../pages/buyer/CheckoutPage";

// Seller
import SellerDashboardPage from "../pages/seller/SellerDashboardPage";
import MyProductsPage from "../pages/seller/MyProductsPage";
import SellerOrdersPage from "../pages/seller/SellerOrdersPage";
import SellerStatisticsPage from "../pages/seller/SellerStatisticsPage";
import ProductEditorPage from "../pages/seller/ProductEditorPage";

// Messaging
import MessagingPage from "../pages/messages/MessagingPage";

// Admin
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import ProductsAdminPage from "../pages/admin/ProductsAdminPage";
import UsersPage from "../pages/admin/UsersPage";

// System
import ForbiddenPage from "../pages/system/ForbiddenPage";
import NotFoundPage from "../pages/system/NotFoundPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/sellers/:id" element={<SellerPublicPage />} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forbidden" element={<ForbiddenPage />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />

          {/* Messagerie : utilisateur connecté */}
          <Route path="/messages" element={<MessagingPage />} />
          <Route path="/messages/:userId" element={<MessagingPage />} />

          {/* Buyer */}
          <Route element={<RoleGuard allowedRoles={["buyer"]} />}>
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
          </Route>

          {/* Seller */}
          <Route element={<RoleGuard allowedRoles={["seller"]} />}>
            <Route path="/seller" element={<SellerDashboardPage />} />
            <Route path="/seller/products" element={<MyProductsPage />} />
            <Route path="/seller/products/new" element={<ProductEditorPage />} />
            <Route
              path="/seller/products/:productId/edit"
              element={<ProductEditorPage />}
            />
            <Route path="/seller/orders" element={<SellerOrdersPage />} />
            <Route path="/seller/statistics" element={<SellerStatisticsPage />} />
          </Route>

          {/* Admin */}
          <Route element={<RoleGuard allowedRoles={["admin"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/products" element={<ProductsAdminPage />} />
              <Route path="/admin/orders" element={<OrdersPage />} />
              <Route path="/admin/users" element={<UsersPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
