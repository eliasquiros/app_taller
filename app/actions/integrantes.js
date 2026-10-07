"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase";

export async function guardarIntegrante(_estadoPrevio, formData) {
  const id = formData.get("id");
  const nombre = String(formData.get("nombre") ?? "").trim();
  const apellido = String(formData.get("apellido") ?? "").trim();

  if (!nombre || !apellido) return { error: "Nombre y apellido son obligatorios." };

  const supabase = await createClient();

  if (id) {
    const { error } = await supabase.from("integrantes").update({ nombre, apellido }).eq("id", id);
    if (error) return { error: "Error al actualizar el integrante." };
  } else {
    const { error } = await supabase.from("integrantes").insert([{ nombre, apellido }]);
    if (error) return { error: "Error al crear el integrante." };
  }

  revalidatePath("/integrantes");
  return { success: true };
}

export async function eliminarIntegrante(id) {
  const supabase = await createClient();

  // Validar si pertenece a un equipo con solo 2 integrantes
  const { data: integrante } = await supabase
    .from("integrantes")
    .select("equipo_id")
    .eq("id", id)
    .single();

  if (integrante?.equipo_id) {
    const { count } = await supabase
      .from("integrantes")
      .select("*", { count: "exact", head: true })
      .eq("equipo_id", integrante.equipo_id);

    if (count && count <= 2) {
      return { error: "No se puede eliminar: el equipo quedaría con menos de 2 integrantes." };
    }
  }

  const { error } = await supabase.from("integrantes").delete().eq("id", id);
  if (error) return { error: "Error al eliminar el integrante." };

  revalidatePath("/integrantes");
  return { success: true };
}
