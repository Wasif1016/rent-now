'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { AlertTriangle } from 'lucide-react'

interface DeleteBusinessModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Single delete: pass one id and one name */
  businessId?: string
  businessName?: string
  /** Bulk delete: pass arrays (takes precedence over single) */
  businessIds?: string[]
  businessNames?: string[]
}

export function DeleteBusinessModal({
  open,
  onOpenChange,
  businessId,
  businessName,
  businessIds,
  businessNames,
}: DeleteBusinessModalProps) {
  const { session } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isBulk = Array.isArray(businessIds) && businessIds.length > 0
  const ids = isBulk ? businessIds! : businessId ? [businessId] : []
  const names = isBulk ? businessNames! : businessName ? [businessName] : []
  const count = ids.length

  const handleDelete = async () => {
    if (!session?.access_token) {
      setError('You must be logged in to delete businesses')
      return
    }
    if (ids.length === 0) return

    setLoading(true)
    setError(null)

    try {
      if (ids.length === 1) {
        const response = await fetch(`/api/admin/businesses/${ids[0]}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
        })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Failed to delete business')
      } else {
        const response = await fetch('/api/admin/businesses/bulk-delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ ids }),
        })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Failed to delete businesses')
        if (data.results?.some((r: { success: boolean }) => !r.success)) {
          const failed = data.results.filter((r: { success: boolean }) => !r.success)
          throw new Error(`${failed.length} business(es) could not be deleted`)
        }
      }

      onOpenChange(false)
      router.refresh()
      router.push('/admin/businesses')
    } catch (err: any) {
      setError(err.message || 'Failed to delete business')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete Business
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete{' '}
            {count === 1 ? (
              <strong>{names[0]}</strong>
            ) : (
              <strong>{count} businesses</strong>
            )}{' '}
            and all associated data including:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>• All vehicles associated with this business</li>
              <li>• All bookings and inquiries</li>
              <li>• All routes created by this business</li>
              <li>• The vendor account in Supabase (if exists)</li>
              <li>• All activity logs related to this business</li>
            </ul>
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? (count > 1 ? 'Deleting...' : 'Deleting...') : count > 1 ? `Delete ${count} businesses` : 'Delete Permanently'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

