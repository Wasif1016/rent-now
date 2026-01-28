import { EmailTemplateForm } from '@/components/admin/email-template-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewEmailTemplatePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/email-templates">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create Email Template</h1>
          <p className="text-muted-foreground mt-1">
            Create a new email template for vendor communications
          </p>
        </div>
      </div>

      <EmailTemplateForm />
    </div>
  )
}

