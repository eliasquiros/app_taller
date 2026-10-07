"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Puntuación" },
  { href: "/equipos", label: "Equipos" },
  { href: "/integrantes", label: "Integrantes" },
  { href: "/historial", label: "Historial" },
];

export default function NavBar() {
  const pathname = usePathname();

  // No mostrar navbar en login
  if (pathname === "/login") return null;

  return (
    <nav className="sticky bottom-0 w-full border-t border-slate-200 bg-white pb-safe">
      <ul className="flex justify-around p-2">
        {links.map(({ href, label }) => {
          const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex flex-col items-center rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  isActive ? "text-blue-600" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
