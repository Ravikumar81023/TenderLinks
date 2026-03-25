import { useBlogStore } from "@/store/blog";
import { useEffect } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User } from "lucide-react";
import { Link } from "react-router-dom";

export interface Blog {
  id: number;
  title: string;
  description?: string;
  excerpt?: string;
  author?: string;
  date?: string;
  category?: string;
  imageUrl?: string;
  image?: string;
  readTime?: string;
  views?: string;
  status?: string;
  uploadDate?: string;
  video?: string | null;
}
const BASE_URL = import.meta.env.VITE_BASE_URL;
const Blog = () => {
  const { blogs, isLoading, fetchBlogs } = useBlogStore();

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const transformedBlogs: Blog[] =
    Array.isArray(blogs) && blogs
      ?.filter((blog) => blog.status !== "Draft")
      .map((blog) => ({
        id: blog.id,
        title: blog.title || "Untitled",
        excerpt: blog.description || "No description available",
        author: "Admin",
        date: new Date(blog.uploadDate || Date.now()).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "short",
            day: "numeric",
          },
        ),
        category: "General",
        imageUrl: `${BASE_URL}${blog.image || "/placeholder.svg"}`,
        readTime: "5 min",
        views: "0",
        video: blog.video,
      })) || [];

  const staticBlogPosts: Blog[] = [
    {
      id: 1,
      title: "Sample Blog Post",
      excerpt: "This is a sample blog post.",
      author: "Admin",
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      category: "General",
      imageUrl: "/api/placeholder/800/600",
      readTime: "5 min",
      views: "0",
    },
  ];

  const displayBlogs =
    transformedBlogs.length > 0 ? transformedBlogs : staticBlogPosts;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-[#1a237e]/5 to-[#00838f]/5">
      <PageHeader
        title="Our Blog"
        subtitle="Discover our latest articles and insights"
        accentText="Blog"
      />

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayBlogs.map((post: Blog) => (
            <Card
              key={post.id}
              className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                {post.imageUrl && !post.imageUrl.includes("placeholder") ? (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                ) : post.video ? (
                  <video
                    src={`${BASE_URL}${post.video}`}
                    className="w-full h-full object-cover"
                    muted
                    autoPlay
                    loop
                  />
                ) : (
                  <img
                    src="/placeholder.svg"
                    alt="placeholder"
                    className="w-full h-full object-cover"
                  />
                )}

                <div className="absolute top-0 right-0 bg-gradient-to-r from-[#1a237e] to-[#00838f] text-white px-3 py-1 text-sm font-medium">
                  {post.category}
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2 line-clamp-2 text-[#1a237e]">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1 text-[#00838f]" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-[#00838f]" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-[#00838f]" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 p-4">
                <Link to={`/blog/${post.id}`} className="w-full">
                  <Button
                    variant="outline"
                    className="w-full text-[#1a237e] hover:bg-[#1a237e]/10"
                  >
                    Read More
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
