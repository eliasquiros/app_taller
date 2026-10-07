"use client";

import { useActionState, useState, useEffect } from "react";
import { guardarEquipo } from "@/app/actions/equipos";

export default function FormEquipo({ equipo, integrantesLibres, integrantesDelEquipo, onCerrar }) {
  const [estado, accion, pendiente] = useActionState(guardarEquipo, {});
  const [seleccionados, setSeleccionados] = useState(
    integrantesDelEquipo ? integrantesDelEquipo.map((i) => i.id) : []
  );

  useEffect(() => {
    if (estado.success) {
      onCerrar();
    }
  }, [estado.success, onCerrar]);

  function toggleIntegrante(id) {
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  // Lista de integrantes que se pueden elegir (libres + los que ya estaban en este equipo si editamos)
  const integrantesDisponibles = [...integrantesLibres, ...(integrantesDelEquipo || [])].sort((a, b) => 
    a.nombre.localeCompare(b.nombre)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-sapphire-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <form action={accion} className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col animate-slide-up border border-sapphire-100">
        <h2 className="text-2xl font-extrabold text-sapphire-900">{equipo ? "Editar equipo" : "Nuevo equipo"}</h2>
        
        {equipo && <input type="hidden" name="id" value={equipo.id} />}
        
        <label className="block space-y-1.5">
          <span className="text-sm font-semibold text-sapphire-800">Nombre del equipo</span>
          <input
            name="nombre"
            defaultValue={equipo?.nombre || ""}
            required
            className="w-full rounded-xl border border-sapphire-100 bg-sapphire-50/50 px-4 py-3 text-sapphire-900 focus:border-sapphire-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-sapphire-500/20 transition-all"
          />
        </label>

        <div className="flex-1 overflow-y-auto space-y-2 border-y border-sapphire-100 py-4 custom-scrollbar">
          <span className="text-sm font-semibold text-sapphire-800">Seleccionar integrantes (2 o 3)</span>
          {integrantesDisponibles.length === 0 ? (
            <p className="text-sm text-sapphire-400 mt-2">No hay integrantes libres.</p>
          ) : (
            <ul className="space-y-2 mt-3">
              {integrantesDisponibles.map((int) => (
                <li key={int.id}>
                  <label className="flex items-center gap-3 rounded-xl p-3 hover:bg-sapphire-50 cursor-pointer border border-sapphire-50 hover:border-sapphire-100 transition-all">
                    <input
                      type="checkbox"
                      name="integrantes"
                      value={int.id}
                      checked={seleccionados.includes(int.id)}
                      onChange={() => toggleIntegrante(int.id)}
                      className="h-5 w-5 rounded border-sapphire-300 text-sapphire-500 focus:ring-sapphire-500 transition-colors"
                    />
                    <span className="font-medium text-sapphire-900">{int.nombre} {int.apellido}</span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>

        {estado.error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 animate-fade-in border border-red-100">{estado.error}</div>}
        
        <p className="text-sm font-medium text-sapphire-400 text-right">{seleccionados.length} seleccionados</p>

        <div className="flex gap-3 pt-2">
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
