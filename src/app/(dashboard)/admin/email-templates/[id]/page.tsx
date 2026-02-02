import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Edit } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EmailTemplateViewPage({ params }: PageProps) {
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/email-templates">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              {template.name}
              {template.isActive ? (
                <Badge className="bg-green-500">Active</Badge>
              ) : (
                <Badge variant="outline">Inactive</Badge>
              )}
            </h1>
            <p className="text-muted-foreground mt-1">
              Preview email template
            </p>
          </div>
        </div>
        <Link href={`/admin/email-templates/${template.id}/edit`}>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit Template
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Subject</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-medium">{template.subject}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Variables</CardTitle>
        </CardHeader>
        <CardContent>
          {variables.length === 0 ? (
            <p className="text-sm text-muted-foreground">No variables defined</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {variables.map((variable: string, idx: number) => (
                <Badge key={idx} variant="outline">
                  {`{{${variable}}}`}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Body preview</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-sm whitespace-pre-wrap font-sans bg-muted/50 p-4 rounded-lg border overflow-x-auto">
            {template.body}
          </pre>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        Last updated {new Date(template.updatedAt).toLocaleString()}
      </p>
    </div>
  )
}
