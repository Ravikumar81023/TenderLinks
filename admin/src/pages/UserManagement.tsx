//@ts-nocheck
import React, { useEffect, useState, useCallback } from "react";
import {
  useCustomerStore,
  CustomerUser,
  CustomerCreateInput,
} from "../store/customer";
import { useSectorStore } from "../store/sector";
import { useLocationStore } from "../store/location";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  PlusIcon,
  UserCheckIcon,
  UsersIcon,
  UserIcon,
  PenIcon,
  TrashIcon,
  Loader2,
  Activity,
} from "lucide-react";
import UserManagementDialog from "@/components/UserManagementDialog";
import CustomerDetails from "@/components/CustomerDetails";
export default function UserManagement() {
  const {
    customers,
    loading: customersLoading,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  } = useCustomerStore();

  const { sectors, loading: sectorsLoading, getSectors } = useSectorStore();
  const {
    locations,
    loading: locationsLoading,
    getLocations,
  } = useLocationStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [sectorFilter, setSectorFilter] = useState("_all");
  const [locationFilter, setLocationFilter] = useState("_all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerUser | null>(
    null,
  );
  const [activeStatusFilter, setActiveStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedCustomerForDetails, setSelectedCustomerForDetails] =
    useState<CustomerUser | null>(null);
  const loadInitialData = useCallback(async () => {
    try {
      await Promise.all([fetchCustomers(), getSectors(), getLocations()]);
      setIsInitialLoadComplete(true);
    } catch (error) {
      console.error("Error loading initial data:", error);
      setIsInitialLoadComplete(true); // Set to true even on error to prevent infinite loading
    }
  }, [fetchCustomers, getSectors, getLocations]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);
  const handleViewDetails = (customer: CustomerUser) => {
    setSelectedCustomerForDetails(customer);
    setIsDetailsOpen(true);
  };
  const filteredCustomers = React.useMemo(() => {
    return customers.filter((customer) => {
      // Check if customer matches search query
      const matchesSearch =
        customer.companyName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase());

      // Check if customer matches sector filter
      const matchesSector =
        sectorFilter === "_all" ||
        customer.sector?.id.toString() === sectorFilter;

      // Check if customer matches location filter
      const matchesLocation =
        locationFilter === "_all" ||
        customer.location?.id.toString() === locationFilter;

      // Check if customer matches active status filter
      const isActive =
        customer.subscriptionValidity &&
        new Date(customer.subscriptionValidity) > new Date();

      const matchesActiveStatus =
        activeStatusFilter === "all" ||
        (activeStatusFilter === "active" && isActive) ||
        (activeStatusFilter === "inactive" && !isActive);

      return (
        matchesSearch && matchesSector && matchesLocation && matchesActiveStatus
      );
    });
  }, [
    customers,
    searchQuery,
    sectorFilter,
    locationFilter,
    activeStatusFilter,
  ]);
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(
    (customer) =>
      customer.subscriptionValidity &&
      new Date(customer.subscriptionValidity) > new Date(),
  ).length;
  const inactiveCustomers = totalCustomers - activeCustomers;
  const handleViewActivity = (customerId: number) => {
    // Navigate to tracking page with customerId
    window.location.href = `/customers/${customerId}/analytics`;
  };
  const handleAddCustomer = async (customerData: CustomerCreateInput) => {
    try {
      await createCustomer(customerData);
      await fetchCustomers(); // Refresh the customers list
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };

  const handleUpdateCustomer = async (customerData: CustomerCreateInput) => {
    if (!selectedCustomer) return;
    try {
      await updateCustomer(selectedCustomer.id, customerData);
      await fetchCustomers(); // Refresh the customers list
      setIsDialogOpen(false);
      setSelectedCustomer(null);
      toast.success("Customer updated successfully");
    } catch (error) {
      console.error("Error updating customer:", error);
      toast.error("Failed to update customer");
    }
  };
  const handleDeleteCustomer = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await deleteCustomer(id);
        await fetchCustomers(); // Refresh the customers list
      } catch (error) {
        console.error("Error deleting customer:", error);
      }
    }
  };

  if (!isInitialLoadComplete) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-blue-800">
            Customer Management
          </h1>
          <Button
            onClick={() => {
              setSelectedCustomer(null);
              setIsDialogOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            className={`bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer ${activeStatusFilter === "all" ? "ring-2 ring-blue-500" : ""}`}
            onClick={() => setActiveStatusFilter("all")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">
                Total Customers
              </CardTitle>
              <UsersIcon className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800">
                {totalCustomers}
              </div>
            </CardContent>
          </Card>

          <Card
            className={`bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer ${activeStatusFilter === "active" ? "ring-2 ring-green-500" : ""}`}
            onClick={() => setActiveStatusFilter("active")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-600">
                Active Customers
              </CardTitle>
              <UserCheckIcon className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800">
                {activeCustomers}
              </div>
            </CardContent>
          </Card>

          <Card
            className={`bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer ${activeStatusFilter === "inactive" ? "ring-2 ring-red-500" : ""}`}
            onClick={() => setActiveStatusFilter("inactive")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-600">
                Inactive Customers
              </CardTitle>
              <UserIcon className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-800">
                {inactiveCustomers}
              </div>
            </CardContent>
          </Card>
          {activeStatusFilter !== "all" && (
            <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg mt-4">
              <p className="text-sm">
                Showing{" "}
                {activeStatusFilter === "active" ? "active" : "inactive"}{" "}
                customers only
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveStatusFilter("all")}
                className="text-gray-600"
              >
                Clear Filter
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <Input
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Select value={sectorFilter} onValueChange={setSectorFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by Sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_all">All Sectors</SelectItem>
                {sectors.map((sector) => (
                  <SelectItem key={sector.id} value={sector.id.toString()}>
                    {sector.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_all">All Locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id.toString()}>
                    {location.city || `${location.state}, ${location.district}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card className="bg-white shadow-lg">
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-blue-600">Email</TableHead>
                    <TableHead className="text-blue-600">Company</TableHead>
                    <TableHead className="text-blue-600">Phone</TableHead>
                    <TableHead className="text-blue-600">
                      Subscription
                    </TableHead>
                    <TableHead className="text-blue-600">
                      Subscription Validity
                    </TableHead>
                    <TableHead className="text-blue-600">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id} className="hover:bg-blue-50">
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.companyName}</TableCell>
                      <TableCell>{customer.phoneNumbers.join(", ")}</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                          {customer.subscriptionTier}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {customer.subscriptionValidity
                          ? new Date(
                              customer.subscriptionValidity,
                            ).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => handleViewDetails(customer)}
                          >
                            <UserIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => {
                              setSelectedCustomer(customer);
                              setIsDialogOpen(true);
                            }}
                          >
                            <PenIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                            onClick={() => handleViewActivity(customer.id)}
                          >
                            <Activity className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteCustomer(customer.id)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {isInitialLoadComplete && (
        <UserManagementDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          selectedUser={selectedCustomer}
          onSubmit={selectedCustomer ? handleUpdateCustomer : handleAddCustomer}
        />
      )}
      <CustomerDetails
        customer={selectedCustomerForDetails}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedCustomerForDetails(null);
        }}
      />
    </div>
  );
}
