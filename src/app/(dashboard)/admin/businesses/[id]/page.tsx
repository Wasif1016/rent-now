import { notFound } from 'next/navigation'
import { getBusinessById } from '@/lib/services/business.service'
import { getActivityLogs } from '@/lib/services/activity-log.service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Car,
  Route,
  CheckCircle2,
  XCircle,
  Clock,
  Edit,
  ArrowLeft,
  User,
  ExternalLink,
} from 'lucide-react'
import { BusinessDetailActions } from '@/components/admin/business-detail-actions'
import { BusinessVehiclesList } from '@/components/admin/business-vehicles-list'
import { ActivityLogViewer } from '@/components/admin/activity-log-viewer'
import { buildWhatsAppChatLink } from '@/lib/whatsapp'

interface PageProps {
  params: Promise<{ id: string }>
}

function getStatusBadge(status: string | null) {
  switch (status) {
    case 'NOT_REGISTERED':
      return <Badge variant="outline">Not Registered</Badge>
    case 'ACCOUNT_CREATED':
      return <Badge className="bg-blue-500">Account Created</Badge>
    case 'EMAIL_SENT':
      return <Badge className="bg-yellow-500">Email Sent</Badge>
    case 'ACTIVE':
      return <Badge className="bg-green-500">Active</Badge>
    case 'SUSPENDED':
      return <Badge variant="destructive">Suspended</Badge>
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

export default async function BusinessDetailPage({ params }: PageProps) {
  const { id } = await params
  const business = await getBusinessById(id)
  const activityLogs = await getActivityLogs('VENDOR', id, 50)

  if (!business) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/businesses">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground">{business.name}</h1>
              {getStatusBadge(business.registrationStatus)}
              {business.isActive ? (
                <Badge className="bg-green-500">Active</Badge>
              ) : (
                <Badge variant="destructive">Inactive</Badge>
              )}
            </div>
            <p className="text-muted-foreground mt-1">
              Business ID: {business.id.slice(0, 8)}...
            </p>
          </div>
        </div>
        <Link href={`/admin/businesses/${id}/edit`}>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Business Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Business Name</label>
                  <p className="mt-1 font-medium">{business.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <div className="mt-1 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p>{business.email || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <div className="mt-1 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {business.phone ? (
                      <a
                        href={buildWhatsAppChatLink(business.phone)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {business.phone}
                      </a>
                    ) : (
                      <p>N/A</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">WhatsApp</label>
                  <div className="mt-1 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {business.whatsappPhone ? (
                      <a
                        href={buildWhatsAppChatLink(business.whatsappPhone)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {business.whatsappPhone}
                      </a>
                    ) : (
                      <p>N/A</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Contact Person</label>
                  <div className="mt-1 flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <p>{business.personName || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Town</label>
                  <p className="mt-1">{business.town || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Province</label>
                  <p className="mt-1">{business.province || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Google Maps</label>
                  {business.googleMapsUrl ? (
                    <a
                      href={business.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 flex items-center gap-2 text-primary hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Location
                    </a>
                  ) : (
                    <p className="mt-1">N/A</p>
                  )}
                </div>
              </div>
              {business.address && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Address</label>
                  <div className="mt-1 flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <p>{business.address}</p>
                  </div>
                </div>
              )}
              {business.description && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="mt-1 text-sm">{business.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Vehicles</p>
                    <p className="text-2xl font-bold">{business._count.vehicles}</p>
                  </div>
                  <Car className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Routes</p>
                    <p className="text-2xl font-bold">{business._count.vendorRouteOffers}</p>
                  </div>
                  <Route className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Bookings</p>
                    <p className="text-2xl font-bold">{business._count.bookings}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Vehicles List */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Vehicles ({business._count.vehicles})</CardTitle>
              <Link href={`/admin/vehicles?vendor=${id}`}>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <BusinessVehiclesList vendorId={id} initialVehicles={business.vehicles} />
            </CardContent>
          </Card>

          {/* Activity Log */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityLogViewer logs={activityLogs} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Management Actions */}
          <BusinessDetailActions business={business} />

          {/* Account Status */}
          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Registration Status</label>
                <div className="mt-1">{getStatusBadge(business.registrationStatus)}</div>
              </div>
              {business.accountCreatedAt && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Account Created</label>
                  <div className="mt-1 flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p>{new Date(business.accountCreatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
              {business.emailSentAt && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email Sent</label>
                  <div className="mt-1 flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p>{new Date(business.emailSentAt).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Joined</label>
                <div className="mt-1 flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p>{business.createdAt ? new Date(business.createdAt).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

