"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

const AboutUsSection = () => {
  const [isMainPage, setIsMainPage] = useState(true);
  
  useEffect(() => {
    setIsMainPage(window.location.pathname === '/');
  }, []);
  
  return (
    <section className="relative py-4 md:py-12 mt-0 overflow-hidden -mt-14 md:-mt-16 pt-[56px] md:pt-[64px]">
      {/* Fades superiores solo en la página principal (con hero) */}
      {isMainPage && (
        <>
          {/* Fade gradient desde hero (lado izquierdo - fondo negro) */}
          <div className="absolute top-0 left-0 w-full md:w-1/2 h-24 md:h-96 bg-gradient-to-b from-black via-black/90 via-30% via-[#3a5744]/40 via-50% via-[#3a5744]/70 via-70% to-[#3a5744] z-0"></div>
          {/* Fade del carrusel en la mitad derecha - debe coincidir exactamente con el fade del carrusel */}
          <div className="absolute top-0 right-0 w-0 md:w-1/2 h-24 md:h-96 bg-gradient-to-b from-transparent via-transparent via-30% via-[#3a5744]/40 via-50% via-[#3a5744]/70 via-70% to-[#3a5744] z-0"></div>
          <div className="absolute inset-0 bg-[#3a5744] z-0 pt-24 md:pt-96"></div>
        </>
      )}
      
      {/* Background y fade superior cuando NO está en la página principal */}
      {!isMainPage && (
        <>
          {/* Fondo negro desde el inicio del viewport (después del navbar) */}
          <div className="absolute top-14 md:top-16 left-0 right-0 h-24 md:h-96 bg-black z-0"></div>
          {/* Fade de negro (arriba) a verde (abajo) */}
          <div className="absolute top-14 md:top-16 inset-x-0 h-24 md:h-96 bg-gradient-to-b from-black via-black/80 via-60% via-[#3a5744]/40 via-40% to-[#3a5744] z-0"></div>
          {/* Background verde para el resto de la sección */}
          <div className="absolute top-[152px] md:top-[448px] left-0 right-0 bottom-0 bg-[#3a5744] z-0"></div>
        </>
      )}
      
      {/* Fade inferior hacia WhyChooseUsSection - diferente según la página */}
      {isMainPage ? (
        <div className="absolute bottom-0 inset-x-0 h-24 md:h-96 bg-gradient-to-t from-black via-black/80 via-60% via-black/40 via-40% to-transparent z-0 pointer-events-none"></div>
      ) : (
        <div className="absolute bottom-0 inset-x-0 h-24 md:h-96 bg-gradient-to-t from-[#3a5744] via-[#3a5744]/80 via-60% via-black/40 via-40% to-black z-10 pointer-events-none"></div>
      )}

      <div className="max-w-6xl mx-auto px-2 md:px-6 relative z-30 py-4 md:py-12">
        <div className="relative flex flex-row items-center justify-center gap-2 md:gap-12">
          {/* Imagen - visible en mobile también */}
          <div className="w-auto z-10 flex-shrink-0 flex justify-center md:block">
            <div className="relative w-32 md:w-64 h-auto aspect-[3/4] md:h-96">
              <Image
                src="/about.jpg"
                alt="About Us"
                fill
                className="object-contain rounded-lg md:rounded-2xl"
                sizes="(max-width: 768px) 128px, 256px"
                style={{ objectPosition: "center center" }}
              />
            </div>
          </div>

          {/* Texto - centrado verticalmente */}
          <div className="relative z-20 w-auto md:w-auto md:flex-1 space-y-1 md:space-y-6 flex flex-col justify-center">
            <h2 className="text-3xl md:text-5xl font-bold text-[#e6d8c3] mb-6 md:mb-12 hidden"></h2>
            <div className="space-y-1 md:space-y-6">
              <p className="text-[10px] md:text-lg text-[#e6d8c3] leading-tight md:leading-relaxed">
                Somos Bruno Mascaro y Iara Baudino, un equipo dedicado a
                capturar momentos con una mirada estética cuidada y un profundo
                amor por la fotografía. Nos especializamos en coberturas de
                eventos —como cumpleaños, casamientos y encuentros
                corporativos—, además de realizar books, fotografía de producto
                y otros proyectos visuales que integran fotografía y producción
                audiovisual.
              </p>
              <p className="text-[10px] md:text-lg text-[#e6d8c3] leading-tight md:leading-relaxed">
                Nuestro enfoque se centra en ofrecer un trabajo pulido, sensible
                y visualmente superior, buscando que cada imagen transmita la
                esencia y la emoción de lo que ocurre frente a nuestra cámara.
                Creemos en la importancia de acompañar cada proyecto con
                profesionalismo, creatividad y una atención personalizada.
              </p>
              <p className="text-[10px] md:text-lg text-[#e6d8c3] leading-tight md:leading-relaxed">
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
