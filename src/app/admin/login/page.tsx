"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/sections/Footer";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Agregar atributo al html y body para prevenir scroll
    document.documentElement.setAttribute("data-admin-page", "true");
    document.body.setAttribute("data-admin-page", "true");
    
    return () => {
      // Limpiar al desmontar
      document.documentElement.removeAttribute("data-admin-page");
      document.body.removeAttribute("data-admin-page");
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Credenciales simples (en producción deberías usar variables de entorno)
    const validUsername = "admin";
    const validPassword = "yeka2025";

    if (username === validUsername && password === validPassword) {
      // Guardar sesión en localStorage
      localStorage.setItem("adminAuth", "true");
      localStorage.setItem("adminToken", Date.now().toString());
      router.push("/admin");
    } else {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div className="admin-page-container flex flex-col bg-gradient-to-b from-black via-[#3a5744]/20 to-black overflow-hidden">
      <div className="flex-1 flex items-center justify-center px-4 py-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-[#5d866c]/30 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-[#e6d8c3] mb-2">
                Panel Admin
              </h1>
              <p className="text-[#e6d8c3]/60 text-sm">YEKA Producciones</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-[#e6d8c3] mb-2"
                >
                  Usuario
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-[#3a5744]/20 border border-[#5d866c]/40 rounded-lg text-[#e6d8c3] placeholder:text-[#e6d8c3]/40 focus:outline-none focus:border-[#c2a68c] focus:bg-[#3a5744]/30 transition-all duration-300"
                  placeholder="Ingresa tu usuario"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#e6d8c3] mb-2"
                >
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#3a5744]/20 border border-[#5d866c]/40 rounded-lg text-[#e6d8c3] placeholder:text-[#e6d8c3]/40 focus:outline-none focus:border-[#c2a68c] focus:bg-[#3a5744]/30 transition-all duration-300"
                  placeholder="Ingresa tu contraseña"
                  required
                />
              </div>
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-300 text-sm text-center py-2 px-4 rounded-lg">
                  {error}
                </div>
              )}
              <button
                type="submit"
                className="w-full py-3 bg-[#3a5744] hover:bg-[#5d866c] text-[#e6d8c3] font-semibold rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              >
                Iniciar Sesión
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
