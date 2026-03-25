import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  FileText,
  Users,
  Settings,
  Menu,
  X,
  Building2,
  Newspaper,
  MapPin,
  UserCheck,
  PhoneCall,
  Share2,
  Briefcase,
  Building,
  UserCog,
  StickyNote,
  Info,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import useAdminAuthStore from "@/store/adminAuthStore";

const roleBasedNavItems = {
  SUPER_ADMIN: [
    { title: "Add Tender", icon: FileText, to: "/add-tender" },
    { title: "Create User", icon: Users, to: "/add-user" },
    { title: "Home Page Management", icon: Building2, to: "/update-home" },
    { title: "Sector Management", icon: Briefcase, to: "/sector-management" },
    { title: "Location Management", icon: MapPin, to: "/location-management" },
    { title: "Blog Management", icon: Newspaper, to: "/blog-management" },
    { title: "CA Management", icon: UserCheck, to: "/manage-cas" },
    { title: "Media Links", icon: Share2, to: "/social-media-management" },
    { title: "Contact Management", icon: PhoneCall, to: "/update-contact" },
    { title: "Office Address", icon: Building, to: "/address-management" },
    { title: "Track and Update", icon: UserCog, to: "/track-customers" },
    { title: "Dashboard", icon: Home, to: "/" },
    { title: "Customer Notes", icon: StickyNote, to: "/customer-notes" },
    { title: "About Management", icon: Info, to: "/about-management" },
    { title: "Database Management", icon: Wrench, to: "/service-management" },
    { title: "Admin Management", icon: Settings, to: "/admin-management" },
  ],
  ADMIN: [
    { title: "Add Tender", icon: FileText, to: "/add-tender" },
    { title: "Create User", icon: Users, to: "/add-user" },
    { title: "Home Page Management", icon: Building2, to: "/update-home" },
    { title: "Sector Management", icon: Briefcase, to: "/sector-management" },
    { title: "Location Management", icon: MapPin, to: "/location-management" },
    { title: "Blog Management", icon: Newspaper, to: "/blog-management" },
    { title: "CA Management", icon: UserCheck, to: "/manage-cas" },
    { title: "Media Links", icon: Share2, to: "/social-media-management" },
    { title: "Contact Management", icon: PhoneCall, to: "/update-contact" },
    { title: "Office Address", icon: Building, to: "/address-management" },
    { title: "Track and Update", icon: UserCog, to: "/track-customers" },
    { title: "Dashboard", icon: Home, to: "/" },
    { title: "Customer Notes", icon: StickyNote, to: "/customer-notes" },
    { title: "About Management", icon: Info, to: "/about-management" },
    { title: "Database Management", icon: Wrench, to: "/service-management" },
  ],
  PROJECT_ADMIN: [
    { title: "Add Tender", icon: FileText, to: "/add-tender" },
    { title: "Sector Management", icon: Briefcase, to: "/sector-management" },
    { title: "Location Management", icon: MapPin, to: "/location-management" },
  ],
  CONTENT_ADMIN: [
    { title: "Blog Management", icon: Newspaper, to: "/blog-management" },
    { title: "Database Management", icon: Wrench, to: "/service-management" },
    { title: "Home Page Management", icon: Building2, to: "/update-home" },
  ],
};

const AdminSidebar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, admin } = useAdminAuthStore();
  // console.log("Admin Data:", admin);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Get navigation items based on admin role
  const navItems = admin?.role
    ? roleBasedNavItems[admin.role as keyof typeof roleBasedNavItems]
    : [];

  return (
    <>
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 right-4 z-20 p-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      )}
      <aside
        className={cn(
          "bg-blue-800 text-white transition-all duration-300 ease-in-out",
          isMobile
            ? isOpen
              ? "w-64 fixed inset-y-0 left-0 z-10"
              : "w-0 invisible"
            : "w-64 sticky top-0 h-screen",
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-blue-700">
          <div className="flex items-center gap-2">
            <img
              src="/TenderLinkLogo.png"
              alt="TenderLink Logo"
              className="h-16 w-16 rounded-md"
            />
          </div>
          {admin && (
            <div className="flex flex-col items-center">
              <span className="text-xs bg-blue-700 px-2 py-1 rounded">
                {admin.role}
              </span>
            </div>
          )}
        </div>{" "}
        <nav className="flex-1 overflow-y-auto py-4 h-[calc(90vh-8rem)]">
          {navItems.map((item) => (
            <Link
              key={item.title}
              to={item.to}
              className={cn(
                "flex items-center px-4 py-2 my-1 text-sm font-medium rounded-lg transition-colors duration-200",
                location.pathname === item.to
                  ? "bg-blue-700 text-white"
                  : "text-blue-200 hover:bg-blue-700 hover:text-white",
              )}
              onClick={() => isMobile && setIsOpen(false)}
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-blue-700">
          <Button
            className="w-full bg-red-600 hover:bg-red-700 font-medium transition-colors duration-200"
            onClick={handleLogout}
          >
            Log out
          </Button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
