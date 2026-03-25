import "./App.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Tender from "./pages/Tender";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import { Routes, Route, Navigate } from "react-router-dom";
import Footer from "./components/Footer";
import TenderDetails from "./pages/TenderDetails";
import Login from "./pages/Login";
import BlogDesc from "./components/BlogDesc";
import useAuthStore from "./store/authStore";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ServiceDesc from "./components/ServiceDesc";

import AnalyticsWrapper from "./components/AnalyticsWrapper";

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <AnalyticsWrapper>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
        {isAuthenticated && <Header />}
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
          />
          {isAuthenticated ? (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:serviceid" element={<ServiceDesc />} />
              <Route path="/tenders" element={<Tender />} />

              <Route path="/tenders/:tenderId" element={<TenderDetails />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:blogid" element={<BlogDesc />} />
              <Route path="/contact" element={<Contact />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}
        </Routes>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        {isAuthenticated && <Footer />}
      </div>
    </AnalyticsWrapper>
  );
}

export default App;
