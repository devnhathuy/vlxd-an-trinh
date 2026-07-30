import {
  Route,
  Routes,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFoundPage from "./pages/NotFoundPage";

import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import ProtectedRoute from "./components/admin/ProtectedRoute";

import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminQuotesPage from "./pages/admin/AdminQuotesPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductsPage from "./pages/ProductsPage";
export default function App() {
  return (
<Routes>
  <Route element={<MainLayout />}>
    <Route index element={<HomePage />} />

    <Route path="/san-pham" element={<ProductsPage />} />

    <Route
      path="/san-pham/:slug"
      element={<ProductDetailPage />}
    />

    <Route
      path="/bang-gia"
      element={<PlaceholderPage title="Bảng giá" />}
    />

    <Route
      path="/du-an"
      element={<PlaceholderPage title="Dự án" />}
    />

    <Route
      path="/tin-tuc"
      element={<PlaceholderPage title="Tin tức" />}
    />

    <Route
      path="/gioi-thieu"
      element={<PlaceholderPage title="Giới thiệu" />}
    />

    <Route
      path="/lien-he"
      element={<PlaceholderPage title="Liên hệ" />}
    />
  </Route>

  <Route
    path="/admin/login"
    element={<AdminLoginPage />}
  />

  <Route
    path="/admin"
    element={
      <ProtectedRoute>
        <AdminDashboardPage />
      </ProtectedRoute>
    }
  />

  <Route
    path="/admin/products"
    element={
      <ProtectedRoute>
        <AdminProductsPage />
      </ProtectedRoute>
    }
  />
<Route
  path="/admin/quotes"
  element={
    <ProtectedRoute>
      <AdminQuotesPage />
    </ProtectedRoute>
  }
/>
  <Route path="*" element={<NotFoundPage />} />
</Routes>
  );
}