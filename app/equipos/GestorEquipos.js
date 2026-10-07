"use client";

import { useState } from "react";
import FormPuntos from "./FormPuntos";
import FormEquipo from "./FormEquipo";
import { eliminarEquipo } from "@/app/actions/equipos";
import { Search, Plus, Edit2, Trash2, Hash } from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";

export default function GestorEquipos({ equipos, integrantes }) {
  const [busqueda, setBusqueda] = useState("");
  const [equipoPuntos, setEquipoPuntos] = useState(null);
  const [equipoEdit, setEquipoEdit] = useState(null);
  const [confirmarEliminar, setConfirmarEliminar] = useState(null);

  const integrantesLibres = integrantes.filter((i) => !i.equipo_id);

  async function handleEliminar(id) {
    const res = await eliminarEquipo(id);
    if (res.error) alert(res.error);
    setConfirmarEliminar(null);
  }

  const query = busqueda.toLowerCase();
  const equiposFiltrados = equipos.filter((eq) => {
    if (eq.nombre.toLowerCase().includes(query)) return true;
    return eq.integrantes.some(
      (int) => int.nombre.toLowerCase().includes(query) || int.apellido.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-sapphire-400" size={20} />
          <input
            type="search"
            placeholder="Buscar grupo o integrante..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full rounded-xl border border-sapphire-100 bg-white py-3 pl-10 pr-4 text-sapphire-900 shadow-sm focus:border-sapphire-500 focus:outline-none focus:ring-4 focus:ring-sapphire-500/20 transition-all"
          />
        </div>
        <button
          onClick={() => setEquipoEdit({})}
          className="flex items-center justify-center gap-2 rounded-xl bg-sapphire-500 px-6 py-3 font-bold text-white shadow-lg hover:bg-sapphire-700 hover:shadow-xl focus:ring-4 focus:ring-sapphire-500/30 transition-all active:scale-95"
        >
          <Plus size={20} /> Nuevo Equipo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {equiposFiltrados.length === 0 ? (
          <p className="col-span-full text-center text-sapphire-400 py-8 font-medium">No se encontraron equipos.</p>
        ) : (
          equiposFiltrados.map((equipo, idx) => (
            <div 
              key={equipo.id} 
              className="rounded-2xl bg-white p-5 shadow-lg shadow-sapphire-900/5 border border-sapphire-50 hover:border-sapphire-100 transition-all duration-300 flex flex-col"
              style={{ animation: `slide-up 0.4s ease-out ${idx * 0.05}s backwards` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-sapphire-900">{equipo.nombre}</h3>
                  <div className="flex items-center gap-1 text-sm font-semibold text-sapphire-500 mt-1 bg-sapphire-50 inline-flex px-2 py-0.5 rounded-lg">
                    <Hash size={14} /> {equipo.puntos} puntos
                  </div>
                </div>
                <button
                  onClick={() => setEquipoPuntos(equipo)}
                  className="rounded-xl bg-sapphire-100/50 px-3 py-2 text-sm font-bold text-sapphire-700 hover:bg-sapphire-500 hover:text-white transition-colors border border-sapphire-100"
                >
                  +/- Puntos
                </button>
              </div>

              <div className="flex-1 bg-sapphire-50/50 rounded-xl p-3 border border-sapphire-50 mb-4">
                <ul className="text-sm font-medium text-sapphire-800 space-y-1.5">
                  {equipo.integrantes.map((int) => (
                    <li key={int.id} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-sapphire-400" />
                      {int.nombre} {int.apellido}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-sapphire-100/50">
                <button
                  onClick={() => setEquipoEdit(equipo)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-sapphire-500 hover:bg-sapphire-50 transition-colors"
                >
                  <Edit2 size={16} /> Editar
                </button>
                <button
                  onClick={() => setConfirmarEliminar(equipo)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={16} /> Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {equipoPuntos && <FormPuntos equipo={equipoPuntos} onCerrar={() => setEquipoPuntos(null)} />}
      {equipoEdit && (
        <FormEquipo
          equipo={equipoEdit.id ? equipoEdit : null}
          integrantesLibres={integrantesLibres}
          integrantesDelEquipo={equipoEdit.id ? equipoEdit.integrantes : []}
          onCerrar={() => setEquipoEdit(null)}
        />
      )}

      <ConfirmModal
        isOpen={!!confirmarEliminar}
        titulo="¿Eliminar equipo?"
        mensaje={confirmarEliminar ? `¿Deseas eliminar el equipo "${confirmarEliminar.nombre}"? Sus integrantes quedarán libres y se conservará el historial de puntos.` : ""}
        onCancel={() => setConfirmarEliminar(null)}
        onConfirm={() => handleEliminar(confirmarEliminar.id)}
      />
    </div>
  );
}
