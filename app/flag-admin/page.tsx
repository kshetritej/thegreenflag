import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Users, Image, Star, AlertTriangle, CheckCircle2 } from "lucide-react";
import prisma from "@/prisma/prismaClient";
import { DashboardCharts } from "./dashboard-charts";

async function getStats() {
  const [
    totalBusinesses,
    totalUsers,
    totalReviews,
    verifiedBusinesses,
    suspendedUsers,
    suspendedBusinesses
  ] = await Promise.all([
    prisma.business.count(),
    prisma.user.count(),
    prisma.review.count(),
    prisma.business.count({
      where: {
        verified: true
      }
    }),
    prisma.user.count({
      where: {
        suspended: true
      }
    }),
    prisma.business.count({
      where: {
        suspended: true
      }
    })
  ]);

  return {
    totalBusinesses,
    totalUsers,
    totalReviews,
    verifiedBusinesses,
    suspendedUsers,
    suspendedBusinesses
  };
}

async function getChartData() {
  // Get business growth data
  const businesses = await prisma.business.findMany({
    orderBy: {
      createdAt: 'asc'
    }
  });

  const businessGrowthData = businesses.reduce((acc: any[], business) => {
    const date = new Date(business.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const existing = acc.find(item => item.date === date);
    if (existing) {
      existing.businesses += 1;
    } else {
      acc.push({ date, businesses: 1 });
    }
    return acc;
  }, []);

  // Get user registration data
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: 'asc'
    }
  });

  const userGrowthData = users.reduce((acc: any[], user) => {
    const date = new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const existing = acc.find(item => item.date === date);
    if (existing) {
      existing.users += 1;
    } else {
      acc.push({ date, users: 1 });
    }
    return acc;
  }, []);

  // Get review distribution
  const reviews = await prisma.review.findMany();
  const reviewDistribution = reviews.reduce((acc: Record<number, number>, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {});

  const reviewData = Object.entries(reviewDistribution).map(([rating, count]) => ({
    rating: `${rating} Stars`,
    count
  }));

  return {
    businessGrowthData,
    userGrowthData,
    reviewData
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();
  const { businessGrowthData, userGrowthData, reviewData } = await getChartData();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Businesses</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBusinesses}</div>
            <p className="text-xs text-muted-foreground">
              {stats.verifiedBusinesses} verified, {stats.suspendedBusinesses} suspended
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.suspendedUsers} suspended accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReviews}</div>
            <p className="text-xs text-muted-foreground">
              Across all businesses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <DashboardCharts
        businessGrowthData={businessGrowthData}
        userGrowthData={userGrowthData}
        reviewData={reviewData}
      />

      {/* Platform Health */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Verification Rate</p>
                <p className="text-2xl font-bold">
                  {Math.round((stats.verifiedBusinesses / stats.totalBusinesses) * 100)}%
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Suspension Rate</p>
                <p className="text-2xl font-bold">
                  {Math.round((stats.suspendedUsers / stats.totalUsers) * 100)}%
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Average Reviews</p>
                <p className="text-2xl font-bold">
                  {Math.round(stats.totalReviews / stats.totalBusinesses)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 