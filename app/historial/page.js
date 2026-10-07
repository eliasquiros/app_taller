import { createClient } from "@/lib/supabase";
import RealtimeRefresh from "@/components/RealtimeRefresh";
import { Clock, TrendingUp, TrendingDown } from "lucide-react";

export const metadata = { title: "Historial | Taller" };

export default async function HistorialPage() {
  const supabase = await createClient();

  const { data: historial } = await supabase
    .from("historial_puntos")
    .select("*, equipos(nombre)")
    .order("fecha", { ascending: false });

  return (
    <main className="mx-auto w-full max-w-4xl p-4 lg:p-8 space-y-8 animate-fade-in">
      <RealtimeRefresh />
      <header className="flex items-center gap-3 bg-white p-4 lg:p-6 rounded-2xl shadow-sm border border-sapphire-100/50">
        <Clock className="text-sapphire-500" size={32} />
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-sapphire-900">Historial de Puntos</h1>
          <p className="text-sm text-sapphire-400 mt-1">Registro de todas las modificaciones</p>
        </div>
      </header>

      <ul className="divide-y divide-sapphire-50 rounded-2xl bg-white shadow-lg shadow-sapphire-900/5 border border-sapphire-50 overflow-hidden">
        {historial?.length === 0 ? (
          <li className="p-8 text-center text-sapphire-400 font-medium">No hay movimientos registrados.</li>
        ) : (
          historial?.map((mov, idx) => {
            const fecha = new Date(mov.fecha);
            const sumó = mov.cantidad > 0;
            return (
              <li 
                key={mov.id} 
                className="p-5 flex justify-between items-center hover:bg-sapphire-50/50 transition-colors"
                style={{ animation: `slide-up 0.3s ease-out ${idx * 0.02}s backwards` }}
              >
                <div className="flex items-center gap-4">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${sumó ? "bg-sapphire-100 text-sapphire-600" : "bg-red-100 text-red-600"}`}>
                    {sumó ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                  </div>
                  <div>
                    <p className="font-bold text-sapphire-900 text-lg">
                      {mov.equipos ? mov.equipos.nombre : <span className="text-sapphire-400 italic">Equipo eliminado</span>}
                    </p>
                    <p className="text-sm font-medium text-sapphire-500 mt-0.5">
                      Por <span className="font-semibold text-sapphire-700">{mov.usuario}</span> el {fecha.toLocaleDateString()} a las {fecha.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
                <div className={`font-extrabold text-2xl ${sumó ? "text-sapphire-600" : "text-red-500"}`}>
                  {sumó ? "+" : ""}{mov.cantidad}
                </div>
              </li>
            );
          })
        )}
      </ul>
    </main>
  );
}
