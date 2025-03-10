import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "antd";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

// Pages
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/products/ProductsPage";
import SubcategoriesPage from "./pages/SubcategoriesPage";
import BrandPage from "./pages/BrandPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import AccountPage from "./pages/AccountPage";
import AdminLoginPage from "./pages/admin/login/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/dashboard/AdminDashboardPage";
import AdminBusinessesPage from "./pages/admin/businesses/AdminBusinessesPage";
import AdminProductsPage from "./pages/admin/products/AdminProductsPage";
import AdminCategoriesPage from "./pages/admin/categories/AdminCategoriesPage";
import AdminBrandsPage from "./pages/admin/brands/AdminBrandsPage";
import AdminInvoicesPage from "./pages/admin/invoices/AdminInvoicesPage";

// Auth Guards
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";

import "./styles/custom-styles.css";

const { Content } = Layout;

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Toaster position="top-center" />
          <Content>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route
                  path="category/:categoryId"
                  element={<SubcategoriesPage />}
                />
                <Route path="brand/:brandId" element={<BrandPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />

                {/* Protected Customer Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="cart" element={<CartPage />} />
                  <Route path="account" element={<AccountPage />} />
                </Route>
              </Route>

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route element={<AdminRoute />}>
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="agents" element={<AdminBusinessesPage />} />
                  <Route path="customers" element={<AdminBusinessesPage />} />
                  <Route path="products" element={<AdminProductsPage />} />
                  <Route path="categories" element={<AdminCategoriesPage />} />
                  <Route path="brands" element={<AdminBrandsPage />} />
                  <Route path="invoices" element={<AdminInvoicesPage />} />
                  <Route path="account" element={<AccountPage />} />
                </Route>
              </Route>
            </Routes>
          </Content>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
