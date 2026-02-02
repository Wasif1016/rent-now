import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { EmailTemplateForm } from '@/components/admin/email-template-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditEmailTemplatePage({ params }: PageProps) {
  const { id } = await params

  const template = await prisma.emailTemplate.findUnique({
    where: { id },
  })

  if (!template) {
    notFound()
  }

  const variables = (template.variables as string[] | null) ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/email-templates">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Email Template</h1>
          <p className="text-muted-foreground mt-1">
            Update {template.name}
          </p>
        </div>
      </div>

      <EmailTemplateForm
        template={{
          id: template.id,
          name: template.name,
          subject: template.subject,
          body: template.body,
          variables,
          isActive: template.isActive,
        }}
      />
    </div>
  )
}
