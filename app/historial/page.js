import { createClient } from "@/lib/supabase";
import RealtimeRefresh from "@/components/RealtimeRefresh";

export const metadata = { title: "Historial | Taller" };

export default async function HistorialPage() {
  const supabase = await createClient();

  const { data: historial } = await supabase
    .from("historial_puntos")
    .select("*, equipos(nombre)")
    .order("fecha", { ascending: false });

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 p-4 space-y-6">
      <RealtimeRefresh />
      <header>
        <h1 className="text-2xl font-bold">Historial de puntos</h1>
      </header>

      <ul className="divide-y divide-slate-100 rounded-xl bg-white shadow">
        {historial?.length === 0 ? (
          <li className="p-4 text-center text-slate-500">No hay movimientos registrados.</li>
        ) : (
          historial?.map((mov) => {
            const fecha = new Date(mov.fecha);
            const sumó = mov.cantidad > 0;
            return (
              <li key={mov.id} className="p-4 flex justify-between items-center hover:bg-slate-50">
                <div>
                  <p className="font-medium">
                    {mov.equipos ? mov.equipos.nombre : <span className="text-slate-400">Equipo eliminado</span>}
                  </p>
                  <p className="text-xs text-slate-500">
                    Por {mov.usuario} el {fecha.toLocaleDateString()} a las {fecha.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <div className={`font-bold text-lg ${sumó ? "text-blue-600" : "text-red-600"}`}>
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
