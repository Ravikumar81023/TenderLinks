//@ts-nocheck
import type React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Building2,
  IndianRupee,
  FileText,
  Clock,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useClientTenderStore from "@/store/tenderStore";

const TenderSection: React.FC = () => {
  const { tenders, loading, fetchTenders } = useClientTenderStore();

  useEffect(() => {
    fetchTenders();
  }, [fetchTenders]);

  const formatValue = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    return `₹${value}`;
  };

  const calculateDaysRemaining = (deadline: string) => {
    const daysLeft = Math.ceil(
      (new Date(deadline).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24),
    );
    return daysLeft;
  };

  return (
    <section className="bg-gradient-to-r from-[#1a237e]/5 to-[#00838f]/5 py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-[#1a237e] relative">
            Latest Tenders
            <span className="absolute left-0 bottom-0 w-1/3 h-1 bg-[#00838f] rounded-full"></span>
          </h2>

          <div className="flex space-x-2">
            <Link to="/tenders">
              <Button
                variant="ghost"
                className="text-[#1a237e] hover:text-[#00838f] hover:bg-[#1a237e]/5"
              >
                All Tenders
              </Button>
            </Link>
            <Link to="/my-tenders">
              <Button
                variant="ghost"
                className="text-[#1a237e] hover:text-[#00838f] hover:bg-[#1a237e]/5"
              >
                My Tenders
              </Button>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00838f] mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(tenders) && tenders.slice(0, 3).map((tender) => (
              <Card
                key={tender.id}
                className="flex flex-col hover:shadow-lg transition-shadow bg-white rounded-xl overflow-hidden group border-t-4 border-transparent hover:border-t-4 hover:border-[#1a237e]"
              >
                <CardHeader className="bg-gradient-to-r from-[#1a237e]/5 to-[#00838f]/5 p-4">
                  <div className="flex justify-between items-start mb-3">
                    <Badge
                      variant="outline"
                      className="text-xs bg-white text-[#1a237e]"
                    >
                      ID: {tender.tenderNo}
                    </Badge>
                    <Badge
                      variant="default"
                      className={`
                        ${tender.status === "OPEN" ? "bg-green-100 text-green-800" : ""}
                        ${tender.status === "CLOSED" ? "bg-red-100 text-red-800" : ""}
                        ${tender.status === "UNDER_REVIEW" ? "bg-yellow-100 text-yellow-800" : ""}
                      `}
                    >
                      {tender.status}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold line-clamp-2 text-[#1a237e] group-hover:text-[#00838f] transition-colors">
                    {tender.title}
                  </h3>
                </CardHeader>
                <CardContent className="flex-grow space-y-4 p-4">
                  <div className="grid grid-cols-2 gap-x-2 gap-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Building2 className="h-4 w-4 mr-2 text-[#00838f]" />
                      <span className="truncate">{tender.sector.name}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-[#00838f]" />
                      <span className="truncate">
                        {tender.location.city}, {tender.location.state}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FileText className="h-4 w-4 mr-2 text-[#00838f]" />
                      <span className="truncate">ID: {tender.tenderID}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <IndianRupee className="h-4 w-4 mr-2 text-[#00838f]" />
                      <span className="font-medium text-[#1a237e]">
                        {formatValue(tender.value)}
                      </span>
                    </div>
                  </div>

                  {/* Deadline bar with days remaining */}
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">Deadline</span>
                      <span className="font-medium text-gray-700">
                        {new Date(
                          tender.lastDateOfSubmission,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          calculateDaysRemaining(tender.lastDateOfSubmission) <
                          3
                            ? "bg-red-500"
                            : calculateDaysRemaining(
                                  tender.lastDateOfSubmission,
                                ) < 7
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }`}
                        style={{
                          width: `${Math.min(100, Math.max(5, calculateDaysRemaining(tender.lastDateOfSubmission) * 3))}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-end mt-1 text-xs text-gray-600">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>
                        {calculateDaysRemaining(tender.lastDateOfSubmission) > 0
                          ? `${calculateDaysRemaining(tender.lastDateOfSubmission)} days remaining`
                          : "Deadline passed"}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      <span className="font-medium text-[#1a237e]">
                        Brief:{" "}
                      </span>
                      {tender.tenderBrief}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Link to={`/tenders/${tender.id}`} className="w-full">
                    <Button className="w-full bg-gradient-to-r from-[#1a237e] to-[#00838f] hover:opacity-90 text-white">
                      View Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        <div className="text-center mt-8">
          <Link to="/tenders">
            <Button
              variant="outline"
              className="bg-white text-[#1a237e] border-[#1a237e] hover:bg-[#1a237e]/10"
            >
              View All Tenders
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TenderSection;
