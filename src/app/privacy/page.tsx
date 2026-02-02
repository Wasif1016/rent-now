import type { Metadata } from 'next'
import Link from 'next/link'
import { SeoFooter } from '@/components/home/seo-footer'

export const metadata: Metadata = {
  title: 'Privacy Policy | RentNow Pk',
  description:
    'Privacy Policy for RentNowPk. How we collect, use, protect, and share your information when you use our vehicle rental platform.',
}

export default function PrivacyPolicyPage() {
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
          Privacy Policy
        </h1>
        <p className="text-gray-400 text-sm mb-10">Last updated: 1 February 2026</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-8 text-gray-300">
          <p className="leading-relaxed">
            Welcome to RentNowPk. Your privacy is important to us, and this
            Privacy Policy explains how we collect, use, protect, and share your
            information when you use our website and services. By using our
            platform, you agree to the practices described in this policy.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">
              1. Information We Collect
            </h2>
            <p className="mb-4">
              We may collect the following types of information:
            </p>
            <h3 className="text-base font-medium text-white mb-2">
              a) Personal Information
            </h3>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Name</li>
              <li>Phone number</li>
              <li>Email address</li>
              <li>City and location details</li>
              <li>Booking details (vehicle type, date, route, etc.)</li>
            </ul>
            <h3 className="text-base font-medium text-white mb-2">
              b) Business Information (for vendors)
            </h3>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Business name</li>
              <li>Contact details</li>
              <li>Vehicle details</li>
              <li>Service areas</li>
            </ul>
            <h3 className="text-base font-medium text-white mb-2">
              c) Technical Information
            </h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>IP address</li>
              <li>Browser type</li>
              <li>Device information</li>
              <li>Pages visited and interactions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">
              2. How We Use Your Information
            </h2>
            <p className="mb-4">We use your information to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Process vehicle booking requests</li>
              <li>Connect users with rental businesses</li>
              <li>Contact users and vendors regarding bookings</li>
              <li>Improve platform performance and user experience</li>
              <li>Send booking confirmations and service-related communication</li>
              <li>Prevent fraud and misuse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">
              3. Sharing of Information
            </h2>
            <p className="mb-4">We do not sell your personal data.</p>
            <p className="mb-4">
              We may share information only with:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Rental businesses to fulfill bookings</li>
              <li>Service providers (email/SMS tools like Brevo)</li>
              <li>Legal authorities if required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">
              4. Payment Information
            </h2>
            <p className="leading-relaxed">
              Advance payments made through the platform are used to confirm
              bookings. We do not store sensitive payment details such as card
              numbers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">
              5. Cookies & Tracking
            </h2>
            <p className="mb-4">We may use cookies to:</p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Improve site functionality</li>
              <li>Analyze traffic and usage</li>
              <li>Enhance user experience</li>
            </ul>
            <p className="leading-relaxed">
              You can disable cookies in your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">
              6. Data Security
            </h2>
            <p className="mb-4">
              We take reasonable steps to protect your data from:
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Unauthorized access</li>
              <li>Loss or misuse</li>
              <li>Disclosure</li>
            </ul>
            <p className="leading-relaxed">
              However, no online platform can guarantee 100% security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">
              7. Third-Party Links
            </h2>
            <p className="leading-relaxed">
              Our platform may contain links to third-party websites. We are not
              responsible for their privacy practices.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">
              8. User Rights
            </h2>
            <p className="mb-4">You may request to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access your data</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion (subject to legal obligations)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">
              9. Changes to This Policy
            </h2>
            <p className="leading-relaxed">
              We may update this Privacy Policy from time to time. Changes will
              be posted on this page.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">
              10. Contact Us
            </h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy:
            </p>
            <ul className="list-none space-y-1">
              <li>
                <strong className="text-white">Email:</strong>{' '}
                <a
                  href="mailto:rentnowpk@gmail.com"
                  className="text-[#C0F11C] hover:underline"
                >
                  rentnowpk@gmail.com
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
      <SeoFooter />
    </main>
  )
}
