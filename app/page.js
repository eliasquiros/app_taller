import { createClient } from "@/lib/supabase";
import { getUsuario } from "@/lib/auth";
import { cerrarSesion } from "@/app/actions/auth";
import RealtimeRefresh from "@/components/RealtimeRefresh";

export default async function Home() {
  const usuario = await getUsuario();
  const supabase = await createClient();

  const { data: equipos } = await supabase
    .from("tabla_puntuacion")
    .select("*")
    .order("puesto", { ascending: true })
    .order("nombre", { ascending: true });

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 p-4 space-y-6">
      <RealtimeRefresh />
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Puntuación</h1>
        <form action={cerrarSesion}>
          <button className="text-sm text-blue-600 hover:underline">
            Cerrar sesión ({usuario})
          </button>
        </form>
      </header>

      <div className="overflow-hidden rounded-xl bg-white shadow">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-semibold w-16 text-center">Pos</th>
              <th className="px-4 py-3 font-semibold">Equipo</th>
              <th className="px-4 py-3 font-semibold text-right">Puntos</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {equipos?.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-4 py-8 text-center text-slate-500">
                  No hay equipos registrados.
                </td>
              </tr>
            ) : (
              equipos?.map((equipo) => (
                <tr key={equipo.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-center font-bold text-slate-400">
                    {equipo.puesto}
                  </td>
                  <td className="px-4 py-3 font-medium">{equipo.nombre}</td>
                  <td className="px-4 py-3 text-right text-lg font-bold text-blue-600">
                    {equipo.puntos}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
