import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms & Conditions | RentNow Pk',
  description:
    'Terms and Conditions for using RentNowPk vehicle rental marketplace. Platform role, booking process, user and vendor responsibilities.',
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0f1419]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 max-w-3xl">
        <Link
          href="/"
          className="inline-block text-sm text-[#C0F11C] hover:underline mb-8"
        >
          ← Back to home
        </Link>

        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
          Terms & Conditions
        </h1>
        <p className="text-gray-400 text-sm mb-10">Last updated: 1 February 2026</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-8 text-gray-300">
          <p className="leading-relaxed">
            Welcome to RentNowPk. By accessing or using our platform, you agree
            to these Terms & Conditions. Please read them carefully.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">
              1. Platform Role
            </h2>
            <p className="mb-4">
              RentNowPk is a vehicle rental marketplace and lead-generation
              platform.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>We do not own vehicles</li>
              <li>We do not operate rental services directly</li>
              <li>We connect users with independent rental businesses</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">
              2. Booking Process
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Users submit booking requests through the platform</li>
              <li>A small advance payment may be required to confirm bookings</li>
              <li>Remaining payment is made directly to the rental provider</li>
              <li>Booking confirmation depends on availability</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">
              3. User Responsibilities
            </h2>
            <p className="mb-4">Users agree to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide accurate information</li>
              <li>Use the platform lawfully</li>
              <li>Communicate respectfully with vendors</li>
              <li>Follow rental provider terms during vehicle use</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">
              4. Vendor Responsibilities
            </h2>
            <p className="mb-4">Rental businesses agree to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide accurate vehicle and pricing information</li>
              <li>Honor confirmed bookings</li>
              <li>Comply with local laws and regulations</li>
              <li>Maintain vehicle condition and safety</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">
              5. Payments & Refunds
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Advance payments confirm bookings</li>
              <li>Refunds depend on cancellation timing and vendor policy</li>
              <li>Platform service fees may be non-refundable</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">
              6. Cancellations
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Cancellation terms vary by rental provider</li>
              <li>Users should confirm cancellation policies before booking</li>
              <li>The platform is not responsible for vendor-specific policies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">
              7. Limitation of Liability
            </h2>
            <p className="mb-4">RentNowPk is not responsible for:</p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Vehicle condition or performance</li>
              <li>Driver behavior</li>
              <li>Accidents, delays, or disputes</li>
              <li>Loss or damage during rental</li>
            </ul>
            <p className="leading-relaxed">
              All rentals are subject to agreement between user and vendor.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">
              8. Account Suspension
            </h2>
            <p className="mb-4">We reserve the right to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Suspend or terminate accounts</li>
              <li>Remove listings</li>
              <li>Restrict access for misuse or fraud</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">
              9. Intellectual Property
            </h2>
            <p className="leading-relaxed">
              All website content, branding, and design belong to RentNowPk.
              Unauthorized use is prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">
              10. Governing Law
            </h2>
            <p className="leading-relaxed">
              These Terms are governed by the laws of Pakistan.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">
              11. Changes to Terms
            </h2>
            <p className="leading-relaxed">
              We may update these Terms & Conditions at any time. Continued use
              means acceptance of updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">
              Contact Information
            </h2>
            <p className="mb-4">For questions or concerns:</p>
            <ul className="list-none space-y-1">
              <li>
                <strong className="text-white">Email:</strong>{' '}
                <a
                  href="mailto:help@rentnowpk.com"
                  className="text-[#C0F11C] hover:underline"
                >
                  help@rentnowpk.com
                </a>
              </li>
              <li>
                <strong className="text-white">Phone:</strong>{' '}
                <a
                  href="tel:+923144174625"
                  className="text-[#C0F11C] hover:underline"
                >
                  +92 314 4174625
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  )
}
