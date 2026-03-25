//@ts-nocheck
import type React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  User,
  ChevronDown,
  LogOut,
  FileText,
  Grid,
} from "lucide-react";
import useAuthStore from "../store/authStore";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Home", to: "/" },
  { name: "About", to: "/about" },
  { name: "Our Services", to: "/services" },
  { name: "Tender", to: "/tenders" },
  { name: "Blog", to: "/blog" },
  { name: "Contact Us", to: "/contact" },
];

const Header: React.FC = () => {
  const { logout, user, isAuthenticated } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isTenderMenuOpen, setIsTenderMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    // Close dropdowns when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".profile-menu") && !target.closest(".tender-menu")) {
        setIsProfileOpen(false);
        setIsTenderMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-gradient-to-r from-[#1a237e] to-[#00838f] text-white shadow-lg"
          : "bg-white text-gray-800"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link
            to="/"
            className="flex items-center space-x-2 md:space-x-4 group"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="relative"
            >
              <div
                className={`absolute inset-0 ${isScrolled ? "bg-white" : "bg-blue-600"} rounded-full opacity-20 blur-md transform scale-110`}
              ></div>
              <img
                src="/TenderLinkLogo.png"
                alt="TenderLink Logo"
                className={`h-12 md:h-14 rounded-md w-auto relative z-10 ${isScrolled ? "drop-shadow-lg" : ""}`}
              />
            </motion.div>
            <div className="relative">
              <h1
                className={`text-[16px] sm:text-xl md:text-2xl lg:text-3xl font-black tracking-tight ${isScrolled ? "text-white" : "text-gray-800"}`}
              >
                <span className="hidden sm:inline">TenderLink</span>
                <span className="sm:hidden">TL</span>
                <span
                  className={`absolute -bottom-1 left-0 h-1 ${isScrolled ? "bg-white" : "bg-blue-600"} w-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full`}
                ></span>
              </h1>
              <span
                className={`hidden md:block text-xs ${isScrolled ? "text-blue-100" : "text-blue-600"}`}
              >
                Connect. Bid. Succeed.
              </span>
            </div>
          </Link>

          <nav className="hidden xl:flex items-center space-x-8">
            {navigation.map((item) =>
              item.name === "Tender" ? (
                <div key={item.name} className="relative tender-menu">
                  <button
                    onClick={() => setIsTenderMenuOpen(!isTenderMenuOpen)}
                    className={`${
                      isScrolled ? "text-white" : "text-gray-700"
                    } hover:text-blue-500 py-2 text-sm font-medium transition-colors relative group flex items-center`}
                  >
                    {item.name}
                    <ChevronDown size={16} className="ml-1" />
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                  </button>

                  <AnimatePresence>
                    {isTenderMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-50"
                      >
                        <Link
                          to="/tenders"
                          className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                          onClick={() => setIsTenderMenuOpen(false)}
                        >
                          <Grid size={16} className="mr-2" />
                          <span>All Tenders</span>
                        </Link>
                        <Link
                          to="/my-tenders"
                          className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                          onClick={() => setIsTenderMenuOpen(false)}
                        >
                          <FileText size={16} className="mr-2" />
                          <span>My Tenders</span>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={item.name}
                  to={item.to}
                  className={`${
                    isScrolled ? "text-white" : "text-gray-700"
                  } hover:text-blue-500 py-2 text-sm font-medium transition-colors relative group`}
                >
                  {item.name}
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </Link>
              ),
            )}
          </nav>

          {/* Profile dropdown for desktop */}
          {isAuthenticated && user ? (
            <div className="hidden xl:block relative profile-menu">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center space-x-2 py-2 px-4 rounded-full ${
                  isScrolled
                    ? "text-white hover:bg-white/10"
                    : "text-gray-800 hover:bg-gray-100"
                } transition duration-300`}
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  <User size={18} />
                </div>
                <span className="text-sm font-medium">{user.companyName}</span>
                <ChevronDown size={16} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-gray-100">
                      <p className="text-gray-900 font-medium">
                        {user.username}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Annual Turnover: ₹{user.annualTurnover.toLocaleString()}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Sector ID: {user.sectorId}
                      </p>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                      >
                        <LogOut size={16} className="mr-2" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden xl:block">
              <Button
                className={`${
                  isScrolled
                    ? "bg-white text-[#1a237e] hover:bg-white/90"
                    : "bg-gradient-to-r from-[#1a237e] to-[#00838f] text-white hover:opacity-90"
                } px-6 py-2.5 rounded-full text-sm font-medium transition duration-300 transform hover:scale-105`}
              >
                Login
              </Button>
            </div>
          )}

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`xl:hidden p-2 rounded-full ${isScrolled ? "text-white" : "text-gray-700"}`}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="xl:hidden bg-white rounded-2xl shadow-xl mt-2 overflow-hidden"
            >
              {navigation.map((item) =>
                item.name === "Tender" ? (
                  <div key={item.name}>
                    <button
                      onClick={() => setIsTenderMenuOpen(!isTenderMenuOpen)}
                      className="flex items-center justify-between w-full px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <span>{item.name}</span>
                      <ChevronDown
                        size={16}
                        className={`transform transition-transform ${isTenderMenuOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    <AnimatePresence>
                      {isTenderMenuOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-blue-50"
                        >
                          <Link
                            to="/tenders"
                            className="flex items-center px-10 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                            onClick={() => {
                              setIsTenderMenuOpen(false);
                              setIsMenuOpen(false);
                            }}
                          >
                            <Grid size={16} className="mr-2" />
                            <span>All Tenders</span>
                          </Link>
                          <Link
                            to="/my-tenders"
                            className="flex items-center px-10 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                            onClick={() => {
                              setIsTenderMenuOpen(false);
                              setIsMenuOpen(false);
                            }}
                          >
                            <FileText size={16} className="mr-2" />
                            <span>My Tenders</span>
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    to={item.to}
                    className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ),
              )}

              {isAuthenticated && user ? (
                <>
                  <div className="px-6 py-3 border-t border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="text-gray-900 font-medium">
                          {user.username}
                        </p>
                        <p className="text-gray-500 text-xs">
                          Annual Turnover: ₹
                          {user.annualTurnover.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center px-6 py-3 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block px-6 py-3 text-blue-600 font-medium hover:bg-blue-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
