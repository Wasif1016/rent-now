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

interface DeleteWhatsAppTemplateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  templateId: string
  templateName: string
}

export function DeleteWhatsAppTemplateModal({
  open,
  onOpenChange,
  templateId,
  templateName,
}: DeleteWhatsAppTemplateModalProps) {
  const { session } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!session?.access_token) {
      setError('You must be logged in to delete templates')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/whatsapp-templates/${templateId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to delete template')

      onOpenChange(false)
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete template')
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
            Delete WhatsApp Template
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the template{' '}
            <strong>{templateName}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
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
              {loading ? 'Deleting...' : 'Delete Permanently'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
