"use client";

import React, { useState } from "react";

const ContactFormSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    eventDate: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission logic
    console.log("Form submitted:", formData);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className="relative py-12 md:py-20 bg-[#111111]">
      {/* Fade superior desde ServicesSection */}
      <div className="absolute top-0 left-0 right-0 h-24 md:h-96 bg-gradient-to-b from-[#111111] via-[#1f1f1f]/80 via-60% via-[#1f1f1f]/40 via-40% to-transparent z-0"></div>
      {/* Fade inferior hacia Footer */}
      <div className="absolute bottom-0 inset-x-0 h-24 md:h-96 bg-gradient-to-t from-black via-black/90 via-60% via-black/40 via-40% to-transparent z-0"></div>
      <div className="max-w-4xl mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6">
            Contáctanos
          </h2>
          <p className="text-base md:text-xl text-[#C6C6C6] max-w-2xl mx-auto px-4">
            ¿Planeas un casamiento, cumpleaños o evento corporativo? Solicita tu
            presupuesto gratuito y asegura la cobertura fotográfica perfecta
            para tu celebración.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[#C6C6C6] mb-2"
              >
                Nombre completo *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#3a3a3a] rounded-lg focus:ring-2 focus:ring-[#c2a68c] focus:border-transparent bg-[#1f1f1f] text-white placeholder-[#C6C6C6]/60"
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#C6C6C6] mb-2"
              >
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#3a3a3a] rounded-lg focus:ring-2 focus:ring-[#c2a68c] focus:border-transparent bg-[#1f1f1f] text-white placeholder-[#C6C6C6]/60"
                placeholder="tu@email.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-[#C6C6C6] mb-2"
            >
              Teléfono *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#3a3a3a] rounded-lg focus:ring-2 focus:ring-[#c2a68c] focus:border-transparent bg-[#1f1f1f] text-white placeholder-[#C6C6C6]/60"
              placeholder="+54 9 11 1234-5678"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="eventType"
                className="block text-sm font-medium text-[#C6C6C6] mb-2"
              >
                Tipo de Evento *
              </label>
              <select
                id="eventType"
                name="eventType"
                required
                value={formData.eventType}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#3a3a3a] rounded-lg focus:ring-2 focus:ring-[#c2a68c] focus:border-transparent bg-[#1f1f1f] text-white"
              >
                <option value="">Selecciona un tipo</option>
                <option value="casamiento">Casamiento / Boda</option>
                <option value="cumpleanos">Cumpleaños</option>
                <option value="corporativo">Evento Corporativo</option>
                <option value="quince">Quinceañero</option>
                <option value="otro">Otro evento</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="eventDate"
                className="block text-sm font-medium text-[#C6C6C6] mb-2"
              >
                Fecha del Evento
              </label>
              <input
                type="date"
                id="eventDate"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#3a3a3a] rounded-lg focus:ring-2 focus:ring-[#c2a68c] focus:border-transparent bg-[#1f1f1f] text-white"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-[#C6C6C6] mb-2"
            >
              Cuéntanos sobre tu evento *
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#3a3a3a] rounded-lg focus:ring-2 focus:ring-[#c2a68c] focus:border-transparent bg-[#1f1f1f] text-white placeholder-[#C6C6C6]/60"
              placeholder="Detalles del evento, cantidad de invitados, ubicación, necesidades especiales..."
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="px-8 py-4 bg-[#c2a68c] text-black hover:bg-[#bfa88f] transition-colors duration-300 rounded-lg font-semibold text-lg"
            >
              Solicitar Presupuesto Gratuito
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactFormSection;
