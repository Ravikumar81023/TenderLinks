import React, { useEffect, useState } from "react";
import { Edit, Trash2, Plus, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAdminStore } from "../store/admin";
import { UserRole, AdminCreateInput, AdminUser } from "../types/admin";
import { Loader2 } from "lucide-react";

const AdminManagement: React.FC = () => {
  const {
    admins,
    loading,
    error,
    fetchAdmins,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    currentUserRole,
    setCurrentUserRole,
  } = useAdminStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  const [formData, setFormData] = useState<AdminCreateInput>({
    email: "",
    password: "",
    role: UserRole.ADMIN,
  });

  useEffect(() => {
    fetchAdmins();
    const userRole = UserRole.SUPER_ADMIN;
    setCurrentUserRole(userRole);
  }, [fetchAdmins, setCurrentUserRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedAdmin) {
        await updateAdmin(selectedAdmin.id, formData);
        setIsEditModalOpen(false);
      } else {
        await createAdmin(formData);
        setIsAddModalOpen(false);
      }
      setFormData({ email: "", password: "", role: UserRole.ADMIN });
      setSelectedAdmin(null);
      fetchAdmins();
    } catch (error) {
      console.error("Operation failed:", error);
    }
  };

  const handleEdit = (admin: AdminUser) => {
    setSelectedAdmin(admin);
    setFormData({
      email: admin.email,
      password: "",
      role: admin.role,
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAdmin(id);
      setIsDeleteDialogOpen(false);
      fetchAdmins();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const getAvailableRoles = () => {
    if (currentUserRole === UserRole.SUPER_ADMIN) {
      return Object.values(UserRole).filter(
        (role) => role !== UserRole.SUPER_ADMIN && role !== UserRole.CUSTOMER,
      );
    }
    return Object.values(UserRole).filter(
      (role) =>
        role !== UserRole.SUPER_ADMIN &&
        role !== UserRole.ADMIN &&
        role !== UserRole.CUSTOMER,
    );
  };

  const roleColors: Record<UserRole, string> = {
    [UserRole.SUPER_ADMIN]: "bg-purple-100 text-purple-800",
    [UserRole.ADMIN]: "bg-blue-100 text-blue-800",
    [UserRole.CONTENT_ADMIN]: "bg-green-100 text-green-800",
    [UserRole.PROJECT_ADMIN]: "bg-yellow-100 text-yellow-800",
    [UserRole.CUSTOMER]: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <Card className="bg-white shadow-lg border-blue-200 border">
        <CardHeader className="bg-blue-50">
          <CardTitle className="flex justify-between items-center text-blue-800">
            Admin Management
            {currentUserRole === UserRole.SUPER_ADMIN && (
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Admin
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          )}
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <div className="space-y-4">
            {admins.map((admin) => (
              <div
                key={admin.id}
                className="flex justify-between items-center p-4 border rounded-lg bg-white hover:bg-blue-50 transition-colors duration-200"
              >
                <div className="flex items-center space-x-4">
                  <Shield className="h-10 w-10 text-blue-600" />
                  <div>
                    <h3 className="font-medium text-blue-800">{admin.email}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${roleColors[admin.role]}`}
                    >
                      {admin.role}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {currentUserRole === UserRole.SUPER_ADMIN &&
                    admin.role !== UserRole.SUPER_ADMIN && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(admin)}
                          className="text-blue-600 border-blue-600 hover:bg-blue-100"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setSelectedAdmin(admin);
                            setIsDeleteDialogOpen(true);
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={isAddModalOpen || isEditModalOpen}
        onOpenChange={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
          setFormData({ email: "", password: "", role: UserRole.ADMIN });
          setSelectedAdmin(null);
        }}
      >
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-blue-800">
              {selectedAdmin ? "Edit Admin" : "Add New Admin"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              required
              className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
            />
            <Input
              placeholder="Password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              required={!selectedAdmin}
              className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
            />
            <Select
              value={formData.role}
              onValueChange={(value: UserRole) =>
                setFormData((prev) => ({ ...prev, role: value }))
              }
            >
              <SelectTrigger className="border-blue-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableRoles().map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {selectedAdmin ? "Update Admin" : "Create Admin"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              admin account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedAdmin && handleDelete(selectedAdmin.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminManagement;
