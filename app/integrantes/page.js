import { createClient } from "@/lib/supabase";
import GestorIntegrantes from "./GestorIntegrantes";

export const metadata = { title: "Integrantes | Taller" };

export default async function IntegrantesPage() {
  const supabase = await createClient();
  
  const { data: integrantes } = await supabase
    .from("integrantes")
    .select("*, equipos(nombre)")
    .order("nombre", { ascending: true })
    .order("apellido", { ascending: true });

  return (
    <main className="mx-auto w-full max-w-2xl p-4 space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Gestión de integrantes</h1>
      </header>
      <GestorIntegrantes integrantesIniciales={integrantes || []} />
    </main>
  );
}
