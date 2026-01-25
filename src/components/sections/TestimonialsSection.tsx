"use client";

import React from "react";

const testimonials = [
  {
    id: 1,
    name: "María y Juan",
    event: "Casamiento",
    text: "Increíble trabajo en nuestro casamiento. Capturaron cada momento especial con tanta sensibilidad. Las fotos superaron todas nuestras expectativas.",
    rating: 5,
  },
  {
    id: 2,
    name: "Empresa Tech Solutions",
    event: "Evento Corporativo",
    text: "Profesionalismo y calidad excepcional. La cobertura de nuestro evento corporativo fue impecable. Recomendamos totalmente sus servicios.",
    rating: 5,
  },
  {
    id: 3,
    name: "Familia Rodríguez",
    event: "Cumpleaños 15",
    text: "Las fotos del cumpleaños de nuestra hija quedaron hermosas. Muy atentos, profesionales y el resultado final fue espectacular. ¡Gracias!",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="relative py-12 md:py-20 bg-[#3a5744]">
      {/* Fade superior */}
      <div className="absolute top-0 inset-x-0 h-24 md:h-96 bg-gradient-to-b from-transparent via-[#3a5744]/40 via-40% via-[#3a5744]/80 via-60% to-[#3a5744] z-0"></div>
      {/* Fade inferior */}
      <div className="absolute bottom-0 inset-x-0 h-24 md:h-96 bg-gradient-to-t from-[#3a5744] via-[#3a5744]/80 via-60% via-[#3a5744]/40 via-40% to-transparent z-0"></div>
      <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-[#e6d8c3] mb-4">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-base md:text-lg text-[#e6d8c3]/80">
            La confianza de quienes confiaron en nosotros
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-black/40 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-[#5d866c]/30 hover:border-[#c2a68c]/50 transition-all duration-300"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 md:w-5 md:h-5 text-[#c2a68c]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm md:text-base text-[#e6d8c3] leading-relaxed mb-6">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              <div className="border-t border-[#5d866c]/30 pt-4">
                <p className="text-[#c2a68c] font-semibold text-sm md:text-base">
                  {testimonial.name}
                </p>
                <p className="text-[#e6d8c3]/70 text-xs md:text-sm">
                  {testimonial.event}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
