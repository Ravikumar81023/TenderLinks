import type React from "react";
import { useState, type FormEvent, useEffect } from "react";
import { Lock, User, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAdminAuthStore from "@/store/adminAuthStore";

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginErrors {
  username?: string;
  password?: string;
}

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const {
    login,
    isLoading,
    error: authError,
    isAuthenticated,
  } = useAdminAuthStore();

  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<LoginErrors>({});

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    try {
      const { username, password } = credentials;
      await login(username, password);
    } catch (error) {
      if (authError) {
        toast.error(authError);
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (authError) {
      toast.error(authError);
    }
  }, [authError]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-200 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <img
              src="/TenderLinkLogo.png"
              alt="TenderLink Logo"
              className="w-32 h-32 object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-blue-800">
            Admin Login
          </CardTitle>
        </CardHeader>{" "}
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-blue-600">
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  value={credentials.username}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                  disabled={isLoading}
                />
              </div>
              {errors.username && (
                <div className="flex items-center text-red-500 text-sm mt-1">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  {errors.username}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-blue-600">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 pr-12 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-600"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center text-red-500 text-sm mt-1">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  {errors.password}
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
