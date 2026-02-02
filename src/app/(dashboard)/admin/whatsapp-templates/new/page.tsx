import { WhatsAppTemplateForm } from '@/components/admin/whatsapp-template-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

interface PageProps {
  searchParams: Promise<{ duplicate?: string }>
}

export default async function NewWhatsAppTemplatePage({ searchParams }: PageProps) {
  const { duplicate: duplicateId } = await searchParams

  let initialTemplate:
    | { id?: string; name: string; body: string; isActive: boolean }
    | undefined

  if (duplicateId) {
    const source = await prisma.whatsAppTemplate.findUnique({
      where: { id: duplicateId },
    })
    if (source) {
      initialTemplate = {
        name: `Copy of ${source.name}`,
        body: source.body,
        isActive: source.isActive,
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/whatsapp-templates">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {initialTemplate ? 'Duplicate WhatsApp Template' : 'Create WhatsApp Template'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {initialTemplate
              ? 'Create a new template from an existing one'
              : 'Plain text message template. Line breaks are preserved when sent to WhatsApp.'}
          </p>
        </div>
      </div>

      <WhatsAppTemplateForm template={initialTemplate} />
    </div>
  )
}
