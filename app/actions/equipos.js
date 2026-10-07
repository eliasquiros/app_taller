"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase";

export async function guardarEquipo(_estadoPrevio, formData) {
  const idStr = formData.get("id");
  const id = idStr ? parseInt(idStr, 10) : null;
  const nombre = String(formData.get("nombre") ?? "").trim();
  const integrantes = formData.getAll("integrantes").map(Number).filter(Boolean);

  if (!nombre) return { error: "El nombre del equipo es obligatorio." };
  if (integrantes.length < 2 || integrantes.length > 3) {
    return { error: "El equipo debe tener 2 o 3 integrantes." };
  }

  const supabase = await createClient();

  // Llamada al stored procedure guardar_equipo
  const { error } = await supabase.rpc("guardar_equipo", {
    p_nombre: nombre,
    p_integrantes: integrantes,
    p_id: id,
  });

  if (error) {
    return { error: error.message || "Error al guardar el equipo." };
  }

  revalidatePath("/");
  revalidatePath("/equipos");
  revalidatePath("/integrantes");
  
  return { success: true };
}

export async function eliminarEquipo(id) {
  const supabase = await createClient();
  const { error } = await supabase.from("equipos").delete().eq("id", id);
  
  if (error) return { error: "Error al eliminar el equipo." };

  revalidatePath("/");
  revalidatePath("/equipos");
  revalidatePath("/integrantes");
  return { success: true };
}

export async function ajustarPuntos(_estadoPrevio, formData) {
  const equipo_id = parseInt(formData.get("equipo_id"), 10);
  const cantidadStr = formData.get("cantidad");
  const cantidad = parseInt(cantidadStr, 10);
  const operacion = formData.get("operacion"); // "suma" o "resta"

  if (!equipo_id || isNaN(cantidad) || cantidad <= 0) {
    return { error: "Cantidad inválida." };
  }

  const puntosFinales = operacion === "resta" ? -cantidad : cantidad;

  const supabase = await createClient();
  const { error } = await supabase.rpc("ajustar_puntos", {
    p_equipo_id: equipo_id,
    p_cantidad: puntosFinales,
  });

  if (error) return { error: error.message || "Error al ajustar puntos." };

  revalidatePath("/");
  revalidatePath("/equipos");
  revalidatePath("/historial");
  return { success: true };
}
