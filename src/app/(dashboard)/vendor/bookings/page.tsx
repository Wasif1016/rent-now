export default function VendorBookingsPage() {
  // Bookings are handled manually for now. Keep this page as a simple notice to avoid 404s.
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold mb-4">Bookings</h1>
        <p className="text-muted-foreground">
          The online booking system is temporarily disabled while we move to a simple, fully manual
          process. Customers will contact you directly via phone or WhatsApp from your vehicle
          pages.
        </p>
      </div>
    </div>
  )
}

