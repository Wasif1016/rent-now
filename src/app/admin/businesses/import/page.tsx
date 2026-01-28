'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'

interface ImportError {
  row: number
  error: string
  data: any
}

export default function ImportPage() {
  const router = useRouter()
  const { session, loading: authLoading } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    success: number
    errors: ImportError[]
    total: number
  } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setResult(null)
    }
  }

  const handleImport = async () => {
    if (!file) return

    if (!session?.access_token) {
      setResult({
        success: 0,
        errors: [{ row: 0, error: 'You must be logged in to import businesses', data: {} }],
        total: 0,
      })
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/businesses/import', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Import failed')
      }

      setResult(data)
    } catch (error: any) {
      setResult({
        success: 0,
        errors: [{ row: 0, error: error.message || 'Failed to import businesses', data: {} }],
        total: 0,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Import Businesses</h1>
          <p className="text-muted-foreground mt-1">
            Upload a CSV file to import rental businesses
          </p>
        </div>
        <Link href="/admin/businesses">
          <Button variant="outline">Back to Businesses</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>CSV Import</CardTitle>
          <CardDescription>
            Upload a CSV file with business information. Required columns: business_name, email, city
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <div className="space-y-2">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-primary hover:underline">Click to upload</span>
                <span className="text-muted-foreground"> or drag and drop</span>
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground">
                CSV files only (max 10MB)
              </p>
            </div>
            {file && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">{file.name}</span>
                <button
                  onClick={() => setFile(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">CSV Format</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Your CSV should include the following columns:
            </p>
            <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
              <li><strong>business_name</strong> (required) - Name of the rental business</li>
              <li><strong>email</strong> (required) - Business email address</li>
              <li><strong>phone</strong> (optional) - Contact phone number</li>
              <li><strong>town</strong> (optional) - Town/locality</li>
              <li><strong>city</strong> (required) - City name</li>
              <li><strong>province</strong> (optional) - Province name</li>
              <li><strong>google_maps_url</strong> (optional) - Google Maps URL</li>
            </ul>
          </div>

          <Button
            onClick={handleImport}
            disabled={!file || loading || authLoading || !session}
            className="w-full"
          >
            {loading ? 'Importing...' : authLoading ? 'Loading...' : !session ? 'Please log in' : 'Import Businesses'}
          </Button>

          {result && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold">{result.success} businesses imported</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Out of {result.total} total rows
                  </p>
                </div>
                {result.errors.length > 0 && (
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-semibold">{result.errors.length} errors</span>
                  </div>
                )}
              </div>

              {result.errors.length > 0 && (
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="bg-muted p-3 border-b border-border">
                    <h3 className="font-semibold">Import Errors</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left p-2">Row</th>
                          <th className="text-left p-2">Error</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.errors.map((error, idx) => (
                          <tr key={idx} className="border-b border-border">
                            <td className="p-2 font-mono">{error.row}</td>
                            <td className="p-2 text-destructive">{error.error}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {result.success > 0 && (
                <div className="flex justify-end">
                  <Link href="/admin/businesses">
                    <Button>View Businesses</Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

