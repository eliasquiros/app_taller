import { createClient } from "@/lib/supabase";
import GestorIntegrantes from "./GestorIntegrantes";
import { UserPlus } from "lucide-react";

export const metadata = { title: "Integrantes | Taller" };

export default async function IntegrantesPage() {
  const supabase = await createClient();
  
  const { data: integrantes } = await supabase
    .from("integrantes")
    .select("*, equipos(nombre)")
    .order("nombre", { ascending: true })
    .order("apellido", { ascending: true });

  return (
    <main className="mx-auto w-full max-w-4xl p-4 lg:p-8 space-y-8 animate-fade-in">
      <header className="flex items-center gap-3 bg-white p-4 lg:p-6 rounded-2xl shadow-sm border border-sapphire-100/50">
        <UserPlus className="text-sapphire-500" size={32} />
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-sapphire-900">Gestión de Integrantes</h1>
          <p className="text-sm text-sapphire-400 mt-1">Administra los participantes</p>
        </div>
      </header>
      <GestorIntegrantes integrantesIniciales={integrantes || []} />
    </main>
  );
}
