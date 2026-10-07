import { NextResponse } from "next/server";
import { createSupabase } from "@/lib/supabase";

/** Refresca la sesión en cada request y protege todas las rutas excepto /login. */
export async function proxy(request) {
  let response = NextResponse.next({ request });

  const supabase = createSupabase({
    getAll: () => request.cookies.getAll(),
    setAll: (list, headers = {}) => {
      list.forEach(({ name, value }) => request.cookies.set(name, value));
      response = NextResponse.next({ request });
      list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
    },
  });

  const { data } = await supabase.auth.getClaims();
  const autenticado = Boolean(data?.claims);
  const enLogin = request.nextUrl.pathname === "/login";

  if (!autenticado && !enLogin) return redirigir("/login", request, response);
  if (autenticado && enLogin) return redirigir("/", request, response);
  return response;
}

/** Redirige conservando las cookies de sesión ya actualizadas. */
function redirigir(ruta, request, response) {
  const redirect = NextResponse.redirect(new URL(ruta, request.url));
  response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
