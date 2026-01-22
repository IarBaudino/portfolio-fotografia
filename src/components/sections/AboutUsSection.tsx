"use client";

import React from "react";
import Image from "next/image";

const AboutUsSection = () => {
  return (
    <section className="relative py-12 mt-0">
      {/* Fade gradient desde hero (lado izquierdo - fondo negro) */}
      <div className="absolute top-0 left-0 w-full md:w-1/2 h-96 bg-gradient-to-b from-black via-black/90 via-30% via-[#3a5744]/40 via-50% via-[#3a5744]/70 via-70% to-[#3a5744] z-0"></div>
      {/* Fade del carrusel en la mitad derecha - debe coincidir exactamente con el fade del carrusel */}
      <div className="absolute top-0 right-0 w-0 md:w-1/2 h-96 bg-gradient-to-b from-transparent via-transparent via-30% via-[#3a5744]/40 via-50% via-[#3a5744]/70 via-70% to-[#3a5744] z-0"></div>
      {/* Background gradient that extends from previous to next section */}
      <div className="absolute inset-0 bg-[#3a5744] z-0 pt-96"></div>

      <div className="max-w-6xl mx-auto px-4 relative z-30 py-12">
        <div className="relative flex items-center justify-center gap-8 md:gap-12">
          {/* Imagen lado izquierdo - más pequeña y centrada */}
          <div className="hidden md:block z-10 flex-shrink-0">
            <div className="relative w-64 h-96">
              <Image
                src="/about.jpg"
                alt="About Us"
                fill
                className="object-cover rounded-2xl"
                sizes="256px"
                style={{ objectPosition: "center center" }}
              />
            </div>
          </div>

          {/* Texto lado derecho - centrado verticalmente */}
          <div className="relative z-20 w-full md:w-auto md:flex-1 space-y-6 flex flex-col justify-center">
            <h2 className="text-4xl md:text-5xl font-bold text-[#e6d8c3] mb-12"></h2>
            <div className="space-y-6">
              <p className="text-lg text-[#e6d8c3] leading-relaxed">
                Somos Bruno Mascaro y Iara Baudino, un equipo dedicado a
                capturar momentos con una mirada estética cuidada y un profundo
                amor por la fotografía. Nos especializamos en coberturas de
                eventos —como cumpleaños, casamientos y encuentros
                corporativos—, además de realizar books, fotografía de producto
                y otros proyectos visuales que integran fotografía y producción
                audiovisual.
              </p>
              <p className="text-lg text-[#e6d8c3] leading-relaxed">
                Nuestro enfoque se centra en ofrecer un trabajo pulido, sensible
                y visualmente superior, buscando que cada imagen transmita la
                esencia y la emoción de lo que ocurre frente a nuestra cámara.
                Creemos en la importancia de acompañar cada proyecto con
                profesionalismo, creatividad y una atención personalizada.
              </p>
              <p className="text-lg text-[#e6d8c3] leading-relaxed">
                Nos encantaría ser parte de tu idea y ayudarte a convertirla en
                imágenes que perduren.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
