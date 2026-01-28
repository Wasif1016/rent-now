'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Copy,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  isActive: boolean
  variables: any
  createdAt: Date
  updatedAt: Date
}

interface EmailTemplateListProps {
  templates: EmailTemplate[]
}

export function EmailTemplateList({ templates }: EmailTemplateListProps) {
  if (templates.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground mb-4">No email templates found</p>
          <Link href="/admin/email-templates/new">
            <Button>Create First Template</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <Card key={template.id} className="flex flex-col">
          <CardHeader className="flex flex-row items-start justify-between">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                {template.name}
                {template.isActive ? (
                  <Badge className="bg-green-500">Active</Badge>
                ) : (
                  <Badge variant="outline">Inactive</Badge>
                )}
              </CardTitle>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/admin/email-templates/${template.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/admin/email-templates/${template.id}/edit`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-2">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Subject</label>
                <p className="text-sm mt-1">{template.subject}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Variables</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {Array.isArray(template.variables) &&
                    template.variables.map((variable: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {`{{${variable}}}`}
                      </Badge>
                    ))}
                </div>
              </div>
              <div className="text-xs text-muted-foreground pt-2 border-t">
                Updated {new Date(template.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

