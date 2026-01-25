import Navigation from "@/components/UI/Navigation";
import Footer from "@/components/sections/Footer";
import AboutUsSection from "@/components/sections/AboutUsSection";
import WhyChooseUsSection from "@/components/sections/WhyChooseUsSection";
import WhatsAppButton from "@/components/UI/WhatsAppButton";

export default function SobreNosotrosPage() {
  return (
    <>
      <Navigation />
      <main className="w-full">
        <section id="about">
          <AboutUsSection />
        </section>
        <section id="why-us">
          <WhyChooseUsSection />
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
