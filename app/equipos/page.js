import { createClient } from "@/lib/supabase";
import GestorEquipos from "./GestorEquipos";
import { Users } from "lucide-react";

export const metadata = { title: "Equipos | Taller" };

export default async function EquiposPage() {
  const supabase = await createClient();
  
  const { data: equipos } = await supabase
    .from("equipos")
    .select("*, integrantes(*)")
    .order("nombre", { ascending: true });

  const { data: integrantes } = await supabase
    .from("integrantes")
    .select("*");

  return (
    <main className="mx-auto w-full max-w-4xl p-4 lg:p-8 space-y-8 animate-fade-in">
      <header className="flex items-center gap-3 bg-white p-4 lg:p-6 rounded-2xl shadow-sm border border-sapphire-100/50">
        <Users className="text-sapphire-500" size={32} />
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-sapphire-900">Gestión de Equipos</h1>
          <p className="text-sm text-sapphire-400 mt-1">Busca, edita y ajusta puntos</p>
        </div>
      </header>
      <GestorEquipos equipos={equipos || []} integrantes={integrantes || []} />
    </main>
  );
}
