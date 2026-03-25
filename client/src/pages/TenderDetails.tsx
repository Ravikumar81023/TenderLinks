import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Building2,
  ArrowLeft,
  Clock,
  Briefcase,
  Bookmark,
  FileText, 
  AlertTriangle,
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DocumentViewer } from "@/components/DocumentViewer";
import useClientTenderStore, { type ClientTender } from "@/store/tenderStore";
import useAuthStore from "@/store/authStore";
import { PageHeader } from "@/components/ui/page-header";

const TenderDetails = () => {
  const { tenderId } = useParams<{ tenderId: string }>();
  const { fetchTenderById, loading, toggleBookmark, isBookmarked } =
    useClientTenderStore();
  const { user } = useAuthStore();
  const [tender, setTender] = useState<ClientTender | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTender = async () => {
      if (tenderId) {
        const tenderData = await fetchTenderById(parseInt(tenderId));
        if (tenderData) {
          setTender(tenderData);
        }
      }
    };
    loadTender();
  }, [tenderId, fetchTenderById]);

  const handleBackToTenders = () => {
    navigate("/tenders");
  };

  const handleToggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (tender?.id) {
      toggleBookmark(tender.id);
    }
  };

  const formatValue = (value?: number) => {
    if (!value) return "Not specified";
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)}Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    } else if (value >= 1000) {
      return `₹${(value / 1000).toFixed(1)}K`;
    }
    return `₹${value}`;
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "OPEN":
        return "bg-green-100 text-green-800";
      case "CLOSED":
        return "bg-red-100 text-red-800";
      case "UNDER_REVIEW":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#1a237e]/5 to-[#00838f]/5">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a237e]"></div>
      </div>
    );
  }

  if (!tender) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#1a237e]/5 to-[#00838f]/5">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#1a237e]">
            Tender Not Found
          </h2>
          <p className="mt-2 text-gray-600">
            The tender you're looking for doesn't exist or has been removed.
          </p>
          <Button
            className="mt-4 bg-gradient-to-r from-[#1a237e] to-[#00838f] text-white"
            onClick={handleBackToTenders}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tenders
          </Button>
        </div>
      </div>
    );
  }

  const daysUntilExpiry = tender.lastDateOfSubmission
    ? Math.ceil(
        (new Date(tender.lastDateOfSubmission).getTime() -
          new Date().getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#1a237e]/5 to-[#00838f]/5 pt-16">
      <PageHeader
        title={tender.title}
        subtitle={`Tender No: ${tender.tenderNo || tender.tenderID}`}
        className="bg-gradient-to-r from-[#1a237e] to-[#00838f] text-white"
      />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            className="flex items-center text-[#1a237e] hover:text-[#00838f] transition-colors justify-center"
            onClick={handleBackToTenders}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Tenders
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Tender Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden border-none shadow-lg">
              <CardHeader className="bg-gradient-to-r from-[#1a237e] to-[#00838f] text-white">
                <div className="flex justify-between items-center">
                  {tender.status && (
                    <Badge className={`${getStatusColor(tender.status)}`}>
                      {tender.status}
                    </Badge>
                  )}
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:text-white hover:bg-white/20"
                      onClick={handleToggleBookmark}
                    >
                      <Bookmark
                        className={`h-6 w-6 mr-1 ${isBookmarked(tender.id) ? "fill-white" : ""}`}
                      />
                      {isBookmarked(tender.id) ? "Bookmarked" : "Bookmark"}
                    </Button>
                    {tender.value !== undefined && (
                      <div className="text-xl font-bold">
                        {formatValue(tender.value)}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tender.sector && tender.sector.name && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Building2 className="h-5 w-5 text-[#1a237e]" />
                      <span>{tender.sector.name}</span>
                    </div>
                  )}
                  {tender.location &&
                    (tender.location.city || tender.location.state) && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="h-5 w-5 text-[#1a237e]" />
                        <span>
                          {tender.location.city && `${tender.location.city}, `}
                          {tender.location.state}
                        </span>
                      </div>
                    )}
                  {tender.lastDateOfSubmission && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="h-5 w-5 text-[#1a237e]" />
                      <span>
                        Due:{" "}
                        {new Date(
                          tender.lastDateOfSubmission,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {tender.biddingType && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Briefcase className="h-5 w-5 text-[#1a237e]" />
                      <span>{tender.biddingType}</span>
                    </div>
                  )}
                </div>

                {/* Tender Description - Only shown if available */}
                {(tender.description || tender.tenderBrief) && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-3 text-[#1a237e]">
                      Tender Description
                    </h3>
                    <div className="border rounded-lg p-4">
                      {tender.description && (
                        <p className="text-gray-600">{tender.description}</p>
                      )}
                      {tender.tenderBrief && (
                        <div className="mt-4 p-4 bg-[#1a237e]/5 rounded-lg">
                          <h4 className="font-medium mb-2 text-[#1a237e]">
                            Brief Overview
                          </h4>
                          <p className="text-gray-600">{tender.tenderBrief}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Tender Details - Only show fields with values */}
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3 text-[#1a237e]">
                    Tender Details
                  </h3>
                  <div className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tender.tenderID && (
                        <div>
                          <p className="font-medium text-[#1a237e]">
                            Tender ID
                          </p>
                          <p className="text-gray-600">{tender.tenderID}</p>
                        </div>
                      )}
                      {tender.tenderingAuthority && (
                        <div>
                          <p className="font-medium text-[#1a237e]">
                            Tendering Authority
                          </p>
                          <p className="text-gray-600">
                            {tender.tenderingAuthority}
                          </p>
                        </div>
                      )}
                      {tender.documentFees && (
                        <div>
                          <p className="font-medium text-[#1a237e]">
                            Document Fees
                          </p>
                          <p className="text-gray-600">{tender.documentFees}</p>
                        </div>
                      )}
                      {tender.emd !== undefined && (
                        <div>
                          <p className="font-medium text-[#1a237e]">
                            EMD Amount
                          </p>
                          <p className="text-gray-600">
                            {formatValue(tender.emd)}
                          </p>
                        </div>
                      )}
                      {tender.competitionType && (
                        <div>
                          <p className="font-medium text-[#1a237e]">
                            Competition Type
                          </p>
                          <p className="text-gray-600">
                            {tender.competitionType}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Important Dates - Only show if dates are available */}
                {(tender.publishDate ||
                  tender.lastDateOfSubmission ||
                  tender.expiryDate) && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-3 text-[#1a237e]">
                      Important Dates
                    </h3>
                    <div className="border rounded-lg p-4">
                      <div className="space-y-4">
                        {tender.publishDate && (
                          <div className="flex justify-between items-center p-3 bg-[#1a237e]/5 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-5 w-5 text-[#1a237e]" />
                              <span className="text-gray-600">
                                Published Date
                              </span>
                            </div>
                            <span className="font-medium">
                              {new Date(
                                tender.publishDate,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        {tender.lastDateOfSubmission && (
                          <div className="flex justify-between items-center p-3 bg-[#1a237e]/5 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-5 w-5 text-[#1a237e]" />
                              <span className="text-gray-600">
                                Submission Deadline
                              </span>
                            </div>
                            <span className="font-medium">
                              {new Date(
                                tender.lastDateOfSubmission,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        {tender.expiryDate && (
                          <div className="flex justify-between items-center p-3 bg-[#1a237e]/5 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-5 w-5 text-[#1a237e]" />
                              <span className="text-gray-600">Expiry Date</span>
                            </div>
                            <span className="font-medium">
                              {new Date(tender.expiryDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Documents Section - Only shown if documents exist */}
            {tender.documents && tender.documents.length > 0 && (
              <Card className="overflow-hidden border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-[#1a237e] to-[#00838f] text-white">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    <h3 className="text-lg font-semibold">Tender Documents</h3>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <DocumentViewer documents={tender.documents} />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Action Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6 overflow-hidden border-none shadow-lg">
              <CardHeader className="bg-gradient-to-r from-[#1a237e] to-[#00838f] text-white">
                <h3 className="text-lg font-semibold">Tender Summary</h3>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="p-4 bg-[#1a237e]/5 rounded-lg space-y-3">
                    {tender.value !== undefined && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Value</span>
                        <span className="font-medium text-[#1a237e]">
                          {formatValue(tender.value)}
                        </span>
                      </div>
                    )}
                    {tender.emd !== undefined && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">EMD Amount</span>
                        <span className="font-medium text-[#1a237e]">
                          {formatValue(tender.emd)}
                        </span>
                      </div>
                    )}
                    {tender.documentFees && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Document Fees</span>
                        <span className="font-medium text-[#1a237e]">
                          {tender.documentFees}
                        </span>
                      </div>
                    )}

                    {/* Show placeholder if no financial details available */}
                    {tender.value === undefined &&
                      tender.emd === undefined &&
                      !tender.documentFees && (
                        <div className="flex items-center justify-center text-gray-500 py-2">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          No financial details available
                        </div>
                      )}
                  </div>

                  {daysUntilExpiry !== null && (
                    <div
                      className={`p-4 rounded-lg ${
                        daysUntilExpiry > 7
                          ? "bg-green-50 text-green-800"
                          : daysUntilExpiry > 0
                            ? "bg-yellow-50 text-yellow-800"
                            : "bg-red-50 text-red-800"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5" />
                        <span className="font-medium">
                          {daysUntilExpiry > 0
                            ? `${daysUntilExpiry} ${daysUntilExpiry === 1 ? "day" : "days"} remaining`
                            : "Submission deadline passed"}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Apply Section - If the tender is still open */}
                  {tender.status === "OPEN" &&
                    daysUntilExpiry &&
                    daysUntilExpiry > 0 && (
                      <div className="mt-6">
                        <Button className="w-full bg-gradient-to-r from-[#1a237e] to-[#00838f] hover:opacity-90 text-white py-6">
                          Apply for This Tender
                        </Button>
                        {user?.annualTurnover &&
                          tender.value &&
                          user.annualTurnover < tender.value && (
                            <div className="mt-3 p-3 bg-yellow-50 rounded-lg text-sm text-yellow-800 flex items-center">
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              <span>
                                Tender value exceeds your annual turnover
                              </span>
                            </div>
                          )}
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenderDetails;
