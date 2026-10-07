import { createClient } from "@/lib/supabase";
import { getUsuario } from "@/lib/auth";
import { cerrarSesion } from "@/app/actions/auth";
import RealtimeRefresh from "@/components/RealtimeRefresh";
import { LogOut, Trophy, Medal } from "lucide-react";

export default async function Home() {
  const usuario = await getUsuario();
  const supabase = await createClient();

  const { data: equipos } = await supabase
    .from("tabla_puntuacion")
    .select("*")
    .order("puesto", { ascending: true })
    .order("nombre", { ascending: true });

  return (
    <main className="mx-auto w-full max-w-5xl p-4 lg:p-10 space-y-6 lg:space-y-8 animate-fade-in">
      <RealtimeRefresh />
      <header className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-5 lg:p-8 rounded-3xl shadow-sm border border-sapphire-100/50 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-sapphire-900 flex items-center gap-3 lg:gap-4">
            <Trophy className="text-sapphire-500" size={32} className="sm:w-10 sm:h-10" />
            Tabla de Puntuación
          </h1>
          <p className="text-sm sm:text-base text-sapphire-400 mt-2">Sigue los resultados en tiempo real</p>
        </div>
        <form action={cerrarSesion} className="self-end sm:self-auto">
          <button className="flex items-center gap-2 text-sm sm:text-base font-medium text-sapphire-500 hover:text-sapphire-800 transition-colors bg-sapphire-50 px-4 py-2.5 rounded-xl hover:bg-sapphire-100">
            <LogOut size={20} />
            <span>Salir ({usuario})</span>
          </button>
        </form>
      </header>

      <div className="overflow-hidden rounded-2xl lg:rounded-3xl bg-white shadow-xl shadow-sapphire-900/5 border border-sapphire-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm sm:text-base lg:text-lg">
            <thead className="bg-sapphire-900 text-white">
              <tr>
                <th className="px-3 sm:px-6 lg:px-8 py-4 lg:py-5 font-bold w-16 sm:w-24 lg:w-28 text-center text-xs sm:text-sm lg:text-lg">Posición</th>
                <th className="px-3 sm:px-6 lg:px-8 py-4 lg:py-5 font-bold text-xs sm:text-sm lg:text-lg">Equipo</th>
                <th className="px-3 sm:px-6 lg:px-8 py-4 lg:py-5 font-bold text-right w-24 sm:w-32 lg:w-40 text-xs sm:text-sm lg:text-lg">Puntos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sapphire-50 relative">
              {equipos?.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-4 lg:px-8 py-12 lg:py-16 text-center text-sapphire-400 font-medium text-base lg:text-lg">
                    No hay equipos registrados.
                  </td>
                </tr>
              ) : (
                equipos?.map((equipo, idx) => {
                  const isTop3 = equipo.puesto <= 3;
                  return (
                    <tr 
                      key={equipo.id} 
                      className="group transition-all duration-500 hover:bg-sapphire-50"
                      style={{ animation: `slide-in-right 0.4s ease-out ${idx * 0.05}s backwards` }}
                    >
                      <td className="px-3 sm:px-6 lg:px-8 py-3 lg:py-5">
                        <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto rounded-full font-bold text-base sm:text-lg lg:text-xl
                          ${equipo.puesto === 1 ? 'bg-amber-100 text-amber-600 shadow-amber-200' :
                            equipo.puesto === 2 ? 'bg-slate-100 text-slate-500 shadow-slate-200' :
                            equipo.puesto === 3 ? 'bg-orange-50 text-orange-600 shadow-orange-100' :
                            'bg-sapphire-50 text-sapphire-400'}`}>
                          {equipo.puesto}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 lg:px-8 py-3 lg:py-5 font-bold text-sapphire-900 text-base sm:text-lg lg:text-xl group-hover:text-sapphire-500 transition-colors">
                        {equipo.nombre}
                        {isTop3 && <Medal className={`inline-block ml-1.5 lg:ml-3 w-4 h-4 lg:w-6 lg:h-6 ${
                            equipo.puesto === 1 ? 'text-amber-500' :
                            equipo.puesto === 2 ? 'text-slate-400' :
                            'text-orange-500'
                          }`} />}
                      </td>
                      <td className="px-3 sm:px-6 lg:px-8 py-3 lg:py-5 text-right">
                        <span className="inline-flex items-center justify-center min-w-[2.5rem] lg:min-w-[4rem] px-2 sm:px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg lg:rounded-xl bg-sapphire-500 text-white font-extrabold text-base sm:text-lg lg:text-xl shadow-sm">
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
    </main>
  );
}
