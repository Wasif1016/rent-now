'use client'

import { Badge } from '@/components/ui/badge'

function formatDistanceToNow(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
  return date.toLocaleDateString()
}
import {
  UserPlus,
  Mail,
  RefreshCw,
  Ban,
  CheckCircle,
  Edit,
  FileUp,
  Car,
  Route,
} from 'lucide-react'

interface ActivityLog {
  id: string
  action: string
  entityType: string
  entityId: string
  adminUserId: string | null
  details: any
  createdAt: Date
}

interface ActivityLogViewerProps {
  logs: ActivityLog[]
}

function getActionIcon(action: string) {
  switch (action) {
    case 'ACCOUNT_CREATED':
      return <UserPlus className="h-4 w-4" />
    case 'EMAIL_SENT':
      return <Mail className="h-4 w-4" />
    case 'PASSWORD_RESET':
      return <RefreshCw className="h-4 w-4" />
    case 'VENDOR_SUSPENDED':
      return <Ban className="h-4 w-4" />
    case 'VENDOR_ACTIVATED':
      return <CheckCircle className="h-4 w-4" />
    case 'VENDOR_UPDATED':
      return <Edit className="h-4 w-4" />
    case 'CSV_IMPORTED':
      return <FileUp className="h-4 w-4" />
    case 'VEHICLE_DISABLED':
    case 'VEHICLE_APPROVED':
      return <Car className="h-4 w-4" />
    case 'ROUTE_CREATED':
    case 'ROUTE_UPDATED':
      return <Route className="h-4 w-4" />
    default:
      return null
  }
}

function getActionColor(action: string) {
  if (action.includes('CREATED') || action.includes('ACTIVATED') || action.includes('APPROVED')) {
    return 'text-green-500'
  }
  if (action.includes('SUSPENDED') || action.includes('DISABLED')) {
    return 'text-red-500'
  }
  if (action.includes('EMAIL') || action.includes('SENT')) {
    return 'text-blue-500'
  }
  return 'text-gray-500'
}

export function ActivityLogViewer({ logs }: ActivityLogViewerProps) {
  if (logs.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No activity logs yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {logs.map((log) => {
        const Icon = getActionIcon(log.action)
        const color = getActionColor(log.action)

        return (
          <div
            key={log.id}
            className="flex items-start gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className={`mt-0.5 ${color}`}>
              {Icon || <div className="w-4 h-4 rounded-full bg-muted" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{log.action.replace(/_/g, ' ')}</span>
                {log.details && typeof log.details === 'object' && (
                  <span className="text-sm text-muted-foreground">
                    {log.details.vendorName || log.details.email || ''}
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                {log.adminUserId && ` • Admin ID: ${log.adminUserId.slice(0, 8)}...`}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

