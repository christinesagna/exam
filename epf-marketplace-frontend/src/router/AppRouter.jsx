import { Routes, Route } from 'react-router-dom';

import AppLayout from '../components/layout/AppLayout';
import DashboardLayout from '../pages/admin/DashboardLayout';

import ProtectedRoute from './ProtectedRoute';
import RoleGuard from './RoleGuard';

import HomePage from '../pages/public/HomePage';
import ProductsPage from '../pages/public/ProductsPage';
import ProductDetailsPage from '../pages/public/ProductDetailsPage';
import SearchResultsPage from '../pages/public/SearchResultsPage';
import SellerPublicPage from '../pages/public/SellerPublicPage';

import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ProfilePage from '../pages/auth/ProfilePage';

import CartPage from '../pages/buyer/CartPage';
import OrdersPage from '../pages/buyer/OrdersPage';

import SellerDashboardPage from '../pages/seller/SellerDashboardPage';
import MyProductsPage from '../pages/seller/MyProductsPage';

import AdminDashboardPage from '../pages/admin/AdminDashboardPage';

import ForbiddenPage from '../pages/system/ForbiddenPage';
import NotFoundPage from '../pages/system/NotFoundPage';

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>

        {/* ================= PUBLIC ================= */}
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
          <Route path="/profile" element={<ProfilePage />} />

          {/* ================= BUYER ================= */}
          <Route element={<RoleGuard allowedRoles={['buyer']} />}>
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<OrdersPage />} />
          </Route>

          {/* ================= SELLER ================= */}
          <Route element={<RoleGuard allowedRoles={['seller']} />}>
            <Route path="/seller" element={<SellerDashboardPage />} />
            <Route path="/seller/products" element={<MyProductsPage />} />
          </Route>

          {/* ================= ADMIN ================= */}
          <Route element={<RoleGuard allowedRoles={['admin']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/orders" element={<OrdersPage />} />
            </Route>
          </Route>
        </Route>

        {/* ================= 404 ================= */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
