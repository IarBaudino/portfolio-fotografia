"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">(
    "right"
  );

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
      setSlideDirection((prev) => (prev === "right" ? "left" : "right"));
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
    <section className="relative min-h-screen flex overflow-hidden">
      {/* Carousel lado derecho */}
      <div className="absolute inset-0 z-0 flex">
        <div className="w-0 md:w-1/2"></div>
        <div className="relative w-full md:w-1/2 min-h-screen">
          {backgroundImages.map((image, index) => {
            const isActive = index === currentImageIndex;

            return (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-800 min-h-screen ${
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
          {/* Fade gradient hacia el centro */}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/50 to-black z-10"></div>
        </div>
      </div>

      {/* Fondo sólido lado izquierdo con contenido */}
      <div className="relative z-20 w-full md:w-1/2 bg-black flex items-center justify-center min-h-screen">
        <div className="text-center space-y-8 px-4 py-20">
          <div className="flex justify-center mb-8">
            <Image
              src="/logo-blanco.png"
              alt="YIB Photography Logo"
              width={300}
              height={300}
              className="rounded-2xl object-cover shadow-2xl"
              priority
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="px-6 py-3 bg-[#c2a68c]/10 backdrop-blur-sm text-white hover:bg-[#c2a68c]/20 transition-all duration-300 rounded-lg">
              Ver Portfolio
            </button>
            <button className="px-6 py-3 bg-transparent text-white hover:bg-[#c2a68c]/5 transition-all duration-300 rounded-lg">
              Contactar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
