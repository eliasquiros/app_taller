"use client";

import { useState } from "react";
import { LogOut, Trophy, Medal, EyeOff, Eye, Sparkles, Users, User } from "lucide-react";
import { cerrarSesion } from "@/app/actions/auth";
import PodioGanadores from "@/components/PodioGanadores";

export default function TablaRanking({ equipos = [], usuario }) {
  const [isOculto, setIsOculto] = useState(false);
  const [mostrarPodio, setMostrarPodio] = useState(false);

  const handleCerrarPodio = () => {
    setMostrarPodio(false);
    setIsOculto(false); // Restablece todo a la normalidad
  };

  return (
    <>
      {/* Encabezado con título, usuario actual y botones de acción */}
      <header className="flex flex-col md:flex-row md:items-center justify-between bg-white p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-sapphire-100/50 gap-4">
        {/* Bloque de Título y Nombre de Usuario (visible en móvil y escritorio) */}
        <div className="flex flex-col gap-1 w-full md:w-auto">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="p-2 sm:p-3 rounded-2xl bg-sapphire-50 text-sapphire-600 shrink-0">
                <Trophy className="w-6 h-6 sm:w-9 sm:h-9" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-sapphire-900">
                  Tabla de Puntuación
                </h1>
                <p className="text-xs sm:text-sm text-sapphire-400 mt-0.5">
                  Sigue los resultados en tiempo real
                </p>
              </div>
            </div>

            {/* Insignia de usuario para móvil (< md) */}
            {usuario && (
              <div className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sapphire-50 border border-sapphire-200/80 text-sapphire-800 text-xs font-bold shrink-0">
                <User size={14} className="text-sapphire-500 shrink-0" />
                <span className="max-w-[110px] truncate">{usuario}</span>
              </div>
            )}
          </div>
        </div>

        {/* Barra superior de botones adaptada a móviles y computadoras */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 w-full md:w-auto">
          {/* Insignia de usuario para computadora (>= md) */}
          {usuario && (
            <div className="hidden md:flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-sapphire-50 border border-sapphire-200/80 text-sapphire-800 text-sm font-semibold shrink-0">
              <User size={16} className="text-sapphire-500 shrink-0" />
              <span>
                Usuario: <strong className="text-sapphire-900 font-extrabold">{usuario}</strong>
              </span>
            </div>
          )}

          {!isOculto ? (
            /* Modo normal: Botón Ocultar y Botón Salir */
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setIsOculto(true)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-sapphire-700 bg-sapphire-50 hover:bg-sapphire-100 border border-sapphire-200/80 px-4 py-2.5 rounded-xl transition-all shadow-xs active:scale-95"
                title="Ocultar nombres de los equipos"
              >
                <EyeOff size={17} className="text-sapphire-500 shrink-0" />
                <span>Ocultar</span>
              </button>

              <form action={cerrarSesion} className="flex-1 sm:flex-initial shrink-0">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-1.5 text-xs sm:text-sm font-medium text-sapphire-600 hover:text-sapphire-900 transition-colors bg-sapphire-50 px-3 sm:px-4 py-2.5 rounded-xl hover:bg-sapphire-100 border border-sapphire-100/80"
                  title={`Cerrar sesión de ${usuario}`}
                >
                  <LogOut size={16} className="shrink-0" />
                  <span>Salir ({usuario})</span>
                </button>
              </form>
            </div>
          ) : (
            /* Modo Oculto: Opciones en móvil y computadora */
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              {/* Botón de ganadores destacado */}
              <button
                onClick={() => setMostrarPodio(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 px-4 py-2.5 rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 animate-pulse text-center"
                title="Desplegar la animación del podio de ganadores"
              >
                <Sparkles size={17} className="text-amber-200 shrink-0" />
                <span>Mostrar ganadores</span>
              </button>

              {/* Botón Volver y Salir en fila */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setIsOculto(false)}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/90 px-3.5 py-2.5 rounded-xl transition-all shadow-xs active:scale-95 text-center"
                  title="Volver a mostrar el ranking completo"
                >
                  <Eye size={17} className="text-slate-600 shrink-0" />
                  <span>Volver al ranking</span>
                </button>

                <form action={cerrarSesion} className="flex-1 sm:flex-initial shrink-0">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-1.5 text-xs sm:text-sm font-medium text-sapphire-600 hover:text-sapphire-900 transition-colors bg-sapphire-50 px-3 sm:px-4 py-2.5 rounded-xl hover:bg-sapphire-100 border border-sapphire-100/80"
                    title={`Cerrar sesión de ${usuario}`}
                  >
                    <LogOut size={16} className="shrink-0" />
                    <span>Salir ({usuario})</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Tabla de Resultados */}
      <div className="overflow-hidden rounded-2xl lg:rounded-3xl bg-white shadow-xl shadow-sapphire-900/5 border border-sapphire-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm sm:text-base lg:text-lg">
            <thead className="bg-sapphire-900 text-white">
              <tr>
                <th className="px-3 sm:px-6 lg:px-8 py-3.5 sm:py-4 lg:py-5 font-bold w-14 sm:w-24 lg:w-28 text-center text-xs sm:text-sm lg:text-base">
                  Posición
                </th>
                <th className="px-3 sm:px-6 lg:px-8 py-3.5 sm:py-4 lg:py-5 font-bold text-xs sm:text-sm lg:text-base">
                  Equipo / Integrantes
                </th>
                <th className="px-3 sm:px-6 lg:px-8 py-3.5 sm:py-4 lg:py-5 font-bold text-right w-20 sm:w-32 lg:w-40 text-xs sm:text-sm lg:text-base">
                  Puntos
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sapphire-50 relative">
              {equipos?.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="px-4 lg:px-8 py-12 lg:py-16 text-center text-sapphire-400 font-medium text-sm sm:text-base lg:text-lg"
                  >
                    No hay equipos registrados.
                  </td>
                </tr>
              ) : (
                equipos?.map((equipo, idx) => {
                  const isTop3 = equipo.puesto <= 3;
                  const skeletonWidthNombre = Math.min(220, Math.max(120, (((idx + 1) * 53) % 110) + 110));
                  const skeletonWidthIntegrantes = Math.min(180, Math.max(100, (((idx + 1) * 37) % 90) + 90));

                  return (
                    <tr
                      key={equipo.id}
                      className="group transition-all duration-300 hover:bg-sapphire-50/70"
                      style={{ animation: `slide-in-right 0.3s ease-out ${idx * 0.04}s backwards` }}
                    >
                      {/* Posición */}
                      <td className="px-2.5 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5">
                        <div
                          className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 mx-auto rounded-full font-bold text-xs sm:text-base lg:text-lg
                          ${
                            equipo.puesto === 1
                              ? "bg-amber-100 text-amber-600 shadow-amber-200"
                              : equipo.puesto === 2
                              ? "bg-slate-100 text-slate-500 shadow-slate-200"
                              : equipo.puesto === 3
                              ? "bg-orange-50 text-orange-600 shadow-orange-100"
                              : "bg-sapphire-50 text-sapphire-500"
                          }`}
                        >
                          {equipo.puesto}
                        </div>
                      </td>

                      {/* Nombre del equipo e Integrantes (o Skeleton View) */}
                      <td className="px-2.5 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5">
                        {isOculto ? (
                          <div className="space-y-1.5 py-1">
                            {/* Skeleton para el nombre del equipo */}
                            <div
                              className="h-5 sm:h-6 bg-gradient-to-r from-slate-200 via-sapphire-100 to-slate-200 animate-pulse rounded-md"
                              style={{ width: `${skeletonWidthNombre}px` }}
                            />
                            {/* Skeleton para los integrantes */}
                            <div
                              className="h-3.5 sm:h-4 bg-slate-200/70 animate-pulse rounded-md"
                              style={{ width: `${skeletonWidthIntegrantes}px` }}
                            />
                          </div>
                        ) : (
                          <div>
                            <div className="font-bold text-sapphire-900 text-sm sm:text-base lg:text-lg group-hover:text-sapphire-600 transition-colors flex items-center gap-1.5">
                              <span>{equipo.nombre}</span>
                              {isTop3 && (
                                <Medal
                                  className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${
                                    equipo.puesto === 1
                                      ? "text-amber-500"
                                      : equipo.puesto === 2
                                      ? "text-slate-400"
                                      : "text-orange-500"
                                  }`}
                                />
                              )}
                            </div>

                            {/* Nombres de los integrantes */}
                            {equipo.integrantes && equipo.integrantes.length > 0 && (
                              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-sapphire-600/90 font-medium mt-1">
                                <Users size={13} className="text-sapphire-400 shrink-0" />
                                <span className="line-clamp-1 sm:line-clamp-2">
                                  {equipo.integrantes
                                    .map((i) => `${i.nombre} ${i.apellido}`)
                                    .join(", ")}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Puntos (siempre visibles) */}
                      <td className="px-2.5 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 text-right">
                        <span className="inline-flex items-center justify-center min-w-[2.2rem] sm:min-w-[3.5rem] px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-sapphire-500 text-white font-black text-xs sm:text-base lg:text-lg shadow-sm">
                          {equipo.puntos}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pantalla y animación de Podio de Ganadores */}
      {mostrarPodio && (
        <PodioGanadores
          equipos={equipos}
          onCerrar={handleCerrarPodio}
        />
      )}
    </>
  );
}
