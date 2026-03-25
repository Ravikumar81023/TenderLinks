import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import BlogManagement from "./BlogManagement";
import HomePageManagement from "./HomePageManagement";
import UserManagement from "./UserManagement";
import Dashboard from "./Dashboard";
import AdminSidebar from "@/components/AdminSidebar";
import { CAManagement } from "./CAManagement";
import ServiceManagement from "./ServiceManagement";
import AddressManager from "./Offliceadress";
import SocialMediaForm from "./SocialMediaForm";
import AdminManagement from "./Adminmanagement";
import AdminLogin from "./AdminLogin";
import { useLocation } from "react-router-dom";
import LocationForm from "./LocationManageMent";
import useAdminAuthStore from "@/store/adminAuthStore";
import SectorManage from "./SectorManage";
import Contact from "./Contact";
import TenderManagement from "./TenderManagement";
import AboutManagement from "./AboutManagement";
import CustomerNoteManagement from "./CustomerNoteManagement";
import CustomerTracking from "./CustomerTracking";
import ErrorBoundary from "@/components/ErrorBoundary";
import BlueLoadingSpinner from "@/components/BlueLoadingSpinner";

const Home: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, admin } = useAdminAuthStore();
  const [loading, setLoading] = React.useState(true);

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return <>{children}</>;
  };

  const isSidebar = location.pathname !== "/login" && isAuthenticated;

  // Determine the default route based on admin role
  const getDefaultRoute = () => {
    if (!admin?.role) return "/dashboard";

    switch (admin.role) {
      case "PROJECT_ADMIN":
        return "/add-tender"; // First page in their navigation list
      case "CONTENT_ADMIN":
        return "/blog-management"; // First page in their navigation list
      default:
        return "/dashboard";
    }
  };

  React.useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {isSidebar && <AdminSidebar />}
      <div className="flex-1 h-full overflow-y-auto">
        <ErrorBoundary>
          {loading ? (
            <BlueLoadingSpinner />
          ) : (
            <Routes>
              <Route
                path="/login"
                element={
                  isAuthenticated ? (
                    <Navigate to={getDefaultRoute()} replace />
                  ) : (
                    <AdminLogin />
                  )
                }
              />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    {admin?.role === "PROJECT_ADMIN" ? (
                      <Navigate to="/add-tender" replace />
                    ) : admin?.role === "CONTENT_ADMIN" ? (
                      <Navigate to="/blog-management" replace />
                    ) : (
                      <Dashboard />
                    )}
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-tender"
                element={
                  <ProtectedRoute>
                    <TenderManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/blog-management"
                element={
                  <ProtectedRoute>
                    <BlogManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/address-management"
                element={
                  <ProtectedRoute>
                    <AddressManager />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/update-home"
                element={
                  <ProtectedRoute>
                    <HomePageManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-user"
                element={
                  <ProtectedRoute>
                    <UserManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manage-cas"
                element={
                  <ProtectedRoute>
                    <CAManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/update-contact"
                element={
                  <ProtectedRoute>
                    <Contact />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/service-management"
                element={
                  <ProtectedRoute>
                    <ServiceManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/social-media-management"
                element={
                  <ProtectedRoute>
                    <SocialMediaForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin-management"
                element={
                  <ProtectedRoute>
                    <AdminManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/about-management"
                element={
                  <ProtectedRoute>
                    <AboutManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customer-notes"
                element={
                  <ProtectedRoute>
                    <CustomerNoteManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/location-management"
                element={
                  <ProtectedRoute>
                    <LocationForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sector-management"
                element={
                  <ProtectedRoute>
                    <SectorManage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/track-customers"
                element={
                  <ProtectedRoute>
                    <CustomerTracking />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customers/:customerId/analytics"
                element={
                  <ProtectedRoute>
                    <CustomerTracking />{" "}
                  </ProtectedRoute>
                }
              />

              <Route
                path="*"
                element={
                  isAuthenticated ? (
                    <Navigate to={getDefaultRoute()} replace />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
            </Routes>
          )}
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default Home;
