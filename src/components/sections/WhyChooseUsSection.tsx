"use client";

import React from "react";

const features = [
  {
    title: "Experiencia Profesional",
    description:
      "Años de experiencia capturando momentos únicos en casamientos, eventos corporativos y celebraciones especiales.",
  },
  {
    title: "Atención Personalizada",
    description:
      "Cada evento es único. Trabajamos contigo desde el inicio para entender tu visión y superar tus expectativas.",
  },
  {
    title: "Estilo y Calidad",
    description:
      "Cada imagen es cuidadosamente editada para mantener un estilo consistente y de alta calidad profesional.",
  },
  {
    title: "Entrega Rápida",
    description:
      "Comprometidos con plazos de entrega que respetan tus necesidades, sin comprometer la calidad del trabajo.",
  },
  {
    title: "Equipamiento Profesional",
    description:
      "Utilizamos equipos de última generación para garantizar resultados excepcionales en cualquier condición.",
  },
  {
    title: "Compromiso Total",
    description:
      "Nos involucramos en cada detalle de tu evento para asegurar que nada importante quede sin documentar.",
  },
];

const WhyChooseUsSection = () => {
  return (
    <section className="relative py-12 md:py-20 bg-black overflow-hidden">
      {/* Fade superior desde AboutUsSection (verde #3a5744) */}
      <div className="absolute top-0 inset-x-0 h-24 md:h-96 bg-gradient-to-b from-[#3a5744] via-[#3a5744]/80 via-60% via-black/40 via-40% to-black z-0"></div>
      {/* Fade inferior */}
      <div className="absolute bottom-0 inset-x-0 h-24 md:h-96 bg-gradient-to-t from-black via-black/80 via-60% via-black/40 via-40% to-transparent z-0"></div>
      <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-[#e6d8c3] mb-4">
            ¿Por qué elegir YEKA Producciones?
          </h2>
          <p className="text-base md:text-lg text-[#e6d8c3]/80 max-w-2xl mx-auto">
            Nos destacamos por nuestra dedicación, profesionalismo y pasión por
            capturar los momentos que realmente importan.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-[#3a5744]/30 backdrop-blur-sm rounded-xl p-6 border border-[#5d866c]/20 hover:border-[#c2a68c]/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              <h3 className="text-xl md:text-2xl font-semibold text-[#e6d8c3] mb-3">
                {feature.title}
              </h3>
              <p className="text-sm md:text-base text-[#e6d8c3]/80 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
