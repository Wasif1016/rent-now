import { getBookingStats } from '@/lib/data'
import { getAdminStats } from '@/lib/services/stats.service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DollarSign,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  Car,
  Route,
  MapPin,
  TrendingUp,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const [bookingStats, adminStats] = await Promise.all([
    getBookingStats({}),
    getAdminStats(),
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Nationwide operations overview and control center
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Businesses</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminStats.totalBusinesses}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {adminStats.activeVendors} active vendors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vehicles Listed</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminStats.totalVehicles}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {adminStats.citiesCovered} cities covered
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Routes Created</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminStats.totalRoutes}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active corridors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookingStats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Rs. {bookingStats.totalCommission.toLocaleString()} commission
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Business Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Business Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <div className="text-2xl font-bold">
                {adminStats.businessesByStatus.NOT_REGISTERED || 0}
              </div>
              <div className="text-sm text-muted-foreground">Not Registered</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {adminStats.businessesByStatus.ACCOUNT_CREATED || 0}
              </div>
              <div className="text-sm text-muted-foreground">Account Created</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {adminStats.businessesByStatus.EMAIL_SENT || 0}
              </div>
              <div className="text-sm text-muted-foreground">Email Sent</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {adminStats.businessesByStatus.ACTIVE || 0}
              </div>
              <div className="text-sm text-muted-foreground">Active</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {adminStats.businessesByStatus.SUSPENDED || 0}
              </div>
              <div className="text-sm text-muted-foreground">Suspended</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Operational Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendors Without Vehicles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              Vendors Without Vehicles
            </CardTitle>
          </CardHeader>
          <CardContent>
            {adminStats.vendorsWithoutVehicles.length > 0 ? (
              <div className="space-y-2">
                {adminStats.vendorsWithoutVehicles.slice(0, 5).map((vendor) => (
                  <div
                    key={vendor.id}
                    className="flex items-center justify-between p-2 hover:bg-muted rounded"
                  >
                    <div>
                      <div className="font-medium">{vendor.name}</div>
                      <div className="text-sm text-muted-foreground">{vendor.email}</div>
                    </div>
                    <Link href={`/admin/businesses/${vendor.id}`}>
                      <Badge variant="outline">View</Badge>
                    </Link>
                  </div>
                ))}
                {adminStats.vendorsWithoutVehicles.length > 5 && (
                  <p className="text-sm text-muted-foreground text-center pt-2">
                    +{adminStats.vendorsWithoutVehicles.length - 5} more
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">All vendors have vehicles listed</p>
            )}
          </CardContent>
        </Card>

        {/* Low Supply Cities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              Cities with Low Supply
            </CardTitle>
          </CardHeader>
          <CardContent>
            {adminStats.lowSupplyCities.length > 0 ? (
              <div className="space-y-2">
                {adminStats.lowSupplyCities.slice(0, 5).map((city) => (
                  <div
                    key={city.name}
                    className="flex items-center justify-between p-2 hover:bg-muted rounded"
                  >
                    <div>
                      <div className="font-medium">{city.name}</div>
                      <div className="text-sm text-muted-foreground">{city.count} vehicles</div>
                    </div>
                    <Badge variant="outline" className="bg-orange-500/10">
                      Low
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">All cities have adequate supply</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Businesses */}
      <Card>
        <CardHeader>
          <CardTitle>Recently Added Businesses</CardTitle>
        </CardHeader>
        <CardContent>
          {adminStats.recentBusinesses.length > 0 ? (
            <div className="space-y-2">
              {adminStats.recentBusinesses.map((business) => (
                <div
                  key={business.id}
                  className="flex items-center justify-between p-3 hover:bg-muted rounded-lg"
                >
                  <div>
                    <div className="font-medium">{business.name}</div>
                    <div className="text-sm text-muted-foreground">{business.email}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>
                      {business.registrationStatus || 'NOT_REGISTERED'}
                    </Badge>
                    <Link href={`/admin/businesses/${business.id}`}>
                      <Badge variant="outline">View</Badge>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No businesses added in the last 7 days</p>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/businesses">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
            <CardHeader>
              <CardTitle>Manage Businesses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">View and manage all rental businesses</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/vehicles">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
            <CardHeader>
              <CardTitle>Manage Vehicles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">View and manage all vehicles</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/bookings">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
            <CardHeader>
              <CardTitle>Manage Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">View and manage all bookings</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}

