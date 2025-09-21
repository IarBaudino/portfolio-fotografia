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
            <p className="text-lg text-gray-300 leading-relaxed">
              Soy Iara Baudino, fotógrafa en formación que está construyendo su
              camino dentro del oficio. Actualmente trabajo en proyectos
              freelance para pequeños emprendimientos y clientes locales, y
              estoy ampliando mi portfolio con el objetivo de profesionalizar
              cada vez más mi trabajo.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              Me interesa documentar historias, crear retratos auténticos y
              generar contenido visual que ayude a personas, marcas y proyectos
              a mostrar su identidad de manera clara y atractiva.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              Estoy en una etapa de crecimiento, abierta a nuevos desafíos y
              oportunidades que me permitan seguir aprendiendo, sumar
              experiencia y consolidar mi estilo.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
