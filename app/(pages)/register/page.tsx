"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="flex w-full max-w-3xl rounded-xl overflow-hidden shadow-sm border border-gray-200">
        <div className="hidden items-center gap-2">
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z"
              />
            </svg>
          </div>
          <span className="text-white font-medium text-sm">OS Manager</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-white text-lg font-medium">Crie sua conta</h1>
          <p className="text-white/60 text-xs leading-relaxed">
            Preencha os campos abaixo para criar sua conta.
          </p>
        </div>
        <p className="text-white/30 text-xs">OS Manager © 2026</p>
      </div>

      <form>
        <div>
          <label className="block text-sm text-gray-600 mb-1.5">CPF</label>
          <input
            type="text"
            placeholder="000.000.000-00"
            className="w-full h-10 px-3 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#1b3A5C] transiction-colors"
          />
        </div>

        <button
          type="button"
          className="w-full h-10 bg-[#1B3A5C] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          Validar CPF
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          className="w-full h-10 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Voltar
        </button>
      </form>
    </div>
  );
}
