import HeroSection from "@/components/sections/HeroSection";
import AboutUsSection from "@/components/sections/AboutUsSection";
import ServicesSection from "@/components/sections/ServicesSection";
import ContactFormSection from "@/components/sections/ContactFormSection";
import Navigation from "@/components/UI/Navigation";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="overflow-x-hidden">
        <section id="home">
          <HeroSection />
        </section>
        <section id="about">
          <AboutUsSection />
        </section>
        <section id="services">
          <ServicesSection />
        </section>
        <section id="contact">
          <ContactFormSection />
        </section>
      </main>
      <Footer />
    </>
  );
}
