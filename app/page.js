import { createClient } from "@/lib/supabase";
import { getUsuario } from "@/lib/auth";
import RealtimeRefresh from "@/components/RealtimeRefresh";
import TablaRanking from "@/components/TablaRanking";

export default async function Home() {
  const usuario = await getUsuario();
  const supabase = await createClient();

  const [{ data: equipos }, { data: integrantes }] = await Promise.all([
    supabase
      .from("tabla_puntuacion")
      .select("*")
      .order("puesto", { ascending: true })
      .order("nombre", { ascending: true }),
    supabase
      .from("integrantes")
      .select("*")
      .order("nombre", { ascending: true }),
  ]);

  // Asociamos los integrantes a cada equipo correspondiente
  const equiposConIntegrantes = (equipos ?? []).map((eq) => ({
    ...eq,
    integrantes: (integrantes ?? []).filter((i) => i.equipo_id === eq.id),
  }));

  return (
    <main className="mx-auto w-full max-w-5xl p-3 sm:p-6 lg:p-10 space-y-4 sm:space-y-6 lg:space-y-8 animate-fade-in">
      <RealtimeRefresh />
      <TablaRanking equipos={equiposConIntegrantes} usuario={usuario} />
    </main>
  );
}
