"use client";

import { useActionState, useState } from "react";
import { ajustarPuntos } from "@/app/actions/equipos";

export default function FormPuntos({ equipo, onCerrar }) {
  const [estado, accion, pendiente] = useActionState(ajustarPuntos, {});
  const [cantidad, setCantidad] = useState("");
  const [operacion, setOperacion] = useState("suma");

  // Optimist UI para cerrar al completar
  if (estado.success) {
    onCerrar();
  }

  const cantidadNum = parseInt(cantidad, 10) || 0;
  const puntosNuevos = operacion === "resta" ? Math.max(0, equipo.puntos - cantidadNum) : equipo.puntos + cantidadNum;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form action={accion} className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl space-y-6">
        <h2 className="text-xl font-bold">Ajustar puntos</h2>
        <p className="text-sm text-slate-600">Equipo: <strong className="text-slate-900">{equipo.nombre}</strong></p>
        
        <input type="hidden" name="equipo_id" value={equipo.id} />

        <div className="flex gap-2">
          <label className="flex flex-1 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-3 hover:bg-slate-100 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
            <input type="radio" name="operacion" value="suma" checked={operacion === "suma"} onChange={(e) => setOperacion(e.target.value)} className="sr-only" />
            <span className="font-semibold text-blue-700">Sumar</span>
          </label>
          <label className="flex flex-1 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-3 hover:bg-slate-100 has-[:checked]:border-red-500 has-[:checked]:bg-red-50">
            <input type="radio" name="operacion" value="resta" checked={operacion === "resta"} onChange={(e) => setOperacion(e.target.value)} className="sr-only" />
            <span className="font-semibold text-red-700">Restar</span>
          </label>
        </div>

        <label className="block space-y-1">
          <span className="text-sm font-medium">Cantidad</span>
          <input
            type="number"
            name="cantidad"
            min="1"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-center text-lg focus:border-blue-600 focus:outline-none"
          />
        </label>

        <div className="rounded-lg bg-slate-50 p-4 text-center">
          <p className="text-sm text-slate-500">Puntos actuales: {equipo.puntos}</p>
          <p className="text-xl font-bold">Nuevos puntos: {puntosNuevos}</p>
        </div>

        {estado.error && <p className="text-sm text-red-600">{estado.error}</p>}

        <div className="flex gap-3">
          <button type="button" onClick={onCerrar} className="flex-1 rounded-lg px-4 py-2 font-medium text-slate-600 hover:bg-slate-100">
            Cancelar
          </button>
          <button disabled={pendiente} className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-60">
            {pendiente ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
