//@ts-nocheck
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useCustomerStore } from "../store/customer";
import { useAnalyticsStore } from "../store/analyticsStore";
import { format, subDays, subMonths, subWeeks, subYears } from "date-fns";
import { ArrowLeft, Search, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

interface CustomerAnalytics {
  id: number;
  userId: number;
  ipAddress: string;
  loginTime: string;
  logoutTime: string | null;
  pageViews: number;
  timeSpent: number;
  location: string;
  createdAt: string;
  user?: {
    id: number;
    email: string;
    companyName: string;
    subscriptionTier: string;
    lastLoginTime: string;
  };
}

interface CustomerSummary {
  id: number;
  email: string;
  companyName: string;
  subscriptionTier: string;
  totalSessions: number;
  totalPageViews: number;
  avgTimeSpent: number;
  lastLogin: string;
  locations: string[];
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

const CustomerTracking = () => {
  // Get URL parameters
  const { customerId } = useParams();
  const navigate = useNavigate();

  const { selectedCustomer, fetchCustomerById } = useCustomerStore();
  const { analytics, loading, error, fetchAnalytics, setFilters } =
    useAnalyticsStore();

  const [timeRange, setTimeRange] = useState("week");
  const [searchQuery, setSearchQuery] = useState("");
  const [customerSummaries, setCustomerSummaries] = useState<CustomerSummary[]>(
    [],
  );
  const [viewMode, setViewMode] = useState<"summary" | "detail">(
    customerId ? "detail" : "summary",
  );
  const [selectedUserId, setSelectedUserId] = useState<number | null>(
    customerId ? Number(customerId) : null,
  );
  const [customerAnalytics, setCustomerAnalytics] = useState<
    CustomerAnalytics[]
  >([]);
  const [customerAnalyticsLoading, setCustomerAnalyticsLoading] =
    useState(false);

  // Initial fetch and time range updates
  useEffect(() => {
    const endDate = new Date();
    let startDate = new Date();

    switch (timeRange) {
      case "week":
        startDate = subDays(endDate, 7);
        break;
      case "month":
        startDate = subMonths(endDate, 1);
        break;
      case "quarter":
        startDate = subMonths(endDate, 3);
        break;
      case "year":
        startDate = subYears(endDate, 1);
        break;
    }

    const filters = {
      startDate,
      endDate,
    };

    setFilters(filters);
  }, [timeRange, setFilters]);

  // Handle URL parameter for direct customer view
  useEffect(() => {
    if (customerId) {
      const userId = Number(customerId);
      setSelectedUserId(userId);
      setViewMode("detail");
      fetchCustomerDetails(userId);
    }
  }, [customerId]);

  // Process analytics data to get unique customer summaries
  useEffect(() => {
    if (analytics?.length) {
      const customerMap = new Map<number, CustomerSummary>();

      analytics.forEach((session) => {
        if (!session.user) return;

        const userId = session.user.id;
        const existing = customerMap.get(userId);

        if (existing) {
          // Update existing customer summary
          existing.totalSessions += 1;
          existing.totalPageViews += session.pageViews;
          existing.avgTimeSpent =
            (existing.avgTimeSpent * (existing.totalSessions - 1) +
              session.timeSpent) /
            existing.totalSessions;

          if (new Date(session.loginTime) > new Date(existing.lastLogin)) {
            existing.lastLogin = session.loginTime;
          }

          if (!existing.locations.includes(session.location)) {
            existing.locations.push(session.location);
          }
        } else {
          // Create new customer summary
          customerMap.set(userId, {
            id: userId,
            email: session.user.email,
            companyName: session.user.companyName,
            subscriptionTier: session.user.subscriptionTier,
            totalSessions: 1,
            totalPageViews: session.pageViews,
            avgTimeSpent: session.timeSpent,
            lastLogin: session.loginTime,
            locations: [session.location],
          });
        }
      });

      // Convert Map to array and sort by most recent login
      const summaries = Array.from(customerMap.values()).sort(
        (a, b) =>
          new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime(),
      );

      setCustomerSummaries(summaries);
    } else {
      setCustomerSummaries([]);
    }
  }, [analytics]);

  // Filter customer summaries by search query
  const filteredCustomers = customerSummaries.filter(
    (customer) =>
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.subscriptionTier
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  // Fetch specific customer analytics
  const fetchCustomerDetails = async (userId: number) => {
    setCustomerAnalyticsLoading(true);
    try {
      const endDate = new Date();
      let startDate = new Date();

      switch (timeRange) {
        case "week":
          startDate = subDays(endDate, 7);
          break;
        case "month":
          startDate = subMonths(endDate, 1);
          break;
        case "quarter":
          startDate = subMonths(endDate, 3);
          break;
        case "year":
          startDate = subYears(endDate, 1);
          break;
      }

      const params = new URLSearchParams();
      params.append("startDate", startDate.toISOString());
      params.append("endDate", endDate.toISOString());

      const response = await axios.get(
        `${BASE_URL}/api/customers/${userId}/analytics?${params.toString()}`,
      );
      setCustomerAnalytics(response.data);
      setSelectedUserId(userId);
      setViewMode("detail");

      // Also fetch complete customer details for context
      fetchCustomerById(userId);
    } catch (error) {
      console.error("Failed to fetch customer analytics:", error);
    } finally {
      setCustomerAnalyticsLoading(false);
    }
  };

  const formatDate = (date: string) => {
    if (!date) return "N/A";
    return format(new Date(date), "MMM dd");
  };

  const formatFullDate = (date: string) => {
    if (!date) return "N/A";
    return format(new Date(date), "MMM dd, yyyy HH:mm");
  };

  const backToSummary = () => {
    setViewMode("summary");
    setSelectedUserId(null);
    // Update URL to remove customer ID
    navigate("/analytics");
  };

  const viewCustomerDetails = (userId: number) => {
    // Update URL when viewing a specific customer
    navigate(`/customers/${userId}/analytics`);
    fetchCustomerDetails(userId);
  };

  // Format analytics data for charts
  const prepareChartData = () => {
    if (!customerAnalytics?.length) return [];

    return customerAnalytics.map((session) => ({
      ...session,
      date: formatDate(session.loginTime),
      fullDate: session.loginTime,
      timeSpentMins: Math.round(session.timeSpent / 60), // Convert to minutes for better readability
    }));
  };

  const chartData = prepareChartData();

  // Prepare location data for pie chart
  const locationData = React.useMemo(() => {
    if (!customerAnalytics?.length) return [];

    const locationMap = new Map<string, number>();
    customerAnalytics.forEach((session) => {
      const count = locationMap.get(session.location) || 0;
      locationMap.set(session.location, count + 1);
    });

    return Array.from(locationMap.entries()).map(([name, value]) => ({
      name,
      value,
    }));
  }, [customerAnalytics]);

  // Generate summary metrics
  const getMetrics = () => {
    if (!customerAnalytics?.length)
      return {
        totalSessions: 0,
        totalPageViews: 0,
        avgTimeSpent: 0,
        activeNow: 0,
      };

    const totalSessions = customerAnalytics.length;
    const totalPageViews = customerAnalytics.reduce(
      (sum, item) => sum + item.pageViews,
      0,
    );
    const avgTimeSpent =
      customerAnalytics.reduce((sum, item) => sum + item.timeSpent, 0) /
      totalSessions;
    const activeNow = customerAnalytics.filter(
      (item) => !item.logoutTime,
    ).length;

    return { totalSessions, totalPageViews, avgTimeSpent, activeNow };
  };

  const metrics = getMetrics();

  if (loading && viewMode === "summary") {
    return (
      <div className="space-y-4 p-8">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Card className="bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-600">Error loading analytics: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {viewMode === "detail" && selectedUserId ? (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={backToSummary}
              className="text-blue-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to All Customers
            </Button>
            <h2 className="text-2xl font-bold text-blue-900 ml-2">
              {selectedCustomer?.companyName || "Customer"} Analytics
            </h2>
          </div>
        ) : (
          <h2 className="text-2xl font-bold text-blue-900 flex items-center">
            <Users className="mr-2 h-6 w-6" /> Customer Analytics Dashboard
          </h2>
        )}

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search customers..."
              className="pl-8 w-full md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select
            value={timeRange}
            onValueChange={(value) => {
              setTimeRange(value);
              // Re-fetch customer details if in detail view
              if (viewMode === "detail" && selectedUserId) {
                fetchCustomerDetails(selectedUserId);
              }
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {viewMode === "summary" ? (
        // SUMMARY VIEW - List of unique customers
        <>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-blue-900">Total Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-blue-900">
                  {customerSummaries.length}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Active in selected period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-blue-900">Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-blue-900">
                  {analytics?.length || 0}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Total login sessions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-blue-900">
                  Avg. Sessions/Customer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-blue-900">
                  {customerSummaries.length > 0
                    ? (analytics?.length / customerSummaries.length).toFixed(1)
                    : "0"}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Average sessions per customer
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-blue-900">Customer Overview</CardTitle>
              <div className="text-sm text-gray-500">
                Total Customers: {filteredCustomers.length}
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-blue-900">
                      <th className="pb-3">Company</th>
                      <th className="pb-3">Email</th>
                      <th className="pb-3">Subscription</th>
                      <th className="pb-3">Sessions</th>
                      <th className="pb-3">Page Views</th>
                      <th className="pb-3">Avg. Time (min)</th>
                      <th className="pb-3">Last Login</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer) => (
                      <tr
                        key={customer.id}
                        className="border-t border-gray-200 hover:bg-gray-50"
                      >
                        <td className="py-3 font-medium">
                          {customer.companyName}
                        </td>
                        <td className="py-3">{customer.email}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              customer.subscriptionTier === "PLATINUM" ||
                              customer.subscriptionTier === "DIAMOND"
                                ? "bg-blue-100 text-blue-800"
                                : customer.subscriptionTier === "GOLD"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {customer.subscriptionTier}
                          </span>
                        </td>
                        <td className="py-3">{customer.totalSessions}</td>
                        <td className="py-3">{customer.totalPageViews}</td>
                        <td className="py-3">
                          {(customer.avgTimeSpent / 60).toFixed(1)}
                        </td>
                        <td className="py-3">
                          {formatFullDate(customer.lastLogin)}
                        </td>
                        <td className="py-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewCustomerDetails(customer.id)}
                          >
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        // DETAIL VIEW - Specific customer analytics
        <>
          {customerAnalyticsLoading ? (
            <div className="space-y-4">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
                <Skeleton className="h-[120px]" />
                <Skeleton className="h-[120px]" />
                <Skeleton className="h-[120px]" />
                <Skeleton className="h-[120px]" />
              </div>
              <Skeleton className="h-[300px]" />
              <Skeleton className="h-[400px]" />
            </div>
          ) : (
            <>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-blue-900">
                      Total Sessions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-900">
                      {metrics.totalSessions}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Sessions in selected period
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-blue-900">Page Views</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-900">
                      {metrics.totalPageViews}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Total pages viewed
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-blue-900">
                      Avg. Time Spent
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-900">
                      {(metrics.avgTimeSpent / 60).toFixed(1)}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Minutes per session
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-blue-900">Active Now</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-900">
                      {metrics.activeNow}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Currently logged in sessions
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-900">
                      Page Views Over Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" height={50} interval={0} />
                          <YAxis />
                          <Tooltip
                            formatter={(value) => [
                              `${value} views`,
                              "Page Views",
                            ]}
                            labelFormatter={(label) => {
                              const item = chartData.find(
                                (d) => d.date === label,
                              );
                              return item
                                ? formatFullDate(item.fullDate)
                                : label;
                            }}
                          />
                          <Bar dataKey="pageViews" fill="#2563eb" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-900">
                      Time Spent (Minutes)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" height={50} interval={0} />
                          <YAxis />
                          <Tooltip
                            formatter={(value) => [
                              `${value} min`,
                              "Time Spent",
                            ]}
                            labelFormatter={(label) => {
                              const item = chartData.find(
                                (d) => d.date === label,
                              );
                              return item
                                ? formatFullDate(item.fullDate)
                                : label;
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="timeSpentMins"
                            stroke="#2563eb"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle className="text-blue-900">
                      Session Locations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={locationData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) =>
                              `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                          >
                            {locationData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Legend />
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="col-span-2">
                  <CardHeader>
                    <CardTitle className="text-blue-900">
                      Session Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto max-h-[300px]">
                      <table className="w-full">
                        <thead className="sticky top-0 bg-white">
                          <tr className="text-left text-blue-900">
                            <th className="pb-2 pr-4">Date</th>
                            <th className="pb-2 pr-4">Location</th>
                            <th className="pb-2 pr-4">IP Address</th>
                            <th className="pb-2 pr-4">Page Views</th>
                            <th className="pb-2 pr-4">Time Spent</th>
                            <th className="pb-2">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {customerAnalytics.map((session) => (
                            <tr
                              key={session.id}
                              className="border-t border-gray-200"
                            >
                              <td className="py-2 pr-4">
                                {formatFullDate(session.loginTime)}
                              </td>
                              <td className="py-2 pr-4">{session.location}</td>
                              <td className="py-2 pr-4">{session.ipAddress}</td>
                              <td className="py-2 pr-4">{session.pageViews}</td>
                              <td className="py-2 pr-4">
                                {(session.timeSpent / 60).toFixed(1)} min
                              </td>
                              <td className="py-2">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    session.logoutTime
                                      ? "bg-gray-100 text-gray-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {session.logoutTime ? "Logged Out" : "Active"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default CustomerTracking;
