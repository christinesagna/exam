import { Routes, Route } from 'react-router-dom';

import AppLayout from '../components/layout/AppLayout';
import DashboardLayout from '../layouts/DashboardLayout';

import ProtectedRoute from './ProtectedRoute';
import RoleGuard from './RoleGuard';

// Pages publiques
import HomePage from '../pages/public/HomePage';
import ProductsPage from '../pages/public/ProductsPage';
import ProductDetailsPage from '../pages/public/ProductDetailsPage';

// Auth
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ProfilePage from '../pages/auth/ProfilePage';

// Buyer
import CartPage from '../pages/buyer/CartPage';
import OrdersPage from '../pages/buyer/OrdersPage';

// Seller
import SellerDashboardPage from '../pages/seller/SellerDashboardPage';
import MyProductsPage from '../pages/seller/MyProductsPage';

// Admin
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import ProductsAdminPage from '../pages/admin/ProductsAdminPage';
import UsersPage from '../pages/admin/UsersPage';

// System
import ForbiddenPage from '../pages/system/ForbiddenPage';
import NotFoundPage from '../pages/system/NotFoundPage';

function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>

        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
import { Route, Routes } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";
import ProtectedRoute from "./ProtectedRoute";
import RoleGuard from "./RoleGuard";

import HomePage from "../pages/public/HomePage";
import ProductsPage from "../pages/public/ProductsPage";
import ProductDetailsPage from "../pages/public/ProductDetailsPage";
import SearchResultsPage from "../pages/public/SearchResultsPage";
import SellerPublicPage from "../pages/public/SellerPublicPage";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ProfilePage from "../pages/auth/ProfilePage";

import ForbiddenPage from "../pages/system/ForbiddenPage";
import NotFoundPage from "../pages/system/NotFoundPage";

import CartPage from "../pages/buyer/CartPage";
import OrdersPage from "../pages/buyer/OrdersPage";
import SellerDashboardPage from "../pages/seller/SellerDashboardPage";
import MyProductsPage from "../pages/seller/MyProductsPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/sellers/:id" element={<SellerPublicPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forbidden" element={<ForbiddenPage />} />

        {/* ================= PROTECTED ================= */}
        <Route element={<ProtectedRoute />}>

          {/* Profil utilisateur */}
          <Route path="/profile" element={<ProfilePage />} />

          {/* ================= BUYER ================= */}
          <Route element={<RoleGuard allowedRoles={['buyer']} />}>
          <Route element={<RoleGuard allowedRoles={["buyer"]} />}>
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<OrdersPage />} />
          </Route>

          {/* ================= SELLER ================= */}
          <Route element={<RoleGuard allowedRoles={['seller']} />}>
          <Route element={<RoleGuard allowedRoles={["seller"]} />}>
            <Route path="/seller" element={<SellerDashboardPage />} />
            <Route path="/seller/products" element={<MyProductsPage />} />
          </Route>

          {/* ================= ADMIN ================= */}
          <Route element={<RoleGuard allowedRoles={['admin']} />}>
            <Route element={<DashboardLayout />}>

              <Route
                path="/admin"
                element={<AdminDashboardPage />}
              />

              <Route
                path="/admin/products"
                element={<ProductsAdminPage />}
              />

              <Route
                path="/admin/orders"
                element={<OrdersPage />}
              />

              <Route
                path="/admin/users"
                element={<UsersPage />}
              />

            </Route>
          <Route element={<RoleGuard allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Route>

        </Route>

        {/* ================= 404 ================= */}
        <Route path="*" element={<NotFoundPage />} />

      </Route>
    </Routes>
  );
}

export default AppRouter;
