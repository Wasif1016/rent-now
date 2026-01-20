import { Check } from 'lucide-react'

const benefits = [
  'Verified rental companies only',
  'No full payment online',
  'Manual confirmation by our team',
  'Available in small cities & towns',
  'Support before and after booking',
]

export function WhyChooseUs() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Why Book Through Our Platform?
            </h2>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-accent/10 flex items-center justify-center mt-0.5">
                    <Check className="h-4 w-4 text-green-accent" />
                  </div>
                  <p className="text-lg text-gray-700">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Subtle Illustration/Pattern */}
          <div className="hidden lg:block">
            <div className="relative w-full h-64 bg-gradient-to-br from-green-accent/10 to-navy/10 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-green-accent/20 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-green-accent"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 font-medium">Trusted Platform</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

