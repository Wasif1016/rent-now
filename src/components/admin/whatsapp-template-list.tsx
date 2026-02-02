'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  MoreVertical,
  Edit,
  Trash2,
  Copy,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DeleteWhatsAppTemplateModal } from '@/components/admin/delete-whatsapp-template-modal'

interface WhatsAppTemplate {
  id: string
  name: string
  body: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface WhatsAppTemplateListProps {
  templates: WhatsAppTemplate[]
}

export function WhatsAppTemplateList({ templates }: WhatsAppTemplateListProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState<{ id: string; name: string } | null>(null)

  const openDeleteModal = (id: string, name: string) => {
    setTemplateToDelete({ id, name })
    setDeleteModalOpen(true)
  }

  if (templates.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground mb-4">No WhatsApp templates found</p>
          <Link href="/admin/whatsapp-templates/new">
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
                  <Link href={`/admin/whatsapp-templates/${template.id}/edit`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/admin/whatsapp-templates/new?duplicate=${template.id}`}>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onSelect={(e) => {
                    e.preventDefault()
                    openDeleteModal(template.id, template.name)
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-2">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Message preview</label>
                <p className="text-sm mt-1 line-clamp-3 whitespace-pre-wrap">
                  {template.body || '(empty)'}
                </p>
              </div>
              <div className="text-xs text-muted-foreground pt-2 border-t">
                Updated {new Date(template.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {templateToDelete && (
        <DeleteWhatsAppTemplateModal
          open={deleteModalOpen}
          onOpenChange={setDeleteModalOpen}
          templateId={templateToDelete.id}
          templateName={templateToDelete.name}
        />
      )}
    </div>
  )
}
