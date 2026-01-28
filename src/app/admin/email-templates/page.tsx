import { prisma } from '@/lib/prisma'
import { EmailTemplateList } from '@/components/admin/email-template-list'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function EmailTemplatesPage() {
  const templates = await prisma.emailTemplate.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Email Templates</h1>
          <p className="text-muted-foreground mt-1">
            Manage email templates for vendor credentials and notifications
          </p>
        </div>
        <Link href="/admin/email-templates/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </Link>
      </div>

      <EmailTemplateList templates={templates} />
    </div>
  )
}

