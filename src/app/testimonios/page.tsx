import Navigation from "@/components/UI/Navigation";
import Footer from "@/components/sections/Footer";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import WhatsAppButton from "@/components/UI/WhatsAppButton";

export default function TestimoniosPage() {
  return (
    <>
      <Navigation />
      <main className="w-full">
        <section id="testimonials" className="pt-20">
          <TestimonialsSection />
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
