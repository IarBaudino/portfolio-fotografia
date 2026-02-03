"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getAboutContent, type AboutContent } from "@/lib/firebaseFirestore";

const AboutUsSection = () => {
  const [isMainPage, setIsMainPage] = useState(true);
  const [aboutContent, setAboutContent] = useState<AboutContent>({
    title: "",
    paragraphs: [],
    imageUrl: "",
  });

  useEffect(() => {
    setIsMainPage(window.location.pathname === "/");
  }, []);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await getAboutContent();
        if (data) {
          setAboutContent({
            title: data.title ?? "",
            paragraphs: data.paragraphs ?? [],
            imageUrl: data.imageUrl ?? "",
          });
        }
      } catch (error) {
        console.error("Error al cargar Sobre Nosotros:", error);
      }
    };

    loadContent();
  }, []);

  return (
    <section className="relative py-4 md:py-12 mt-0 -mt-14 md:-mt-16 pt-[56px] md:pt-[64px]">
      {/* Fades superiores solo en la página principal (con hero) */}
      {isMainPage && (
        <>
          {/* Fade gradient desde hero (lado izquierdo - fondo negro) */}
          <div className="absolute top-0 left-0 w-full md:w-1/2 h-24 md:h-96 bg-gradient-to-b from-black via-black/90 via-30% via-[#1f1f1f]/40 via-50% via-[#1f1f1f]/70 via-70% to-[#111111] z-0"></div>
          {/* Fade del carrusel en la mitad derecha - debe coincidir exactamente con el fade del carrusel */}
          <div className="absolute top-0 right-0 w-0 md:w-1/2 h-24 md:h-96 bg-gradient-to-b from-transparent via-transparent via-30% via-[#1f1f1f]/40 via-50% via-[#1f1f1f]/70 via-70% to-[#111111] z-0"></div>
          <div className="absolute inset-0 bg-[#111111] z-0 pt-24 md:pt-96"></div>
        </>
      )}

      {/* Background cuando NO está en la página principal - mismo estilo que la landing */}
      {!isMainPage && (
        <>
          {/* Fade gradient desde arriba (fondo negro) - igual que la landing, empieza desde el viewport */}
          <div className="absolute top-14 md:top-16 left-0 w-full h-24 md:h-96 bg-gradient-to-b from-black via-black/90 via-30% via-[#1f1f1f]/40 via-50% via-[#1f1f1f]/70 via-70% to-[#111111] z-0"></div>
          {/* Fondo verde sólido para toda la sección - igual que la landing, empieza desde el comienzo de la página */}
          <div className="absolute top-14 md:top-16 left-0 right-0 bottom-0 bg-[#111111] z-0 pt-24 md:pt-96"></div>
        </>
      )}

      {/* Fade inferior hacia WhyChooseUsSection - solo en la página principal */}
      {isMainPage && (
        <div className="absolute bottom-0 inset-x-0 h-24 md:h-96 bg-gradient-to-t from-black via-black/80 via-60% via-black/40 via-40% to-transparent z-0 pointer-events-none"></div>
      )}

      <div className="max-w-6xl mx-auto px-2 md:px-6 relative z-20 py-4 md:py-12">
        <div className="relative flex flex-row items-center justify-center gap-2 md:gap-12 z-30">
          {/* Imagen - visible en mobile también */}
          <div className="w-auto flex-shrink-0 flex justify-center md:block relative z-30">
            <div className="relative w-32 md:w-64 h-auto aspect-[3/4] md:h-96">
              <Image
                src={aboutContent.imageUrl || "/about.jpg"}
                alt="About Us"
                fill
                className="object-contain rounded-lg md:rounded-2xl"
                sizes="(max-width: 768px) 128px, 256px"
                style={{ objectPosition: "center center" }}
              />
            </div>
          </div>

          {/* Texto - centrado verticalmente */}
          <div className="relative w-auto md:w-auto md:flex-1 space-y-1 md:space-y-6 flex flex-col justify-center z-30">
            {aboutContent.title ? (
              <h2 className="text-2xl md:text-4xl font-bold text-[#EDEDED] mb-2 md:mb-6">
                {aboutContent.title}
              </h2>
            ) : null}
            <div className="space-y-1 md:space-y-6">
              {aboutContent.paragraphs.length ? (
                aboutContent.paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-[10px] md:text-lg text-[#C6C6C6] leading-tight md:leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="text-[10px] md:text-lg text-[#C6C6C6] leading-tight md:leading-relaxed">
                  Aún no hay contenido cargado.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
