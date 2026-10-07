"use client";

import { useActionState, useState, useEffect } from "react";
import { ajustarPuntos } from "@/app/actions/equipos";

export default function FormPuntos({ equipo, onCerrar }) {
  const [estado, accion, pendiente] = useActionState(ajustarPuntos, {});
  const [cantidad, setCantidad] = useState("");
  const [operacion, setOperacion] = useState("suma");

  useEffect(() => {
    if (estado.success) {
      onCerrar();
    }
  }, [estado.success, onCerrar]);

  const cantidadNum = parseInt(cantidad, 10) || 0;
  const puntosNuevos = operacion === "resta" ? Math.max(0, equipo.puntos - cantidadNum) : equipo.puntos + cantidadNum;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-sapphire-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <form action={accion} className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-6 animate-slide-up border border-sapphire-100">
        <div>
          <h2 className="text-2xl font-extrabold text-sapphire-900">Ajustar puntos</h2>
          <p className="text-sm text-sapphire-400 mt-1">Equipo: <strong className="text-sapphire-700">{equipo.nombre}</strong></p>
        </div>
        
        <input type="hidden" name="equipo_id" value={equipo.id} />

        <div className="flex gap-3">
          <label className="flex flex-1 cursor-pointer items-center justify-center rounded-xl border-2 border-sapphire-50 bg-sapphire-50/50 p-3 hover:bg-sapphire-100 hover:border-sapphire-100 has-[:checked]:border-sapphire-500 has-[:checked]:bg-sapphire-50 has-[:checked]:shadow-sm transition-all">
            <input type="radio" name="operacion" value="suma" checked={operacion === "suma"} onChange={(e) => setOperacion(e.target.value)} className="sr-only" />
            <span className="font-bold text-sapphire-700">Sumar</span>
          </label>
          <label className="flex flex-1 cursor-pointer items-center justify-center rounded-xl border-2 border-red-50 bg-red-50/50 p-3 hover:bg-red-100 hover:border-red-100 has-[:checked]:border-red-500 has-[:checked]:bg-red-50 has-[:checked]:shadow-sm transition-all">
            <input type="radio" name="operacion" value="resta" checked={operacion === "resta"} onChange={(e) => setOperacion(e.target.value)} className="sr-only" />
            <span className="font-bold text-red-700">Restar</span>
          </label>
        </div>

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-sapphire-800">Cantidad</span>
          <input
            type="number"
            name="cantidad"
            min="1"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            required
            className="w-full rounded-xl border border-sapphire-100 bg-white px-4 py-3 text-center text-2xl font-bold text-sapphire-900 shadow-inner focus:border-sapphire-500 focus:outline-none focus:ring-4 focus:ring-sapphire-500/20 transition-all"
          />
        </label>

        <div className="rounded-2xl bg-sapphire-900 text-white p-5 text-center shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sapphire-500 to-sapphire-100"></div>
          <p className="text-sm font-medium text-sapphire-100">Puntos actuales: {equipo.puntos}</p>
          <p className="text-3xl font-extrabold mt-1">Nuevos: {puntosNuevos}</p>
        </div>

        {estado.error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 animate-fade-in border border-red-100">{estado.error}</div>}

        <div className="flex gap-3">
          <button type="button" onClick={onCerrar} className="flex-1 rounded-xl px-4 py-3 font-bold text-sapphire-700 hover:bg-sapphire-50 transition-colors">
            Cancelar
          </button>
          <button disabled={pendiente} className="flex-1 rounded-xl bg-sapphire-500 px-4 py-3 font-bold text-white shadow-lg hover:bg-sapphire-700 hover:shadow-xl focus:ring-4 focus:ring-sapphire-500/30 disabled:opacity-60 transition-all active:scale-95">
            {pendiente ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
