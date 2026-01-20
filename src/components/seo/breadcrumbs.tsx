import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (items.length <= 1) return null

  // Filter out items with invalid URLs
  const validItems = items.filter(item => item.url && typeof item.url === 'string')

  if (validItems.length <= 1) return null

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-sm text-muted-foreground">
        {validItems.map((item, index) => {
          const isLast = index === validItems.length - 1

          return (
            <li key={`${item.url}-${index}`} className="flex items-center gap-2">
              {index === 0 ? (
                <Link
                  href={item.url}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  <Home className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ) : (
                <>
                  <ChevronRight className="h-4 w-4" />
                  {isLast ? (
                    <span className="text-foreground font-medium">{item.name}</span>
                  ) : (
                    <Link
                      href={item.url}
                      className="hover:text-foreground transition-colors"
                    >
                      {item.name}
                    </Link>
                  )}
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

