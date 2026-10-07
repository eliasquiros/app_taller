"use client";

import { useActionState } from "react";
import { iniciarSesion } from "@/app/actions/auth";
import { Loader2 } from "lucide-react";

const inputClass = "w-full rounded-xl border border-sapphire-100 bg-sapphire-50/30 px-4 py-3 text-sapphire-900 focus:border-sapphire-500 focus:bg-white focus:ring-4 focus:ring-sapphire-500/20 focus:outline-none transition-all";

export default function LoginForm() {
  const [estado, accion, pendiente] = useActionState(iniciarSesion, {});

  return (
    <form action={accion} className="space-y-5">
      <label className="block space-y-1.5">
        <span className="text-sm font-semibold text-sapphire-800">Usuario</span>
        <input name="usuario" defaultValue={estado.usuario} autoComplete="username" required className={inputClass} placeholder="ej. organizador" />
      </label>
      <label className="block space-y-1.5">
        <span className="text-sm font-semibold text-sapphire-800">Contraseña</span>
        <input name="password" type="password" autoComplete="current-password" required className={inputClass} placeholder="••••••••" />
      </label>
      
      {estado.error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 animate-fade-in border border-red-100">
          {estado.error}
        </div>
      )}
      
      <button 
        disabled={pendiente} 
        className="mt-2 w-full flex items-center justify-center rounded-xl bg-sapphire-500 py-3.5 font-bold text-white shadow-lg hover:bg-sapphire-700 hover:shadow-xl focus:ring-4 focus:ring-sapphire-500/30 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 transition-all"
      >
        {pendiente ? <><Loader2 className="mr-2 animate-spin" size={20} /> Ingresando...</> : "Iniciar sesión"}
      </button>
    </form>
  );
}
