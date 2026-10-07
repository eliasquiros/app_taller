import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase";

const DOMINIO = "taller.local";

export const USUARIO_VALIDO = /^[a-z0-9._-]{3,30}$/;

export const usuarioAEmail = (usuario) => `${usuario}@${DOMINIO}`;

/** Devuelve el nombre de usuario de la sesión verificada o redirige al login. */
export const getUsuario = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const email = data?.claims?.email;
  if (!email) redirect("/login");
  return email.split("@")[0];
});
