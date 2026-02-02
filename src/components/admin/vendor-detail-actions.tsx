'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageCircle } from 'lucide-react'
import { SendWhatsAppModal } from './send-whatsapp-modal'

interface Vendor {
  id: string
  name: string
  email: string | null
  phone: string | null
  whatsappPhone?: string | null
  registrationStatus?: string | null
}

interface VendorDetailActionsProps {
  vendor: Vendor
}

export function VendorDetailActions({ vendor }: VendorDetailActionsProps) {
  const [sendWhatsAppModalOpen, setSendWhatsAppModalOpen] = useState(false)
  const hasPhone = Boolean(vendor.whatsappPhone || vendor.phone)

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Quick actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {hasPhone && (
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => setSendWhatsAppModalOpen(true)}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Send WhatsApp
            </Button>
          )}
        </CardContent>
      </Card>

      <SendWhatsAppModal
        open={sendWhatsAppModalOpen}
        onOpenChange={setSendWhatsAppModalOpen}
        businessId={vendor.id}
        businessName={vendor.name}
        businessPhone={vendor.whatsappPhone || vendor.phone}
        businessEmail={vendor.email}
        registrationStatus={vendor.registrationStatus}
      />
    </>
  )
}
