"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const backgroundImages = [
    "/quince (1).jpg",
    "/quince (2).jpg",
    "/quince (3).jpg",
    "/quince (4).jpg",
    "/quince (5).jpg",
    "/quince (6).jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 100); // Pequeño delay para que aparezca la nueva imagen
      }, 800); // Tiempo para que desaparezca completamente
    }, 5000); // Cambio cada 5 segundos

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <section className="relative min-h-[60vh] md:min-h-screen flex overflow-hidden z-40">
      {/* Carousel lado derecho - siempre visible, también en mobile */}
      <div className="absolute inset-0 z-10 flex">
        <div className="w-1/2"></div>
        <div className="relative w-1/2 h-[60vh] md:h-screen">
          {backgroundImages.map((image, index) => {
            const isActive = index === currentImageIndex;

            return (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-800 ${
                  isActive
                    ? isTransitioning
                      ? "opacity-0"
                      : "opacity-100"
                    : "opacity-0"
                }`}
              >
                <Image
                  src={image}
                  alt={`Background ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="50vw"
                  style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                />
              </div>
            );
          })}
          {/* Fade gradient hacia el centro (lateral) */}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/50 to-black z-10"></div>
          {/* Fade hacia abajo para fundirse con AboutUs */}
          <div className="absolute bottom-0 inset-x-0 h-24 md:h-96 bg-gradient-to-b from-transparent via-transparent via-40% via-[#3a5744]/20 via-60% to-[#3a5744] z-20"></div>
        </div>
      </div>

      {/* Fondo sólido lado izquierdo con contenido - siempre visible, también en mobile */}
      <div className="relative z-20 w-1/2 bg-black flex items-center justify-center min-h-[60vh] md:min-h-screen">
        {/* Fade hacia abajo para fundirse con AboutUs */}
        <div className="absolute bottom-0 inset-x-0 h-24 md:h-96 bg-gradient-to-b from-transparent via-transparent via-40% via-[#3a5744]/20 via-60% to-[#3a5744] z-0"></div>
        <div className="text-center space-y-2 md:space-y-8 px-1 md:px-4 py-4 md:py-20">
          <div className="flex justify-center mb-2 md:mb-8">
            <Image
              src="/logo-blanco.png"
              alt="YEKA Producciones Logo"
              width={300}
              height={300}
              className="w-[60px] h-[60px] md:w-[300px] md:h-[300px] rounded-lg md:rounded-2xl object-cover shadow-xl md:shadow-2xl"
              priority
            />
          </div>
          <div className="flex flex-row gap-1.5 md:gap-6 justify-center">
            <button
              onClick={() => {
                const element = document.querySelector("#services");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="px-2 md:px-6 py-1 md:py-3 bg-[#c2a68c]/10 backdrop-blur-sm text-white hover:bg-[#c2a68c]/20 transition-all duration-300 rounded-md md:rounded-lg text-[9px] md:text-base whitespace-nowrap"
            >
              Ver Portfolio
            </button>
            <button
              onClick={() => {
                const element = document.querySelector("#contact");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="px-2 md:px-6 py-1 md:py-3 bg-[#c2a68c] text-black hover:bg-[#e6d8c3] transition-all duration-300 rounded-md md:rounded-lg text-[9px] md:text-base whitespace-nowrap font-semibold"
            >
              Solicitar Presupuesto
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
