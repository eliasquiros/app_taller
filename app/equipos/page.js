import { createClient } from "@/lib/supabase";
import GestorEquipos from "./GestorEquipos";

export const metadata = { title: "Equipos | Taller" };

export default async function EquiposPage() {
  const supabase = await createClient();
  
  // Obtenemos los equipos con sus integrantes
  const { data: equipos } = await supabase
    .from("equipos")
    .select("*, integrantes(*)")
    .order("nombre", { ascending: true });

  // Obtenemos todos los integrantes para saber cuáles están libres
  const { data: integrantes } = await supabase
    .from("integrantes")
    .select("*");

  return (
    <main className="mx-auto w-full max-w-2xl p-4 space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Gestión de equipos</h1>
      </header>
      <GestorEquipos equipos={equipos || []} integrantes={integrantes || []} />
    </main>
  );
}
