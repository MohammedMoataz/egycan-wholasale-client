import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "antd";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

// Pages
import HomePage from "./pages/home/HomePage";
import ProductsPage from "./pages/products/ProductsPage";
import CartPage from "./pages/cart/CartPage";
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
import SubcategoriesPage from "./pages/subcategories/SubcategoriesPage";
import BrandPage from "./pages/brands/BrandPage";
import LoginPage from "./pages/account/LoginPage";
import RegisterPage from "./pages/account/RegisterPage";
import AccountPage from "./pages/account/AccountPage";
import CreateNewPasswordPage from "./pages/account/CreateNewPasswordPage";
import AdminAgentsPage from "./pages/admin/agents/AdminAgentsPage";

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
                <Route
                  path="verify-email/:code"
                  element={<CreateNewPasswordPage />}
                />

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
                  <Route path="agents" element={<AdminAgentsPage />} />
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
