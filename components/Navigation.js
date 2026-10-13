"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Menu, X, Trophy, Users, User, Clock } from "lucide-react";

const navLinks = [
  { href: "/", label: "Puntuación", icon: Trophy },
  { href: "/equipos", label: "Equipos", icon: Users },
  { href: "/integrantes", label: "Integrantes", icon: User },
  { href: "/historial", label: "Historial", icon: Clock },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user?.email) {
          setUsuario(data.user.email.split("@")[0]);
        }
      });
    } catch {
      // Ignorar si no hay sesión
    }
  }, []);

  if (pathname === "/login") return null;

  return (
    <>
      {/* Botón flotante para abrir el menú (Top Bar Móvil) */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between bg-sapphire-900 px-4 text-white shadow-md lg:hidden">
        <div className="flex items-center">
          <button
            onClick={() => setIsOpen(true)}
            className="rounded-lg p-2 hover:bg-sapphire-800 transition-colors"
          >
            <Menu size={24} />
          </button>
          <span className="ml-3 text-lg font-bold">Taller</span>
        </div>

        {/* Usuario actual visible en la barra superior móvil */}
        {usuario && (
          <div className="flex items-center gap-1.5 text-xs font-semibold bg-sapphire-800/90 px-2.5 py-1.5 rounded-lg text-sapphire-200 border border-sapphire-700/60 shadow-xs">
            <User size={13} className="text-sapphire-400 shrink-0" />
            <span className="max-w-[120px] truncate">{usuario}</span>
          </div>
        )}
      </header>

      {/* Overlay oscuro para cerrar al hacer clic */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menú Lateral */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-sapphire-900 text-white shadow-2xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 flex flex-col justify-between ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="flex h-14 items-center justify-between px-4 lg:justify-center border-b border-sapphire-800">
            <span className="text-xl font-bold tracking-wider">TALLER</span>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-2 hover:bg-sapphire-800 lg:hidden transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="mt-8 flex flex-col gap-2 px-4">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                    isActive
                      ? "bg-sapphire-500 text-white shadow-lg"
                      : "text-sapphire-100 hover:bg-sapphire-800 hover:text-white"
                  }`}
                >
                  <Icon size={20} className={isActive ? "animate-pulse" : ""} />
                  <span className="font-medium">{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Usuario en el pie del menú lateral */}
        {usuario && (
          <div className="p-4 border-t border-sapphire-800 flex items-center gap-2.5 text-xs text-sapphire-200 bg-sapphire-950/30">
            <div className="w-8 h-8 rounded-full bg-sapphire-800 flex items-center justify-center text-sapphire-200 font-bold border border-sapphire-700 shrink-0">
              <User size={15} />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-white truncate">{usuario}</p>
              <p className="text-[10px] text-sapphire-400">Usuario activo</p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
