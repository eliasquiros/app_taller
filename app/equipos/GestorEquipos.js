"use client";

import { useState } from "react";
import FormPuntos from "./FormPuntos";
import FormEquipo from "./FormEquipo";
import { eliminarEquipo } from "@/app/actions/equipos";

export default function GestorEquipos({ equipos, integrantes }) {
  const [busqueda, setBusqueda] = useState("");
  const [equipoPuntos, setEquipoPuntos] = useState(null);
  const [equipoEdit, setEquipoEdit] = useState(null); // null = cerrado, {} = nuevo, {...equipo} = editar

  const integrantesLibres = integrantes.filter((i) => !i.equipo_id);

  async function handleEliminar(id) {
    if (!confirm("¿Eliminar este equipo? Sus integrantes quedarán libres.")) return;
    const res = await eliminarEquipo(id);
    if (res.error) alert(res.error);
  }

  // Filtrado por buscador (nombre equipo o nombre/apellido integrante)
  const query = busqueda.toLowerCase();
  const equiposFiltrados = equipos.filter((eq) => {
    if (eq.nombre.toLowerCase().includes(query)) return true;
    return eq.integrantes.some(
      (int) => int.nombre.toLowerCase().includes(query) || int.apellido.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <input
          type="search"
          placeholder="Buscar grupo o integrante..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 focus:border-blue-600 focus:outline-none"
        />
        <button
          onClick={() => setEquipoEdit({})}
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow"
        >
          Nuevo
        </button>
      </div>

      <div className="space-y-4">
        {equiposFiltrados.length === 0 ? (
          <p className="text-center text-slate-500 py-4">No se encontraron equipos.</p>
        ) : (
          equiposFiltrados.map((equipo) => (
            <div key={equipo.id} className="rounded-xl bg-white p-4 shadow space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">{equipo.nombre}</h3>
                  <p className="text-sm text-slate-500">{equipo.puntos} puntos</p>
                </div>
                <button
                  onClick={() => setEquipoPuntos(equipo)}
                  className="rounded-lg bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                >
                  +/- Puntos
                </button>
              </div>

              <ul className="text-sm text-slate-600">
                {equipo.integrantes.map((int) => (
                  <li key={int.id}>• {int.nombre} {int.apellido}</li>
                ))}
              </ul>

              <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setEquipoEdit(equipo)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleEliminar(equipo.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {equipoPuntos && (
        <FormPuntos equipo={equipoPuntos} onCerrar={() => setEquipoPuntos(null)} />
      )}

      {equipoEdit && (
        <FormEquipo
          equipo={equipoEdit.id ? equipoEdit : null}
          integrantesLibres={integrantesLibres}
          integrantesDelEquipo={equipoEdit.id ? equipoEdit.integrantes : []}
          onCerrar={() => setEquipoEdit(null)}
        />
      )}
    </div>
  );
}
