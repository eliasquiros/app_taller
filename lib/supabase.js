import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

const cookieOptions = {
  httpOnly: true, // el navegador no puede leer el token con JavaScript
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
};

/** Cliente de Supabase sobre un adaptador de cookies { getAll, setAll }. */
export function createSupabase(cookieAdapter) {
  return createServerClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
    cookies: cookieAdapter,
    cookieOptions,
  });
}

/** Cliente para Server Components y Server Actions. */
export async function createClient() {
  const store = await cookies();
  return createSupabase({
    getAll: () => store.getAll(),
    setAll: (list) => {
      try {
        list.forEach(({ name, value, options }) => store.set(name, value, options));
      } catch {
        // Server Components no pueden escribir cookies; proxy.js refresca la sesión.
      }
    },
  });
}
