import { Button } from "@/components/ui/button";
import { FileText, Download, ExternalLink } from "lucide-react";

interface DocumentViewerProps {
  documents: Array<{
    name: string;
    path: string;
    type: string;
  }>;
  disabled?: boolean;
}

const BASE_URL =
  import.meta.env.VITE_BASE_URL?.replace(/\/$/, "") || "http://localhost:3000";

export function DocumentViewer({
  documents,
  disabled = false,
}: DocumentViewerProps) {
  const getFullUrl = (path: string) => {
    if (path.startsWith("http")) return path;

    // Fix for the issue with "/var/www" appearing in the URL
    // Remove any server-side path parts that might be included
    const cleanPath = path.replace(/^.*\/uploads\//, "uploads/");

    return `${BASE_URL}/${cleanPath}`;
  };

  const handleDownload = async (
    e: React.MouseEvent,
    path: string,
    filename: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const fullUrl = getFullUrl(path);

    try {
      const response = await fetch(fullUrl);
      if (!response.ok) throw new Error("Failed to fetch file");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download file. Please try again.");
    }
  };

  const handleView = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    e.stopPropagation();

    const fullUrl = getFullUrl(path);
    window.open(fullUrl, "_blank");
  };

  if (!documents || documents.length === 0) {
    return <p className="text-sm text-gray-500">No documents available</p>;
  }

  return (
    <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
      {documents.map((doc, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
        >
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">{doc.name}</span>
          </div>
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700"
              onClick={(e) => handleView(e, doc.path)}
              disabled={disabled}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700"
              onClick={(e) => handleDownload(e, doc.path, doc.name)}
              disabled={disabled}
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
