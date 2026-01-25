import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import ContactFormSection from "@/components/sections/ContactFormSection";
import Navigation from "@/components/UI/Navigation";
import Footer from "@/components/sections/Footer";
import WhatsAppButton from "@/components/UI/WhatsAppButton";

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="w-full">
        <section id="home">
          <HeroSection />
        </section>
        <section id="services">
          <ServicesSection />
        </section>
        <section id="contact">
          <ContactFormSection />
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
