import { MapPin, CreditCard, Car } from 'lucide-react'

export function HowItWorks() {
  const steps = [
    {
      icon: MapPin,
      title: 'Choose Your City & Vehicle',
      description: 'Browse cars, Hiace, vans, or buses available in your city.',
    },
    {
      icon: CreditCard,
      title: 'Pay Small Advance',
      description: 'Pay a small advance to confirm availability and pricing.',
    },
    {
      icon: Car,
      title: 'Get Vehicle Delivered',
      description: 'Our team confirms your booking and connects you with the rental company.',
    },
  ]

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            How Booking Works
          </h2>
          <p className="text-lg text-gray-600">3 Simple Steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div
                key={index}
                className="bg-white rounded-lg p-6 lg:p-8 shadow-md hover:shadow-lg transition-shadow border border-gray-100"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-green-accent/10 flex items-center justify-center mb-4">
                    <Icon className="h-8 w-8 text-green-accent" />
                  </div>
                  <div className="mb-2">
                    <span className="text-sm font-semibold text-green-accent">Step {index + 1}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

