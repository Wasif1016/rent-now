'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  MoreVertical,
  Eye,
  Edit,
  Mail,
  UserPlus,
  Ban,
  CheckCircle,
  Trash2,
} from 'lucide-react'
import { CreateAccountModal } from './create-account-modal'
import { SendEmailModal } from './send-email-modal'
import { DeleteBusinessModal } from './delete-business-modal'

type RegistrationStatus = 'NOT_REGISTERED' | 'ACCOUNT_CREATED' | 'EMAIL_SENT' | 'ACTIVE' | 'SUSPENDED'

interface Business {
  id: string
  name: string
  email: string | null
  phone: string | null
  town: string | null
  province: string | null
  registrationStatus: RegistrationStatus | null
  isActive: boolean | null
  _count: {
    vehicles: number
    bookings: number
  }
}

interface BusinessTableProps {
  businesses: Business[]
  total: number
  totalPages: number
  currentPage: number
}

function getStatusBadge(status: RegistrationStatus | null) {
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

export function BusinessTable({
  businesses,
  total,
  totalPages,
  currentPage,
}: BusinessTableProps) {
  const router = useRouter()
  const [createAccountModalOpen, setCreateAccountModalOpen] = useState(false)
  const [sendEmailModalOpen, setSendEmailModalOpen] = useState(false)
  const [deleteBusinessModalOpen, setDeleteBusinessModalOpen] = useState(false)
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)

  // Refresh when modals close after successful operations
  const handleModalClose = (modalType: 'create' | 'email' | 'delete') => {
    if (modalType === 'create') {
      setCreateAccountModalOpen(false)
    } else if (modalType === 'email') {
      setSendEmailModalOpen(false)
    } else if (modalType === 'delete') {
      setDeleteBusinessModalOpen(false)
    }
    setSelectedBusiness(null)
    // Refresh to get updated business status
    router.refresh()
  }

  return (
    <>
      <div className="bg-card rounded-lg border border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-semibold text-sm">Business Name</th>
                <th className="text-left p-4 font-semibold text-sm">Email</th>
                <th className="text-left p-4 font-semibold text-sm">Phone</th>
                <th className="text-left p-4 font-semibold text-sm">Town</th>
                <th className="text-left p-4 font-semibold text-sm">City</th>
                <th className="text-left p-4 font-semibold text-sm">Status</th>
                <th className="text-left p-4 font-semibold text-sm">Vehicles</th>
                <th className="text-right p-4 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {businesses.map((business) => (
                <tr
                  key={business.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="p-4">
                    <div className="font-medium">{business.name}</div>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {business.email || 'N/A'}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {business.phone || 'N/A'}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {business.town || 'N/A'}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {business.province || 'N/A'}
                  </td>
                  <td className="p-4">{getStatusBadge(business.registrationStatus)}</td>
                  <td className="p-4">
                    <span className="text-muted-foreground">
                      {business._count.vehicles}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/businesses/${business.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/businesses/${business.id}/edit`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          {business.registrationStatus === 'NOT_REGISTERED' && (
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedBusiness(business)
                                setCreateAccountModalOpen(true)
                              }}
                            >
                              <UserPlus className="h-4 w-4 mr-2" />
                              Create Account
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedBusiness(business)
                              setSendEmailModalOpen(true)
                            }}
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          {business.isActive ? (
                            <DropdownMenuItem>
                              <Ban className="h-4 w-4 mr-2" />
                              Suspend
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Activate
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              setSelectedBusiness(business)
                              setDeleteBusinessModalOpen(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              Showing {businesses.length} of {total} businesses
            </div>
            <div className="flex gap-2">
              {currentPage > 1 && (
                <Link href={`/admin/businesses?page=${currentPage - 1}`}>
                  <Button variant="outline" size="sm">
                    Previous
                  </Button>
                </Link>
              )}
              <span className="flex items-center px-4 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              {currentPage < totalPages && (
                <Link href={`/admin/businesses?page=${currentPage + 1}`}>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedBusiness && (
        <>
          <CreateAccountModal
            open={createAccountModalOpen}
            onOpenChange={(open) => {
              if (!open) {
                handleModalClose('create')
              } else {
                setCreateAccountModalOpen(true)
              }
            }}
            businessId={selectedBusiness.id}
            businessName={selectedBusiness.name}
            businessEmail={selectedBusiness.email || ''}
          />
          <SendEmailModal
            open={sendEmailModalOpen}
            onOpenChange={(open) => {
              if (!open) {
                handleModalClose('email')
              } else {
                setSendEmailModalOpen(true)
              }
            }}
            businessId={selectedBusiness.id}
            businessName={selectedBusiness.name}
            businessEmail={selectedBusiness.email || ''}
            registrationStatus={selectedBusiness.registrationStatus}
          />
          <DeleteBusinessModal
            open={deleteBusinessModalOpen}
            onOpenChange={(open) => {
              if (!open) {
                handleModalClose('delete')
              } else {
                setDeleteBusinessModalOpen(true)
              }
            }}
            businessId={selectedBusiness.id}
            businessName={selectedBusiness.name}
          />
        </>
      )}
    </>
  )
}

