'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/contexts/auth-context'

const AVAILABLE_VARIABLES = [
  'business_name',
  'email',
  'password',
  'login_url',
]

interface WhatsAppTemplateFormProps {
  template?: {
    id?: string
    name: string
    body: string
    isActive: boolean
  }
}

export function WhatsAppTemplateForm({ template }: WhatsAppTemplateFormProps) {
  const router = useRouter()
  const { session } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: template?.name || '',
    body: template?.body || '',
    isActive: template?.isActive ?? true,
  })

  const handleInsertVariable = (variable: string) => {
    const textarea = document.getElementById('whatsapp-body') as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const text = formData.body
      const before = text.substring(0, start)
      const after = text.substring(end)
      const newText = before + `{{${variable}}}` + after
      setFormData({ ...formData, body: newText })
      setTimeout(() => {
        textarea.focus()
        const pos = start + variable.length + 4
        textarea.setSelectionRange(pos, pos)
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
        ? `/api/admin/whatsapp-templates/${template.id}`
        : '/api/admin/whatsapp-templates'
      const method = template?.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to save template')

      router.push('/admin/whatsapp-templates')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save template')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {template?.id ? 'Edit WhatsApp Template' : 'Create WhatsApp Template'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="whatsapp-name">Template Name *</Label>
            <Input
              id="whatsapp-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Vendor credentials"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp-body">Message (plain text) *</Label>
            <Textarea
              id="whatsapp-body"
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              placeholder={`Hi {{business_name}},\n\nYour login:\nEmail: {{email}}\nPassword: {{password}}\n\n{{login_url}}`}
              rows={14}
              className="font-mono text-sm whitespace-pre-wrap"
              required
            />
            <p className="text-xs text-muted-foreground">
              Line breaks are preserved when sent to WhatsApp. Use variables:{' '}
              {AVAILABLE_VARIABLES.map((v) => `{{${v}}}`).join(', ')}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Insert variable</Label>
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
