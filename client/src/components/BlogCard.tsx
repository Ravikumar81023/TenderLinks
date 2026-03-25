import { Calendar, User, ChevronRight, Clock } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Blog } from "../pages/Blog";
import { Link } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const RealEstateBlogCard: React.FC<Blog> = ({
  id,
  title,
  author,
  date,
  category,
  imageUrl,
  readTime,
}) => {
  return (
    <Card className="flex flex-col h-full overflow-hidden group hover:shadow-xl transition-all duration-300 bg-white border-none rounded-xl">
      <div className="relative">
        <div className="overflow-hidden h-56">
          <img
            src={`${BASE_URL}${imageUrl}`}
            alt={title}
            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge className="bg-gradient-to-r from-[#1a237e] to-[#00838f] hover:opacity-90 text-white px-3 py-1">
            {category}
          </Badge>
        </div>
      </div>

      <CardHeader className="space-y-3 pt-6">
        <h3 className="text-2xl font-bold leading-tight group-hover:text-[#00838f] transition-colors duration-200 line-clamp-2">
          {title}
        </h3>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <User className="h-4 w-4 text-[#00838f]" />
            <span>{author}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-[#00838f]" />
            <span>{date}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-[#00838f]" />
            {readTime} read
          </span>
        </div>
      </CardContent>

      <CardFooter className="border-t pt-4">
        <Link to={`/blog/${id}`} className="w-full">
          <Button className="w-full bg-gradient-to-r from-[#1a237e] to-[#00838f] text-white hover:opacity-90 transition-opacity group">
            Read More
            <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default RealEstateBlogCard;
