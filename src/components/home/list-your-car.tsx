import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function ListYourCar() {
  return (
    <section className="py-16 lg:py-24 bg-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Own a Car Rental Business?
          </h2>
          <p className="text-lg lg:text-xl text-foreground/90 mb-8 max-w-2xl mx-auto">
            Get customers from your city without spending on ads. Rent My
            Vehicle and receive confirmed bookings.
          </p>
          <Link href="/auth/signup">
            <Button
              size="lg"
              className="bg-background text-foreground hover:bg-background/90 font-semibold px-8 py-6 text-lg rounded-none"
            >
              Rent Your Vehicle
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
