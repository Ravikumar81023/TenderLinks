import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSocialMediaStore } from "@/store/SocialMedia";
import SocialMediaCard from "@/components/SocialMediaCard";
import { Plus, Loader2 } from "lucide-react";

export interface SocialMediaPlatform {
  platformName: string;
  link: string;
  logo: File | null;
}

const SocialMediaForm = () => {
  const { createSocialMedia, fetchSocialMedia, socialMedia } =
    useSocialMediaStore();

  useEffect(() => {
    fetchSocialMedia();
  }, []);

  const [formData, setFormData] = useState<SocialMediaPlatform>({
    platformName: "",
    link: "",
    logo: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFormData({ ...formData, logo: file });
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!formData.platformName || !formData.link || !formData.logo) {
        throw new Error("Please fill in all required fields");
      }

      const submitData = new FormData();
      submitData.append("platformName", formData.platformName);
      submitData.append("link", formData.link);
      if (formData.logo) {
        submitData.append("logo", formData.logo);
      }

      await createSocialMedia(submitData);

      setFormData({
        platformName: "",
        link: "",
        logo: null,
      });
      setPreviewUrl("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create social media platform",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center flex-col gap-10">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-700">
            Social Media Platform Details
          </CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {error && (
              <Alert className="bg-red-50 text-red-700 border-red-200">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="platformName" className="text-blue-600">
                Platform Name
              </Label>
              <Input
                id="platformName"
                value={formData.platformName}
                onChange={(e) =>
                  setFormData({ ...formData, platformName: e.target.value })
                }
                placeholder="Enter platform name"
                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="link" className="text-blue-600">
                Platform Link
              </Label>
              <Input
                id="link"
                type="url"
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
                placeholder="https://www.example.com/"
                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo" className="text-blue-600">
                Platform Logo
              </Label>
              <Input
                id="logo"
                type="file"
                onChange={handleLogoChange}
                accept="image/*"
                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                required
              />
              {previewUrl && (
                <div className="mt-2">
                  <img
                    src={previewUrl}
                    alt="Logo preview"
                    className="w-16 h-16 object-contain border rounded"
                  />
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={
                isSubmitting ||
                !formData.platformName ||
                !formData.link ||
                !formData.logo
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Save Platform Details
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <SocialMediaCard socialMedia={socialMedia} />
    </div>
  );
};

export default SocialMediaForm;
