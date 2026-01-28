'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LogIn,
  RefreshCw,
  Lock,
  FileText,
  Ban,
  CheckCircle,
  Mail,
  UserPlus,
} from 'lucide-react'
import { CreateAccountModal } from './create-account-modal'
import { SendEmailModal } from './send-email-modal'
import { useAuth } from '@/contexts/auth-context'

interface Business {
  id: string
  name: string
  email: string | null
  registrationStatus: string | null
  isActive: boolean | null
  supabaseUserId: string | null
}

interface BusinessDetailActionsProps {
  business: Business
}

export function BusinessDetailActions({ business }: BusinessDetailActionsProps) {
  const router = useRouter()
  const { session } = useAuth()
  const [loading, setLoading] = useState(false)
  const [createAccountModalOpen, setCreateAccountModalOpen] = useState(false)
  const [sendEmailModalOpen, setSendEmailModalOpen] = useState(false)

  const handleSuspend = async () => {
    if (!session?.access_token) {
      alert('You must be logged in to perform this action')
      return
    }

    if (!confirm(`Are you sure you want to ${business.isActive ? 'suspend' : 'activate'} this business?`)) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/businesses/${business.id}/${business.isActive ? 'suspend' : 'activate'}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('Failed to update business status')
      }
    } catch (error) {
      alert('Error updating business status')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!session?.access_token) {
      alert('You must be logged in to perform this action')
      return
    }

    if (!confirm('Are you sure you want to reset the password? A new password will be generated.')) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/businesses/${business.id}/reset-password`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })

      const data = await response.json()

      if (response.ok) {
        alert(`New password: ${data.password}\n\nPlease save this password securely.`)
        router.refresh()
      } else {
        alert(data.error || 'Failed to reset password')
      }
    } catch (error) {
      alert('Error resetting password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {business.registrationStatus === 'NOT_REGISTERED' && (
            <Button
              className="w-full justify-start"
              onClick={() => setCreateAccountModalOpen(true)}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Create Account
            </Button>
          )}

          {business.registrationStatus === 'ACCOUNT_CREATED' && (
            <Button
              className="w-full justify-start"
              variant="default"
              onClick={() => setSendEmailModalOpen(true)}
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          )}

          {business.supabaseUserId && (
            <>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={handleResetPassword}
                disabled={loading}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset Password
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                asChild
              >
                <a href={`/vendor`} target="_blank">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login as Vendor
                </a>
              </Button>
            </>
          )}

          <Button
            className="w-full justify-start"
            variant="outline"
            asChild
          >
            <a href={`/api/admin/businesses/${business.id}/logs`} target="_blank">
              <Lock className="h-4 w-4 mr-2" />
              Access Logs
            </a>
          </Button>

          <Button
            className="w-full justify-start"
            variant="outline"
            asChild
          >
            <a href={`/api/admin/businesses/${business.id}/statement`} target="_blank">
              <FileText className="h-4 w-4 mr-2" />
              Ledger Statement
            </a>
          </Button>

          <Button
            className="w-full justify-start"
            variant={business.isActive ? 'destructive' : 'default'}
            onClick={handleSuspend}
            disabled={loading}
          >
            {business.isActive ? (
              <>
                <Ban className="h-4 w-4 mr-2" />
                Suspend Account
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Activate Account
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Modals */}
      <CreateAccountModal
        open={createAccountModalOpen}
        onOpenChange={setCreateAccountModalOpen}
        businessId={business.id}
        businessName={business.name}
        businessEmail={business.email || ''}
      />
      <SendEmailModal
        open={sendEmailModalOpen}
        onOpenChange={setSendEmailModalOpen}
        businessId={business.id}
        businessName={business.name}
        businessEmail={business.email || ''}
      />
    </>
  )
}

