"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { USUARIO_VALIDO, usuarioAEmail } from "@/lib/auth";

const ERROR_LOGIN = "Usuario o contraseña incorrectos";

export async function iniciarSesion(_estadoPrevio, formData) {
  const usuario = String(formData.get("usuario") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!USUARIO_VALIDO.test(usuario) || !password) return { error: ERROR_LOGIN, usuario };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: usuarioAEmail(usuario), password });
  if (error) return { error: ERROR_LOGIN, usuario };

  redirect("/");
}

export async function cerrarSesion() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
