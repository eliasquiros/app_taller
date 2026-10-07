"use client";

import { useActionState, useState, useEffect } from "react";
import { guardarIntegrante, eliminarIntegrante } from "@/app/actions/integrantes";
import { Edit2, Trash2, User, Users } from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";

export default function GestorIntegrantes({ integrantesIniciales }) {
  const [editando, setEditando] = useState(null);
  const [confirmarEliminar, setConfirmarEliminar] = useState(null);
  const [estado, accion, pendiente] = useActionState(guardarIntegrante, {});

  useEffect(() => {
    if (estado.success) {
      setEditando(null);
    }
  }, [estado.success]);

  const formKey = estado.success ? Date.now() : "form";

  async function handleEliminar(id) {
    const res = await eliminarIntegrante(id);
    if (res.error) alert(res.error);
    setConfirmarEliminar(null);
  }

  function handleCancelar() {
    setEditando(null);
    estado.error = null;
    estado.success = false;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Formulario */}
      <div className="lg:col-span-1">
        <form
          key={formKey}
          action={accion}
          className="sticky top-20 rounded-2xl bg-white p-6 shadow-lg shadow-sapphire-900/5 border border-sapphire-50 space-y-5"
        >
          <h2 className="text-xl font-bold text-sapphire-900">{editando ? "Editar integrante" : "Nuevo integrante"}</h2>
          {editando && <input type="hidden" name="id" value={editando.id} />}
          
          <div className="space-y-4">
            <label className="block space-y-1.5">
              <span className="text-sm font-semibold text-sapphire-800">Nombre</span>
              <input
                name="nombre"
                defaultValue={editando?.nombre || ""}
                required
                className="w-full rounded-xl border border-sapphire-100 bg-sapphire-50/30 px-4 py-3 text-sapphire-900 focus:border-sapphire-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-sapphire-500/20 transition-all"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-semibold text-sapphire-800">Apellido</span>
              <input
                name="apellido"
                defaultValue={editando?.apellido || ""}
                required
                className="w-full rounded-xl border border-sapphire-100 bg-sapphire-50/30 px-4 py-3 text-sapphire-900 focus:border-sapphire-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-sapphire-500/20 transition-all"
              />
            </label>
          </div>

          {estado.error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 animate-fade-in border border-red-100">{estado.error}</div>}
          
          <div className="flex flex-col gap-2 pt-2">
            <button
              disabled={pendiente}
              className="w-full rounded-xl bg-sapphire-500 px-4 py-3 font-bold text-white shadow-lg hover:bg-sapphire-700 hover:shadow-xl focus:ring-4 focus:ring-sapphire-500/30 disabled:opacity-60 transition-all active:scale-95"
            >
              {pendiente ? "Guardando..." : "Guardar integrante"}
            </button>
            {editando && (
              <button
                type="button"
                onClick={handleCancelar}
                className="w-full rounded-xl px-4 py-3 font-bold text-sapphire-700 hover:bg-sapphire-50 transition-colors"
              >
                Cancelar edición
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lista */}
      <div className="lg:col-span-2">
        <ul className="divide-y divide-sapphire-50 rounded-2xl bg-white shadow-lg shadow-sapphire-900/5 border border-sapphire-50">
          {integrantesIniciales.length === 0 ? (
            <li className="p-8 text-center text-sapphire-400 font-medium">No hay integrantes registrados.</li>
          ) : (
            integrantesIniciales.map((int, idx) => (
              <li 
                key={int.id} 
                className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-sapphire-50/50 transition-colors"
                style={{ animation: `slide-up 0.3s ease-out ${idx * 0.03}s backwards` }}
              >
                <div className="flex items-center gap-4 mb-3 sm:mb-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-sapphire-100 text-sapphire-700">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sapphire-900 text-lg">{int.nombre} {int.apellido}</p>
                    {int.equipos ? (
                      <p className="flex items-center gap-1 text-sm font-medium text-sapphire-500 mt-0.5">
                        <Users size={14} /> {int.equipos.nombre}
                      </p>
                    ) : (
                      <p className="text-sm font-medium text-amber-500 mt-0.5">Sin equipo</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => setEditando(int)}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-sapphire-500 hover:bg-sapphire-100 transition-colors"
                  >
                    <Edit2 size={16} /> Editar
                  </button>
                  <button
                    onClick={() => setConfirmarEliminar(int)}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      <ConfirmModal
        isOpen={!!confirmarEliminar}
        titulo="¿Eliminar integrante?"
        mensaje={confirmarEliminar ? `¿Estás seguro de que deseas eliminar a ${confirmarEliminar.nombre}? Esta acción no se puede deshacer.` : ""}
        onCancel={() => setConfirmarEliminar(null)}
        onConfirm={() => handleEliminar(confirmarEliminar.id)}
      />
    </div>
  );
}
