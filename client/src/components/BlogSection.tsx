import type React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBlogStore } from "@/store/blog";
import LoadingSpinner from "@/components/LoadingSpinner";

const BASE_URL = import.meta.env.VITE_BASE_URL;;

const BlogSection: React.FC = () => {
  const { blogs, isLoading, fetchBlogs } = useBlogStore();

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const transformedBlogs = Array.isArray(blogs)
    ? blogs
      .filter((blog) => blog?.status !== "Draft")
      .map((blog) => ({
        id: blog?.id,
        title: blog?.title || "Untitled",
        excerpt: blog?.description || "No description available",
        author: "Admin",
        date: new Date(blog?.uploadDate ?? Date.now()).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "short",
            day: "numeric",
          }
        ),
        category: "General",
        imageUrl: `${BASE_URL || ""}${blog?.image || "/placeholder.svg"}`,
        readTime: "5 min",
        views: "0",
      }))
    : [];
  return (
    <section className="bg-gradient-to-r from-[#1a237e]/5 to-[#00838f]/5 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8">
          <span className="text-[#1a237e]">Our</span>{" "}
          <span className="text-[#00838f]">Blog</span>
        </h2>
        <p className="text-xl text-[#00838f] text-center mb-12">
          Discover our latest articles and insights
        </p>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {transformedBlogs.slice(0, 3).map((post) => (
              <Card
                key={post.id}
                className="flex flex-col hover:shadow-lg transition-shadow bg-white rounded-xl overflow-hidden"
              >
                <CardHeader className="p-0">
                  <img
                    src={post.imageUrl || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                </CardHeader>
                <CardContent className="flex-grow p-6">
                  <h3 className="text-xl font-semibold mb-2 line-clamp-2 text-[#1a237e]">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <span>{post.author}</span>
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Link to={`/blog/${post.id}`} className="w-full">
                    <Button
                      variant="outline"
                      className="w-full text-[#00838f] hover:bg-[#00838f]/10"
                    >
                      Read More
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        <div className="text-center mt-8">
          <Link to="/blog">
            <Button
              variant="outline"
              className="bg-white text-[#1a237e] border-[#1a237e] hover:bg-[#1a237e]/10"
            >
              View All Posts
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
