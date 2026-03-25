//@ts-nocheck
import React, { useState } from "react";
import { CustomerUser } from "../store/customer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, X, FileText } from "lucide-react";
import { DocumentViewer } from "./DocumentViewer";

interface CustomerDetailsProps {
  customer: CustomerUser | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomerDetails({
  customer,
  isOpen,
  onClose,
}: CustomerDetailsProps) {
  const [activeDocument, setActiveDocument] = useState<{
    path: string;
    type: string;
  } | null>(null);

  const handleDocumentView = (document: { path: string; type: string }) => {
    setActiveDocument(document);
  };

  // Early return if no customer data
  if (!customer) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-blue-800 flex justify-between items-center">
              Customer Details
            </DialogTitle>
          </DialogHeader>
          <div className="p-4 text-center text-gray-500">
            No customer data available
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-800 flex justify-between items-center">
            Customer Details
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-blue-700">
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Company Name</TableCell>
                    <TableCell>{customer.companyName || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Email</TableCell>
                    <TableCell>{customer.email || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Phone Numbers</TableCell>
                    <TableCell>
                      {customer.phoneNumbers?.length
                        ? customer.phoneNumbers.join(", ")
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Annual Turnover
                    </TableCell>
                    <TableCell>
                      {customer.annualTurnover
                        ? `₹${customer.annualTurnover.toLocaleString()}`
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          {/* Location & Sector */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-blue-700">
                Location & Sector
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Sector</TableCell>
                    <TableCell>{customer.sector?.name || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Location</TableCell>
                    <TableCell>
                      {customer.location
                        ? `${customer.location.city || ""}, ${
                            customer.location.district || ""
                          }, ${customer.location.state || ""}`
                            .replace(/(^,\s*)|(\s*,\s*$)/g, "")
                            .replace(/,\s*,/g, ",")
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          {/* Subscription Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-blue-700">
                Subscription Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      Subscription Tier
                    </TableCell>
                    <TableCell>
                      {customer.subscriptionTier && (
                        <Badge className="bg-blue-100 text-blue-800">
                          {customer.subscriptionTier}
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Subscription Validity
                    </TableCell>
                    <TableCell>
                      {customer.subscriptionValidity
                        ? new Date(
                            customer.subscriptionValidity,
                          ).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Service Validity
                    </TableCell>
                    <TableCell>
                      {customer.serviceValidity
                        ? new Date(
                            customer.serviceValidity,
                          ).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-blue-700">Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <DocumentViewer
                    documents={customer?.documents || []}
                    onView={handleDocumentView}
                  />
                </div>
                {activeDocument && (
                  <div className="border rounded-lg p-4">
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      {activeDocument.type.startsWith("image/") ? (
                        <img
                          src={`${import.meta.env.VITE_BASE_URL}${activeDocument.path}`}
                          alt="Document preview"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <FileText className="h-16 w-16 text-gray-400" />
                          <p className="text-sm text-gray-500">
                            Preview not available
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
