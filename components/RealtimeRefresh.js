"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function RealtimeRefresh() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const canal = supabase
      .channel("tabla_cambios")
      .on("postgres_changes", { event: "*", schema: "public", table: "equipos" }, () => {
        router.refresh();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "integrantes" }, () => {
        router.refresh();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "historial_puntos" }, () => {
        router.refresh();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, [router]);

  return null;
}
