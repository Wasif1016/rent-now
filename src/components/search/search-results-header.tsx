interface SearchResultsHeaderProps {
  city?: string
  total: number
  showing: number
}

export function SearchResultsHeader({
  city,
  total,
  showing,
}: SearchResultsHeaderProps) {
  const getTitle = () => {
    if (city) {
      return `Rent Cars in ${city}`
    }
    return 'Available Vehicles'
  }

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-serif font-semibold mb-2">{getTitle()}</h1>
      <p className="text-muted-foreground">
        {total > 0 ? (
          <>
            Showing <span className="font-semibold">{showing}</span> of{' '}
            <span className="font-semibold">{total}</span> vehicles
          </>
        ) : (
          'No vehicles found'
        )}
      </p>
    </div>
  )
}
