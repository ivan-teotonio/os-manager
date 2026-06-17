"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      {/* Container principal centralizado e com estilos idênticos ao login */}
      <div className="flex w-full max-w-3xl rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-white">
        {/* Formulário de Cadastro (lado direito) */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-sm">
            <div className="mb-6">
              {/* O título 'Crie sua conta' foi mantido no formulário para clareza */}
              <h2 className="text-lg font-medium text-gray-900 mb-1">
                Crie sua conta
              </h2>
              <p className="text-sm text-gray-500">
                Informe seu CPF para continuar
              </p>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">
                  CPF
                </label>
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  // Estilos de input idênticos ao login (borda azul no focus, tamanho h-10)
                  className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#1B3A5C] focus:ring-1 focus:ring-[#1B3A5C] transition-colors"
                />
              </div>

              <button
                type="button"
                // Botão primário com a cor #1B3A5C e h-10
                className="w-full h-10 bg-[#1B3A5C] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                Validar CPF
              </button>

              <button
                type="button"
                onClick={() => router.back()}
                // Botão secundário idêntico ao login (border, texto cinza)
                className="w-full h-10 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Voltar
              </button>
            </form>
            {/* Copyright centralizado no formulário */}
            <p className="text-xs text-gray-400 text-center mt-6">
              OS Manager © 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
