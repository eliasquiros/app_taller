"use client";

import { useActionState } from "react";
import { iniciarSesion } from "@/app/actions/auth";

const inputClass = "w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-600 focus:outline-none";

export default function LoginForm() {
  const [estado, accion, pendiente] = useActionState(iniciarSesion, {});

  return (
    <form action={accion} className="space-y-4">
      <label className="block space-y-1">
        <span className="text-sm font-medium">Usuario</span>
        <input name="usuario" defaultValue={estado.usuario} autoComplete="username" required className={inputClass} />
      </label>
      <label className="block space-y-1">
        <span className="text-sm font-medium">Contraseña</span>
        <input name="password" type="password" autoComplete="current-password" required className={inputClass} />
      </label>
      {estado.error && <p role="alert" className="text-sm text-red-600">{estado.error}</p>}
      <button disabled={pendiente} className="w-full rounded-lg bg-blue-600 py-2 font-semibold text-white disabled:opacity-60">
        {pendiente ? "Ingresando..." : "Iniciar sesión"}
      </button>
    </form>
  );
}
