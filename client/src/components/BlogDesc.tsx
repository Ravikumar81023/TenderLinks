import type React from "react";
import { useEffect } from "react";
import { ArrowLeft, Clock, User, Calendar } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useBlogStore } from "@/store/blog";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const BlogDescription: React.FC = () => {
  const { selectedBlog, fetchBlogById, isLoading } = useBlogStore();
  const { blogid } = useParams<{ blogid: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogById(Number(blogid));
  }, [blogid, fetchBlogById]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!selectedBlog) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#1a237e]/5 to-[#00838f]/5 flex items-center justify-center">
        <Card className="p-8 rounded-2xl shadow-lg text-center max-w-md">
          <h1 className="text-3xl font-bold text-[#1a237e] mb-4">
            Blog Post Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Button
            onClick={() => navigate("/blog")}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#1a237e] to-[#00838f] text-white rounded-md hover:opacity-90 transition-opacity duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog List
          </Button>
        </Card>
      </div>
    );
  }

  const formattedDate = new Date(
    selectedBlog.uploadDate || Date.now(),
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#1a237e]/5 to-[#00838f]/5 py-10">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Button
          onClick={() => navigate("/blog")}
          variant="ghost"
          className="group flex items-center text-[#1a237e] hover:text-[#00838f] mb-8 transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5 mr-2 group-hover:transform group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Posts
        </Button>

        <Card className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {selectedBlog.image && (
            <div className="relative h-[400px] w-full">
              <img
                src={`${BASE_URL}${selectedBlog.image}`}
                alt={selectedBlog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <CardContent className="p-8">
            <div className="mb-6">
              <span
                className={`px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide ${
                  selectedBlog.status === "Published"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {selectedBlog.status || "Draft"}
              </span>
            </div>

            <h1 className="text-4xl font-bold text-[#1a237e] mb-6 leading-tight">
              {selectedBlog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 mb-8 text-gray-600 border-b border-gray-200 pb-6">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2 text-[#00838f]" />
                <span className="font-medium">Admin</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-[#00838f]" />
                <span>5 min read</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-[#00838f]" />
                <span>{formattedDate}</span>
              </div>
            </div>

            <div className="prose max-w-none">
              <div className="text-gray-700 text-xl mb-8 leading-relaxed">
                {selectedBlog.description || "No description available"}
              </div>

              {selectedBlog.video && (
                <div className="my-8">
                  <video
                    controls
                    className="w-full rounded-xl"
                    src={`${BASE_URL}${selectedBlog.video}`}
                  />{" "}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BlogDescription;
