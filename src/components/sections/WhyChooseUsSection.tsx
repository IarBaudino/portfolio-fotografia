"use client";

import React, { useEffect, useState } from "react";
import {
  getWhyChooseContent,
  type WhyChooseContent,
} from "@/lib/firebaseFirestore";

const WhyChooseUsSection = () => {
  const [content, setContent] = useState<WhyChooseContent>({
    title: "",
    subtitle: "",
    features: [],
  });

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await getWhyChooseContent();
        if (data) {
          setContent({
            title: data.title ?? "",
            subtitle: data.subtitle ?? "",
            features: data.features ?? [],
          });
        }
      } catch (error) {
        console.error("Error al cargar Por qué elegirnos:", error);
      }
    };

    loadContent();
  }, []);

  return (
    <section className="relative py-12 md:py-20 bg-black overflow-hidden">
      {/* Fade superior desde AboutUsSection (gris oscuro) */}
      <div className="absolute top-0 inset-x-0 h-24 md:h-96 bg-gradient-to-b from-[#111111] via-[#1f1f1f]/95 via-80% via-[#1f1f1f]/70 via-85% via-black/30 via-95% to-black z-0"></div>
      {/* Fade inferior */}
      <div className="absolute bottom-0 inset-x-0 h-24 md:h-96 bg-gradient-to-t from-black via-black/80 via-60% via-black/40 via-40% to-transparent z-0"></div>
      <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {content.title || "¿Por qué elegirnos?"}
          </h2>
          <p className="text-base md:text-lg text-[#EDEDED] max-w-2xl mx-auto">
            {content.subtitle || "Pronto tendrás esta sección configurada."}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {content.features.map((feature, index) => (
            <div
              key={index}
              className="bg-[#1f1f1f]/70 backdrop-blur-sm rounded-xl p-6 border border-[#3a3a3a]/40 hover:border-[#c2a68c] transition-all duration-300 hover:transform hover:scale-105"
            >
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-sm md:text-base text-[#EDEDED] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
