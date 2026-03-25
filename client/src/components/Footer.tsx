import type React from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
} from "lucide-react";

const navigation = [
  { name: "Home", to: "/" },
  { name: "About", to: "/about" },
  { name: "Tender", to: "/tenders" },
  { name: "Blog", to: "/blog" },
  { name: "Contact Us", to: "/contact" },
];

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-[#1a237e] to-[#00838f] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <img
                src="/TenderLinkLogo.png"
                alt="TenderLink Logo"
                className="w-12 h-12 rounded-md"
              />
              <h2 className="text-2xl font-bold text-white">TenderLink</h2>
            </div>
            <p className="text-blue-100">
              India's Leading Tender Information Service Provider and
              Consultancy Firm. Empowering businesses with comprehensive tender
              solutions since 2010.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-blue-100 hover:text-white transition-colors"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-blue-100 hover:text-white transition-colors"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-blue-100 hover:text-white transition-colors"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-blue-100 hover:text-white transition-colors"
              >
                <Youtube className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.to}
                    className="text-blue-100 hover:text-white transition-colors flex items-center gap-2"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:info@tenderlink.com"
                  className="text-blue-100 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  info@tenderlink.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+919319337337"
                  className="text-blue-100 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  +91-9319337337
                </a>
              </li>
              <li className="text-blue-100 flex items-start gap-2">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                <span>
                  308, 309, 309A, 309B & 309C, 3rd Floor Krishna Plaza, Tej
                  Garhi Chauraha, Garh Road, Meerut, Uttar Pradesh 250002, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-4 border-t border-blue-400/20">
          <div className="text-center">
            <p className="text-blue-100">
              © {new Date().getFullYear()} TenderLink. All rights reserved.
            </p>
            <p className="text-blue-100 mt-2">
              Delivering Excellence in Tender Management Solutions ✨
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
