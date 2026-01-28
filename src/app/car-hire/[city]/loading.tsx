export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-zinc-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <div className="h-96 bg-zinc-200 rounded"></div>
            </aside>
            <main className="lg:col-span-3">
              <div className="h-12 bg-zinc-200 rounded mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-80 bg-zinc-200 rounded"></div>
                ))}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}

