import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

export const BlogController = {
  createPost: async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, description, status } = req.body;
      let mediaUrl: string | null = null;
      let mediaType: "video" | "image" | null = null;

      if (req.file) {
        mediaUrl = `/uploads/${req.file.filename}`;
        mediaType = req.file.mimetype.startsWith("image/") ? "image" : "video";
      }

      // Validate status
      if (status && !["Draft", "Published"].includes(status)) {
        res.status(400).json({
          error: "Invalid status. Must be either 'Draft' or 'Published'",
        });
        return;
      }

      const post = await prisma.blog.create({
        data: {
          title,
          description,
          status: status || "Draft",
          image: mediaType === "image" ? mediaUrl : null,
          video: mediaType === "video" ? mediaUrl : null,
        },
      });
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to create post" });
    }
  },

  getPosts: async (req: Request, res: Response): Promise<void> => {
    try {
      const { status } = req.query;

      // Validate status if provided
      if (status && !["Draft", "Published"].includes(status as string)) {
        res.status(400).json({
          error: "Invalid status. Must be either 'Draft' or 'Published'",
        });
        return;
      }

      const where = status ? { status: status as string } : {};

      const posts = await prisma.blog.findMany({
        where,
        orderBy: { uploadDate: "desc" },
      });
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to get posts" });
    }
  },

  getPostById: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id as string);
      const post = await prisma.blog.findUnique({
        where: { id },
      });
      if (post) {
        res.json(post);
      } else {
        res.status(404).json({ error: "Post not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to get post" });
    }
  },

  updatePost: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id as string);
      const { title, description, status } = req.body;
      let mediaUrl: string | null = null;
      let mediaType: "video" | "image" | null = null;

      // Validate status if provided
      if (status && !["Draft", "Published"].includes(status)) {
        res.status(400).json({
          error: "Invalid status. Must be either 'Draft' or 'Published'",
        });
        return;
      }

      if (req.file) {
        mediaUrl = `/uploads/${req.file.filename}`;
        mediaType = req.file.mimetype.startsWith("image/") ? "image" : "video";
      }

      const existingPost = await prisma.blog.findUnique({ where: { id } });
      if (!existingPost) {
        res.status(404).json({ error: "Post not found" });
        return;
      }

      // Delete old media files if they exist
      if (existingPost.image) {
        await fs.unlink(path.join(__dirname, "..", "..", existingPost.image));
      }
      if (existingPost.video) {
        await fs.unlink(path.join(__dirname, "..", "..", existingPost.video));
      }

      const post = await prisma.blog.update({
        where: { id },
        data: {
          title,
          description,
          status: status || existingPost.status,
          image: mediaType === "image" ? mediaUrl : null,
          video: mediaType === "video" ? mediaUrl : null,
        },
      });
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to update post" });
    }
  },

  deletePost: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id as string);
      const post = await prisma.blog.findUnique({ where: { id } });
      if (post) {
        if (post.image) {
          await fs.unlink(path.join(__dirname, "..", "..", post.image));
        }
        if (post.video) {
          await fs.unlink(path.join(__dirname, "..", "..", post.video));
        }
        await prisma.blog.delete({ where: { id } });
        res.status(204).send();
      } else {
        res.status(404).json({ error: "Post not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to delete post" });
    }
  },

  updateStatus: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id as string);
      const { status } = req.body;

      if (!status || !["Published", "Draft"].includes(status)) {
        res.status(400).json({
          error: "Invalid status. Must be either 'Draft' or 'Published'",
        });
        return;
      }

      const post = await prisma.blog.update({
        where: { id },
        data: { status },
      });
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to update post status" });
    }
  },
};

