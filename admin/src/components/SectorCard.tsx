import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import {
  Building2,
  GraduationCap,
  Stethoscope,
  Pencil,
  Trash2,
  Save,
  X,
} from "lucide-react";
import { useSectorStore } from "@/store/sector";

interface Sector {
  id: number;
  name: string;
}

interface Props {
  sectors: Sector[];
}

const SectorCard: React.FC<Props> = ({ sectors }) => {
  const { updateSector, deleteSector } = useSectorStore();
  const [editingSector, setEditingSector] = useState<Sector | null>(null);
  const [newName, setNewName] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sectorToDelete, setSectorToDelete] = useState<Sector | null>(null);

  const getIcon = (sectorName: string) => {
    switch (sectorName.toLowerCase()) {
      case "healthcare":
        return <Stethoscope className="h-6 w-6 text-blue-500" />;
      case "education":
        return <GraduationCap className="h-6 w-6 text-blue-500" />;
      case "information technology":
        return <Building2 className="h-6 w-6 text-blue-500" />;
      default:
        return <Building2 className="h-6 w-6 text-blue-500" />;
    }
  };

  const handleEdit = (sector: Sector) => {
    setEditingSector(sector);
    setNewName(sector.name);
  };

  const handleUpdate = async () => {
    if (editingSector && newName.trim()) {
      await updateSector(editingSector.id, newName.trim());
      setEditingSector(null);
      setNewName("");
    }
  };

  const handleDelete = (sector: Sector) => {
    setSectorToDelete(sector);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (sectorToDelete) {
      await deleteSector(sectorToDelete.id);
      setIsDeleteDialogOpen(false);
      setSectorToDelete(null);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sectors.map((sector) => (
          <Card
            key={sector.id}
            className="group hover:shadow-lg transition-all duration-300"
          >
            <CardContent className="p-6">
              {editingSector?.id === sector.id ? (
                <div className="space-y-4">
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Enter new name"
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleUpdate}
                      className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      onClick={() => setEditingSector(null)}
                      variant="outline"
                      className="border-blue-500 text-blue-600 hover:bg-blue-50 flex-1"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors duration-300">
                      {getIcon(sector.name)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-blue-700">
                        {sector.name}
                      </h3>
                      <p className="text-sm text-blue-500">
                        Sector ID: {sector.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(sector)}
                      className="hover:bg-blue-100 text-blue-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(sector)}
                      className="hover:bg-red-100 text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl text-red-600">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              sector "{sectorToDelete?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-blue-500 text-blue-600 hover:bg-blue-50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SectorCard;
