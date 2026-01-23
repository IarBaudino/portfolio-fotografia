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
    <section className="relative min-h-screen flex flex-row overflow-hidden z-40">
      {/* Carousel lado derecho - siempre visible, más pequeño en mobile */}
      <div className="relative w-1/2 h-screen z-10">
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
        <div className="absolute bottom-0 inset-x-0 h-48 md:h-96 bg-gradient-to-b from-transparent via-transparent via-40% via-[#3a5744]/20 via-60% to-[#3a5744] z-20"></div>
      </div>

      {/* Fondo sólido lado izquierdo con contenido - siempre visible */}
      <div className="relative z-20 w-1/2 bg-black flex items-center justify-center min-h-screen">
        {/* Fade hacia abajo para fundirse con AboutUs */}
        <div className="absolute bottom-0 inset-x-0 h-48 md:h-96 bg-gradient-to-b from-transparent via-transparent via-40% via-[#3a5744]/20 via-60% to-[#3a5744] z-0"></div>
        <div className="text-center space-y-4 md:space-y-8 px-2 md:px-4 py-8 md:py-20 w-full max-w-md">
          <div className="flex justify-center mb-4 md:mb-8">
            <Image
              src="/logo-blanco.png"
              alt="YIB Photography Logo"
              width={300}
              height={300}
              className="w-[120px] h-[120px] md:w-[300px] md:h-[300px] rounded-2xl object-cover shadow-2xl"
              priority
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-6 justify-center">
            <button className="px-4 md:px-6 py-2 md:py-3 bg-[#c2a68c]/10 backdrop-blur-sm text-white hover:bg-[#c2a68c]/20 transition-all duration-300 rounded-lg text-xs md:text-base">
              Ver Portfolio
            </button>
            <button className="px-4 md:px-6 py-2 md:py-3 bg-transparent text-white hover:bg-[#c2a68c]/5 transition-all duration-300 rounded-lg text-xs md:text-base">
              Contactar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
