//@ts-nocheck
import { useEffect, useState } from "react";
import { useAboutStore } from "@/store/about";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Save, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";

export default function AboutManagement() {
  const {
    aboutInfo,
    loading,
    fetchAboutInfo,
    createAboutInfo,
    updateAboutInfo,
    updateTenderStats,
  } = useAboutStore();

  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchAboutInfo();
  }, [fetchAboutInfo]);

  useEffect(() => {
    if (aboutInfo) {
      setContent(aboutInfo.content);
    }
  }, [aboutInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (aboutInfo) {
      await updateAboutInfo(content);
    } else {
      await createAboutInfo(content);
    }
    setIsEditing(false);
  };

  const handleRefreshStats = async () => {
    try {
      await updateTenderStats();
      await fetchAboutInfo();
      toast.success("Tender statistics updated successfully");
    } catch (error) {
      toast.error("Failed to update tender statistics");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold text-blue-900">
            About Management
          </CardTitle>
          <div className="flex space-x-2">
            <Button
              variant={isEditing ? "outline" : "default"}
              onClick={() => setIsEditing(!isEditing)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isEditing ? "Cancel" : "Edit Content"}
            </Button>
            <Button
              onClick={handleRefreshStats}
              variant="outline"
              className="text-blue-600 hover:text-blue-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Update Stats
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content">About Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={!isEditing}
                className="min-h-[200px]"
                placeholder="Enter about content..."
              />
            </div>
            {isEditing && (
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                Save Content
              </Button>
            )}
          </form>

          {/* Tender Statistics Display */}
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold text-blue-900">
              Tender Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600">Total Tender Value</p>
                <p className="text-xl font-bold">
                  {aboutInfo?.totalTenderValue}
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600">Total Tender Count</p>
                <p className="text-xl font-bold">
                  {aboutInfo?.totalTenderCount}
                </p>
              </div>
            </div>
          </div>

          {/* Social Media Links Display */}
          {aboutInfo?.socialMediaLinks &&
            aboutInfo.socialMediaLinks.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3 text-blue-900">
                  Social Media Links
                </h3>
                <div className="space-y-2">
                  {aboutInfo.socialMediaLinks.map((link) => (
                    <div
                      key={link.id}
                      className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                    >
                      <span className="font-medium text-blue-900">
                        {link.platform}
                      </span>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 underline"
                      >
                        {link.url}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
