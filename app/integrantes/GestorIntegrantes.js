"use client";

import { useActionState, useState } from "react";
import { guardarIntegrante, eliminarIntegrante } from "@/app/actions/integrantes";

export default function GestorIntegrantes({ integrantesIniciales }) {
  const [editando, setEditando] = useState(null);
  const [estado, accion, pendiente] = useActionState(guardarIntegrante, {});

  // Si la acción fue exitosa, limpiamos el formulario.
  // En Next.js 15+ useActionState no limpia automáticamente los inputs no controlados,
  // así que usamos un key para forzar el remount del form tras el éxito.
  const formKey = estado.success ? Date.now() : "form";

  async function handleEliminar(id) {
    if (!confirm("¿Eliminar a este integrante?")) return;
    const res = await eliminarIntegrante(id);
    if (res.error) alert(res.error);
  }

  function handleCancelar() {
    setEditando(null);
    estado.error = null;
    estado.success = false;
  }

  return (
    <div className="space-y-6">
      <form
        key={formKey}
        action={(fd) => {
          accion(fd);
          if (!estado.error) setEditando(null); // Optimista
        }}
        className="rounded-xl bg-white p-4 shadow space-y-4"
      >
        <h2 className="text-lg font-bold">{editando ? "Editar integrante" : "Nuevo integrante"}</h2>
        {editando && <input type="hidden" name="id" value={editando.id} />}
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block space-y-1">
            <span className="text-sm font-medium">Nombre</span>
            <input
              name="nombre"
              defaultValue={editando?.nombre || ""}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-600 focus:outline-none"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium">Apellido</span>
            <input
              name="apellido"
              defaultValue={editando?.apellido || ""}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-600 focus:outline-none"
            />
          </label>
        </div>

        {estado.error && <p className="text-sm text-red-600">{estado.error}</p>}
        
        <div className="flex justify-end gap-2">
          {editando && (
            <button
              type="button"
              onClick={handleCancelar}
              className="rounded-lg px-4 py-2 font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </button>
          )}
          <button
            disabled={pendiente}
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-60"
          >
            {pendiente ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>

      <ul className="divide-y divide-slate-100 rounded-xl bg-white shadow">
        {integrantesIniciales.length === 0 ? (
          <li className="p-4 text-center text-slate-500">No hay integrantes registrados.</li>
        ) : (
          integrantesIniciales.map((int) => (
            <li key={int.id} className="flex items-center justify-between p-4 hover:bg-slate-50">
              <div>
                <p className="font-medium">{int.nombre} {int.apellido}</p>
                {int.equipos && <p className="text-xs text-slate-500">Equipo: {int.equipos.nombre}</p>}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditando(int)}
                  className="rounded px-2 py-1 text-sm text-blue-600 hover:bg-blue-50"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleEliminar(int.id)}
                  className="rounded px-2 py-1 text-sm text-red-600 hover:bg-red-50"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
