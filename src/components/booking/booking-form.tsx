'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface BookingFormProps {
  vehicleId: string
  vendorId: string
}

export function BookingForm({ vehicleId, vendorId }: BookingFormProps) {
  const [userName, setUserName] = useState('')
  const [userPhone, setUserPhone] = useState('')
  const [bookingDate, setBookingDate] = useState('')
  const [message, setMessage] = useState('')
  const [totalAmount, setTotalAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!userName || !userPhone) {
      setError('Please enter your name and phone number')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vehicleId,
          vendorId,
          userName,
          userPhone,
          bookingDate: bookingDate || undefined,
          message: message || undefined,
          totalAmount: totalAmount ? Number(totalAmount) : undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send booking request')
      }

      setSuccess('Your request has been sent. Our team will contact you shortly.')
      setUserName('')
      setUserPhone('')
      setBookingDate('')
      setMessage('')
      setTotalAmount('')
    } catch (err: any) {
      setError(err.message || 'Failed to send booking request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          {success}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Your Name *</Label>
        <Input
          id="name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="John Doe"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone (WhatsApp) *</Label>
        <Input
          id="phone"
          value={userPhone}
          onChange={(e) => setUserPhone(e.target.value)}
          placeholder="03xx xxxx xxx"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Preferred Date</Label>
        <Input
          id="date"
          type="date"
          value={bookingDate}
          onChange={(e) => setBookingDate(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Estimated Budget (optional)</Label>
        <Input
          id="amount"
          type="number"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
          placeholder="Total amount"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Additional Details (optional)</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Pick-up location, timing, trip details, etc."
          rows={3}
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-green-accent hover:bg-green-accent/90 text-white"
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Send Booking Request'}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Your details will be sent securely to our team by email. We will contact you to confirm the booking.
      </p>
    </form>
  )
}


