"use client";

import React from "react";
import Image from "next/image";

const AboutUsSection = () => {
  return (
    <section className="relative py-20">
      {/* Background gradient that extends from previous to next section */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-black z-0"></div>
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-12">
            
          </h2>
          <div className="space-y-6 max-w-3xl mx-auto">
            <p className="text-lg text-[#e6d8c3] leading-relaxed">
              Somos Bruno Mascaro y Iara Baudino, un equipo dedicado a capturar momentos con
              una mirada estética cuidada y un profundo amor por la fotografía. Nos
              especializamos en coberturas de eventos —como cumpleaños, casamientos y
              encuentros corporativos—, además de realizar books, fotografía de producto y otros
              proyectos visuales que integran fotografía y producción audiovisual.
            </p>
            <p className="text-lg text-[#e6d8c3] leading-relaxed">
              Nuestro enfoque se centra en ofrecer un trabajo pulido, sensible y visualmente
              superior, buscando que cada imagen transmita la esencia y la emoción de lo que
              ocurre frente a nuestra cámara. Creemos en la importancia de acompañar cada
              proyecto con profesionalismo, creatividad y una atención personalizada.
            </p>
            <p className="text-lg text-[#e6d8c3] leading-relaxed">
              Nos encantaría ser parte de tu idea y ayudarte a convertirla en imágenes que
              perduren.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
