'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

interface EmailTemplateFormProps {
  /** When id is present, form updates existing template; when omitted (e.g. duplicate), form creates new */
  template?: {
    id?: string
    name: string
    subject: string
    body: string
    variables: string[]
    isActive: boolean
  }
}

const AVAILABLE_VARIABLES = [
  'business_name',
  'email',
  'password',
  'login_url',
  'vendor_name',
  'contact_person',
]

export function EmailTemplateForm({ template }: EmailTemplateFormProps) {
  const router = useRouter()
  const { session } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: template?.name || '',
    subject: template?.subject || '',
    body: template?.body || '',
    variables: template?.variables || [] as string[],
    isActive: template?.isActive ?? true,
  })

  const handleAddVariable = (variable: string) => {
    if (!formData.variables.includes(variable)) {
      setFormData({
        ...formData,
        variables: [...formData.variables, variable],
      })
    }
  }

  const handleRemoveVariable = (variable: string) => {
    setFormData({
      ...formData,
      variables: formData.variables.filter((v) => v !== variable),
    })
  }

  const handleInsertVariable = (variable: string) => {
    const textarea = document.getElementById('body') as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const text = formData.body
      const before = text.substring(0, start)
      const after = text.substring(end)
      const newText = before + `{{${variable}}}` + after

      setFormData({
        ...formData,
        body: newText,
      })

      // Restore cursor position
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(
          start + variable.length + 4,
          start + variable.length + 4
        )
      }, 0)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session?.access_token) {
      setError('You must be logged in to save templates')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const url = template?.id
        ? `/api/admin/email-templates/${template.id}`
        : '/api/admin/email-templates'
      const method = template?.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          ...formData,
          variables: formData.variables,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save template')
      }

      router.push('/admin/email-templates')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to save template')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{template?.id ? 'Edit Email Template' : 'Create Email Template'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Template Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., VENDOR_WELCOME"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Email Subject *</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Welcome to Rent Now - Your Login Credentials"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Email Body *</Label>
            <Textarea
              id="body"
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              placeholder="Dear {{business_name}},&#10;&#10;Your account has been created..."
              rows={12}
              required
            />
            <p className="text-xs text-muted-foreground">
              Use variables like {`{{business_name}}`}, {`{{email}}`}, {`{{password}}`}, etc.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Available Variables</Label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_VARIABLES.map((variable) => (
                <Button
                  key={variable}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleInsertVariable(variable)}
                >
                  {`{{${variable}}}`}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Selected Variables (for documentation)</Label>
            <div className="flex flex-wrap gap-2">
              {formData.variables.length === 0 ? (
                <p className="text-sm text-muted-foreground">No variables selected</p>
              ) : (
                formData.variables.map((variable) => (
                  <Badge key={variable} variant="secondary" className="gap-1">
                    {`{{${variable}}}`}
                    <button
                      type="button"
                      onClick={() => handleRemoveVariable(variable)}
                      className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : template?.id ? 'Update Template' : 'Create Template'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

