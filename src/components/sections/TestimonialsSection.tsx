"use client";

import React, { useEffect, useState } from "react";
import {
  getTestimonials,
  getTestimonialsContent,
  type Testimonial,
  type TestimonialsContent,
} from "@/lib/firebaseFirestore";

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [content, setContent] = useState<TestimonialsContent>({
    title: "Testimonios",
    subtitle: "",
  });

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const [items, contentData] = await Promise.all([
          getTestimonials(),
          getTestimonialsContent(),
        ]);
        setTestimonials(items);
        if (contentData) {
          setContent({
            title: contentData.title ?? "Testimonios",
            subtitle: contentData.subtitle ?? "",
          });
        }
      } catch (error) {
        console.error("Error al cargar testimonios:", error);
      }
    };

    loadTestimonials();
  }, []);

  return (
    <section className="relative py-12 md:py-20 bg-[#111111]">
      {/* Fade superior */}
      <div className="absolute top-0 inset-x-0 h-24 md:h-96 bg-gradient-to-b from-transparent via-[#1f1f1f]/40 via-40% via-[#1f1f1f]/80 via-60% to-[#111111] z-0"></div>
      {/* Fade inferior */}
      <div className="absolute bottom-0 inset-x-0 h-24 md:h-96 bg-gradient-to-t from-[#111111] via-[#1f1f1f]/80 via-60% via-[#1f1f1f]/40 via-40% to-transparent z-0"></div>
      <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {content.title}
          </h2>
          {content.subtitle && (
            <p className="text-base md:text-lg text-[#C6C6C6]">
              {content.subtitle}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.length === 0 && (
            <div className="text-center text-[#C6C6C6] md:col-span-3">
              No hay testimonios cargados aún.
            </div>
          )}
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-[#1f1f1f]/80 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-[#3a3a3a]/60 hover:border-[#c2a68c] transition-all duration-300"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 md:w-5 md:h-5 text-[#c2a68c]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm md:text-base text-[#C6C6C6] leading-relaxed mb-6">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              <div className="border-t border-[#3a3a3a]/60 pt-4">
                <p className="text-white font-semibold text-sm md:text-base">
                  {testimonial.name}
                </p>
                <p className="text-[#C6C6C6]/80 text-xs md:text-sm">
                  {testimonial.event}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
