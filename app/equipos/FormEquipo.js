"use client";

import { useActionState, useState, useEffect } from "react";
import { guardarEquipo } from "@/app/actions/equipos";

export default function FormEquipo({ equipo, integrantesLibres, integrantesDelEquipo, onCerrar }) {
  const [estado, accion, pendiente] = useActionState(guardarEquipo, {});
  const [seleccionados, setSeleccionados] = useState(
    integrantesDelEquipo ? integrantesDelEquipo.map((i) => i.id) : []
  );

  // Optimist UI para cerrar al completar
  if (estado.success) {
    onCerrar();
  }

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form action={accion} className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl space-y-4 max-h-[90vh] flex flex-col">
        <h2 className="text-xl font-bold">{equipo ? "Editar equipo" : "Nuevo equipo"}</h2>
        
        {equipo && <input type="hidden" name="id" value={equipo.id} />}
        
        <label className="block space-y-1">
          <span className="text-sm font-medium">Nombre del equipo</span>
          <input
            name="nombre"
            defaultValue={equipo?.nombre || ""}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-600 focus:outline-none"
          />
        </label>

        <div className="flex-1 overflow-y-auto space-y-2 border-y border-slate-100 py-2">
          <span className="text-sm font-medium">Seleccionar integrantes (2 o 3)</span>
          {integrantesDisponibles.length === 0 ? (
            <p className="text-sm text-slate-500">No hay integrantes libres.</p>
          ) : (
            <ul className="space-y-2 mt-2">
              {integrantesDisponibles.map((int) => (
                <li key={int.id}>
                  <label className="flex items-center gap-3 rounded p-2 hover:bg-slate-50 cursor-pointer border border-slate-100">
                    <input
                      type="checkbox"
                      name="integrantes"
                      value={int.id}
                      checked={seleccionados.includes(int.id)}
                      onChange={() => toggleIntegrante(int.id)}
                      className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                    />
                    <span>{int.nombre} {int.apellido}</span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>

        {estado.error && <p className="text-sm text-red-600">{estado.error}</p>}
        
        <p className="text-sm text-slate-500 text-right">{seleccionados.length} seleccionados</p>

        <div className="flex gap-3 pt-2">
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
