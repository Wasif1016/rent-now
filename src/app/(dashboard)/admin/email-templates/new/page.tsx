import { EmailTemplateForm } from '@/components/admin/email-template-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

interface PageProps {
  searchParams: Promise<{ duplicate?: string }>
}

export default async function NewEmailTemplatePage({ searchParams }: PageProps) {
  const { duplicate: duplicateId } = await searchParams

  let initialTemplate: {
    id?: string
    name: string
    subject: string
    body: string
    variables: string[]
    isActive: boolean
  } | undefined

  if (duplicateId) {
    const source = await prisma.emailTemplate.findUnique({
      where: { id: duplicateId },
    })
    if (source) {
      const variables = (source.variables as string[] | null) ?? []
      initialTemplate = {
        name: `Copy of ${source.name}`,
        subject: source.subject,
        body: source.body,
        variables,
        isActive: source.isActive,
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/email-templates">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {initialTemplate ? 'Duplicate Email Template' : 'Create Email Template'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {initialTemplate
              ? 'Create a new template from an existing one'
              : 'Create a new email template for vendor communications'}
          </p>
        </div>
      </div>

      <EmailTemplateForm template={initialTemplate} />
    </div>
  )
}

