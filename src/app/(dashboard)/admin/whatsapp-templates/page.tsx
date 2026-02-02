import { prisma } from '@/lib/prisma'
import { WhatsAppTemplateList } from '@/components/admin/whatsapp-template-list'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function WhatsAppTemplatesPage() {
  const delegate = prisma.whatsAppTemplate
  if (!delegate) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">WhatsApp Templates</h1>
          <p className="text-muted-foreground mt-1">
            Create message templates for WhatsApp. Line breaks in the template
            are preserved when sent.
          </p>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              WhatsApp templates are not available yet. Run{' '}
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm">
                npx prisma generate
              </code>{' '}
              then restart the dev server. If you just added the migration, run{' '}
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm">
                npx prisma migrate deploy
              </code>{' '}
              as well.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const templates = await delegate.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">WhatsApp Templates</h1>
          <p className="text-muted-foreground mt-1">
            Create message templates for WhatsApp. Line breaks in the template
            are preserved when sent.
          </p>
        </div>
        <Link href="/admin/whatsapp-templates/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </Link>
      </div>

      <WhatsAppTemplateList templates={templates} />
    </div>
  )
}
