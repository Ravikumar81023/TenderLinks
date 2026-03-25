import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";

export function QuickActions() {
  return (
    <Card className="border-blue-100">
      <CardHeader>
        <CardTitle className="text-blue-900">Quick Actions</CardTitle>
        <CardDescription className="text-blue-600">
          Shortcuts to commonly used functions
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-blue-600"
            >
              <path d="M15 5v14M9 5v14M4 5h16M4 19h16" />
            </svg>
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none text-blue-900">
                Add New Project
              </p>
              <p className="text-sm text-blue-600">
                Create a new project for collaboration
              </p>
            </div>
          </div>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link to="/add-tender">Add Project</Link>
          </Button>
        </div>
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-blue-600"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none text-blue-900">
                Write Blog Post
              </p>
              <p className="text-sm text-blue-600">
                Share your thoughts with the community
              </p>
            </div>
          </div>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link to="/blog-management">New Post</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
