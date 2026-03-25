import { Request, Response } from "express";
import { SocialMediaService } from "../services/socialMediaService";
import {
  validateSocialMediaCreate,
  validateSocialMediaUpdate,
} from "../utils/validation";
import { upload } from "../utils/multer";
import fs from "fs";
import path from "path";

const socialmediaService = new SocialMediaService();
const BASE_URL = process.env.BASE_URL;

export class SocialMediaController {
  async createSocialMedia(req: Request, res: Response) {
    try {
      // Handle single file upload
      upload.single("logo")(req, res, async (err: any) => {
        if (err) {
          return res
            .status(400)
            .json({ error: "File upload error: " + err.message });
        }

        try {
          if (!req.file) {
            return res.status(400).json({ error: "Logo file is required" });
          }

          // Get the file path relative to uploads directory
          const logoPath = req.file.filename;

          // Combine file data with other social media data
          const socialMediaData = {
            ...req.body,
            logo: logoPath,
          };

          const data = validateSocialMediaCreate(socialMediaData);
          const socialMedia = await socialmediaService.createSocialMedia(data);
          res.status(201).json(socialMedia);
        } catch (error) {
          // Clean up uploaded file if validation or database operation fails
          if (req.file) {
            fs.unlink(req.file.path, (unlinkError) => {
              if (unlinkError) {
                console.error("Error deleting file:", unlinkError);
              }
            });
          }

          if (error instanceof Error) {
            res.status(400).json({ error: error.message });
          } else {
            res.status(500).json({ error: "Internal server error" });
          }
        }
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async updateSocialMedia(req: Request, res: Response) {
    try {
      upload.single("logo")(req, res, async (err: any) => {
        if (err) {
          return res
            .status(400)
            .json({ error: "File upload error: " + err.message });
        }

        try {
          const id = Number(req.params.id);

          // Get existing social media to check if we need to delete old logo
          const existingSocialMedia =
            await socialmediaService.getSocialMediaById(id);
          if (!existingSocialMedia) {
            if (req.file) {
              fs.unlink(req.file.path, () => {});
            }
            return res.status(404).json({ error: "Social Media not found" });
          }

          let updateData = { ...req.body };

          // If new logo is uploaded, update the logo path
          if (req.file) {
            updateData.logo = req.file.filename;

            // Delete old logo file - Fixed path resolution
            const oldLogoPath = path.join(
              process.cwd(),
              "uploads",
              existingSocialMedia.logo,
            );

            // Use fs.promises for better error handling and async/await
            try {
              await fs.promises.unlink(oldLogoPath);
              console.log("Successfully deleted old logo:", oldLogoPath);
            } catch (error: any) {
              // Only log as error if file exists but couldn't be deleted
              if (error.code !== "ENOENT") {
                console.error("Error deleting old logo:", error);
              }
            }
          }

          const data = validateSocialMediaUpdate(updateData);
          const socialMedia = await socialmediaService.updateSocialMedia(
            id,
            data,
          );
          res.json(socialMedia);
        } catch (error) {
          // Clean up uploaded file if validation or database operation fails
          if (req.file) {
            try {
              await fs.promises.unlink(req.file.path);
            } catch (unlinkError) {
              console.error("Error deleting uploaded file:", unlinkError);
            }
          }

          if (error instanceof Error) {
            res.status(400).json({ error: error.message });
          } else {
            res.status(500).json({ error: "Internal server error" });
          }
        }
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
  // Keeping getSocialMedia and getSocialMediaById methods unchanged
  async getSocialMedia(req: Request, res: Response) {
    try {
      const socialMedia = await socialmediaService.getSocialMedia();
      res.json(socialMedia);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getSocialMediaById(req: Request, res: Response) {
    try {
      const socialMedia = await socialmediaService.getSocialMediaById(
        Number(req.params.id),
      );

      if (!socialMedia) {
        res.status(404).json({ error: "Social Media not found" });
        return;
      }
      res.json(socialMedia);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async deleteSocialMedia(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      // Get social media to delete logo file
      const socialMedia = await socialmediaService.getSocialMediaById(id);
      if (!socialMedia) {
        res.status(404).json({ error: "Social Media not found" });
        return;
      }

      // Delete logo file
      const logoPath = path.join(__dirname, "../uploads", socialMedia.logo);
      fs.unlink(logoPath, (error) => {
        if (error && error.code !== "ENOENT") {
          console.error("Error deleting logo:", error);
        }
      });

      // Delete database record
      await socialmediaService.deleteSocialMedia(id);
      res.status(200).json({ message: "Social media deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
