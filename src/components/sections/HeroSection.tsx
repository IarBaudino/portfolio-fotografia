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
    "/hero-bg-1.jpg",
    "/hero-bg-2.jpg",
    "/hero-bg-3.jpg",
    "/hero-bg-4.jpg",
    "/hero-bg-5.jpg",
    "/hero-bg-6.jpg",
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background images carousel */}
      <div className="absolute inset-0 z-0">
        {backgroundImages.map((image, index) => {
          const isActive = index === currentImageIndex;

          return (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-800 ${
                isActive
                  ? isTransitioning
                    ? "opacity-0"
                    : "opacity-60"
                  : "opacity-0"
              }`}
            >
              <Image
                src={image}
                alt={`Background ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          );
        })}
      </div>

      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-gray-900/60 z-10"></div>
      <div className="text-center space-y-8 px-4 relative z-20">
        <div className="flex justify-center mb-8">
          <Image
            src="/logo.png"
            alt="YIB Photography Logo"
            width={300}
            height={300}
            className="rounded-2xl object-cover shadow-2xl"
            priority
          />
        </div>
        <h1 className="text-xl md:text-2xl font-light text-white tracking-wide">
          Iara Yael Baudino
        </h1>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:border-white/40 transition-all duration-300 rounded-lg">
            Ver Portfolio
          </button>
          <button className="px-6 py-3 bg-transparent border border-white/30 text-white hover:bg-white/5 hover:border-white/50 transition-all duration-300 rounded-lg">
            Contactar
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
