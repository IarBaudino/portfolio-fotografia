"use client";

import React, { useState, useEffect } from "react";
import { NAVIGATION } from "@/constants";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    setIsMenuOpen(false);

    // Si es un enlace externo (empieza con /), navegar a esa página
    if (href.startsWith("/")) {
      window.location.href = href;
      return;
    }

    // Si es un hash (#), verificar si estamos en la página principal
    if (href.startsWith("#")) {
      // Si no estamos en la página principal, navegar primero
      if (window.location.pathname !== "/") {
        window.location.href = `/${href}`;
        return;
      }

      // Si estamos en la página principal, hacer scroll a la sección
      // Usar setTimeout para asegurar que el DOM esté listo
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          const navHeight = 64; // Altura aproximada del navbar
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - navHeight;

          window.scrollTo({
            top: Math.max(0, offsetPosition), // Asegurar que no sea negativo
            behavior: "smooth",
          });
        }
      }, 100);
    }
  };

  // Separar los enlaces: primeros dos a la izquierda, últimos tres a la derecha
  const leftLinks = NAVIGATION.slice(0, 2); // Inicio y Nosotros
  const rightLinks = NAVIGATION.slice(2); // Portfolio, Testimonios y Contacto

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isMenuOpen
          ? "bg-black/90 backdrop-blur-sm border-b border-[#3a3a3a]/50 md:bg-black/60"
          : isScrolled
            ? "bg-black/60 backdrop-blur-sm border-b border-[#3a3a3a]/50"
            : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-16 relative">
          {/* Left Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-8 flex-1">
            {leftLinks.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="text-white hover:text-[#c2a68c] transition-colors duration-300 font-medium text-sm md:text-base"
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Logo - Centered */}
          <button
            onClick={() => {
              if (window.location.pathname !== "/") {
                window.location.href = "/";
              } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="absolute left-1/2 transform -translate-x-1/2 cursor-pointer"
          >
            <span className="text-white font-bold text-base md:text-lg hover:text-[#c2a68c] transition-colors duration-300">
              YEKA
            </span>
          </button>

          {/* Right Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-8 flex-1 justify-end">
            {rightLinks.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="text-white hover:text-[#c2a68c] transition-colors duration-300 font-medium text-sm md:text-base"
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2 z-10"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#3a3a3a]/50">
            <div className="flex flex-col space-y-4">
              {NAVIGATION.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="text-white hover:text-[#c2a68c] transition-colors duration-300 text-left text-xl font-medium py-3"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
