import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useCustomerAuthStore from "../store/authStore";
import useUserStore from "../store/userStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "react-toastify";
import { User, Lock, Eye, EyeOff } from "lucide-react";

const CustomerLogin: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { login, isAuthenticated, loading, error, user } =
    useCustomerAuthStore();
  const { fetchUserDetails, userDetails } = useUserStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserDetails(user.id);
    }
  }, [isAuthenticated, user, fetchUserDetails]);

  useEffect(() => {
    if (userDetails) {
      navigate("/");
    }
  }, [userDetails, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please enter both username and password");
      return;
    }
    try {
      await login(username, password);
    } catch (err) {
      // Error will be handled by the store and displayed via the error useEffect
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#1a237e] to-[#00838f]">
      <Card className="w-full max-w-md p-6 bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl">
        <div className="flex justify-center">
          <img
            src="/TenderLinkLogo.png"
            alt="TenderLink Logo"
            className="h-20"
          />
        </div>
        <CardHeader>
          <h2 className="text-2xl font-semibold text-center text-[#1a237e]">
            Welcome Back
          </h2>
          <p className="text-sm text-center text-gray-600">
            Please sign in to continue
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <User className="text-[#00838f]" size={20} />
                <label
                  htmlFor="username"
                  className="text-sm font-medium text-gray-700"
                >
                  Username
                </label>
              </div>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00838f] focus:border-transparent"
                disabled={loading}
                autoComplete="username"
                placeholder="Enter your username"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Lock className="text-[#00838f]" size={20} />
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00838f] focus:border-transparent pr-10"
                  disabled={loading}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showPassword ? (
                    <EyeOff
                      className="text-gray-400 hover:text-gray-600"
                      size={20}
                    />
                  ) : (
                    <Eye
                      className="text-gray-400 hover:text-gray-600"
                      size={20}
                    />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#1a237e] to-[#00838f] hover:opacity-90 text-white py-2 rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerLogin;
