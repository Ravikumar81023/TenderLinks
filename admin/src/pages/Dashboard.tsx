import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RecentActivity } from "@/components/RecentActivity";
import { Overview } from "@/components/Overview";
import { QuickActions } from "@/components/QuickActions";
import { useDashboardStore } from "@/store/dashboardStore";
import { useSectorStore } from "@/store/sector";
import { UserEngagement } from "@/components/UserEngagement";
import { ProjectDistribution } from "@/components/ProjectDistribution";

const StatCard = ({
  title,
  value,
  icon,
  change,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  change: string;
}) => (
  <Card className="border-blue-100">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-blue-800">
        {title}
      </CardTitle>
      <div className="text-blue-600">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-blue-900">{value}</div>
      <p className="text-xs text-blue-600">{change}</p>
    </CardContent>
  </Card>
);

const LoadingSkeleton = () => (
  <div className="space-y-4">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-[120px] w-full bg-blue-50" />
      ))}
    </div>
    <Skeleton className="h-[400px] w-full bg-blue-50" />
  </div>
);

const ErrorAlert = ({ message }: { message: string }) => (
  <Alert variant="destructive" className="border-blue-600 bg-blue-50">
    <AlertDescription className="text-blue-900">{message}</AlertDescription>
  </Alert>
);

export default function Dashboard() {
  const {
    overviewStats,
    userStats,
    tenderStats,
    analyticsStats,
    loading: dashboardLoading,
    error: dashboardError,
    fetchOverviewStats,
    fetchUserStats,
    fetchTenderStats,
    fetchAnalyticsStats,
  } = useDashboardStore();

  const {
    sectors,
    loading: sectorLoading,
    error: sectorError,
    getSectors,
  } = useSectorStore();

  useEffect(() => {
    getSectors();
    fetchOverviewStats();
    fetchUserStats();
    fetchTenderStats();
    fetchAnalyticsStats();
  }, [
    getSectors,
    fetchOverviewStats,
    fetchUserStats,
    fetchTenderStats,
    fetchAnalyticsStats,
  ]);

  // Combine loading states and errors
  const loading = dashboardLoading || sectorLoading;
  const error = dashboardError || sectorError;

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  if (
    !overviewStats ||
    !userStats ||
    !tenderStats ||
    !analyticsStats ||
    !sectors
  ) {
    return <ErrorAlert message="No dashboard data available" />;
  }

  // Create a map of sector IDs to names
  const sectorMap = new Map(sectors.map((sector) => [sector.id, sector.name]));

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 bg-blue-50">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-blue-900">
          Dashboard
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={overviewStats.totalUsers}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
          change={`+${userStats.activeUsers} active in last 30 days`}
        />
        <StatCard
          title="Total Tenders"
          value={overviewStats.totalTenders}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4"
            >
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
            </svg>
          }
          change={`${tenderStats.upcomingTenders} upcoming`}
        />
        <StatCard
          title="Total Documents"
          value={overviewStats.totalDocuments}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          }
          change="Updated daily"
        />
        <StatCard
          title="Total Blogs"
          value={overviewStats.totalBlogs}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          }
          change="Last 30 days"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-blue-100">
          <CardHeader>
            <CardTitle className="text-blue-900">Tender Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview
              data={(tenderStats?.tenderStats || []).map((stat) => ({
                name: sectorMap.get(stat.sectorId) || `Sector ${stat.sectorId}`,
                total: stat._sum.value,
              }))}
            />
          </CardContent>
        </Card>

        <Card className="col-span-3 border-blue-100">
          <CardHeader>
            <CardTitle className="text-blue-900">Recent Activity</CardTitle>
            <CardDescription className="text-blue-600">
              You have {(analyticsStats?.userEngagement?.length || 0)} recent activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity
              activities={(analyticsStats?.userEngagement || []).map((user) => ({
                name: user.email,
                action: "Logged in",
                time: user.lastLogin || "N/A",
                avatar: "/placeholder.svg",
              }))}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-blue-100">
          <CardHeader>
            <CardTitle className="text-blue-900">User Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <UserEngagement
              data={(analyticsStats?.userEngagement || []).map((user) => ({
                date: user.lastLogin || "N/A",
                pageViews: user.analyticsCount,
                timeSpent: Math.floor(Math.random() * 60), // Placeholder for time spent
              }))}
            />
          </CardContent>
        </Card>

        <Card className="col-span-3 border-blue-100">
          <CardHeader>
            <CardTitle className="text-blue-900">
              Project Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectDistribution
              data={(tenderStats?.tenderStats ||[]).map((stat) => ({
                sector:
                  sectorMap.get(stat.sectorId) || `Sector ${stat.sectorId}`,
                count: stat._count._all,
              }))}
            />
          </CardContent>
        </Card>
      </div>

      <QuickActions />
    </div>
  );
}
