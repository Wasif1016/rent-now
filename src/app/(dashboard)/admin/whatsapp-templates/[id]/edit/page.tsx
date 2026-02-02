import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { WhatsAppTemplateForm } from '@/components/admin/whatsapp-template-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditWhatsAppTemplatePage({ params }: PageProps) {
  const { id } = await params

  const template = await prisma.whatsAppTemplate.findUnique({
    where: { id },
  })

  if (!template) {
    notFound()
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
          <h1 className="text-3xl font-bold text-foreground">Edit WhatsApp Template</h1>
          <p className="text-muted-foreground mt-1">
            Line breaks in the message are preserved when sent to WhatsApp.
          </p>
        </div>
      </div>

      <WhatsAppTemplateForm
        template={{
          id: template.id,
          name: template.name,
          body: template.body,
          isActive: template.isActive,
        }}
      />
    </div>
  )
}
