"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import confetti from "canvas-confetti";
import { Trophy, Medal, Sparkles, RotateCcw, X, ArrowLeft, Crown, Users } from "lucide-react";

// Generador de redoble de tambor usando Web Audio API (nativo, sin archivos mp3)
function reproducirRedobleWebAudio() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    const ctx = new AudioCtx();
    if (ctx.state === "suspended") ctx.resume();

    const bufferSize = Math.floor(ctx.sampleRate * 0.04);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    let golpe = 0;
    const interval = setInterval(() => {
      if (ctx.state !== "running") return;
      golpe++;
      const source = ctx.createBufferSource();
      source.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 850 + (golpe % 3) * 150;
      filter.Q.value = 2.5;

      const gain = ctx.createGain();
      const volumen = Math.min(0.2, 0.06 + golpe * 0.002);
      gain.gain.setValueAtTime(volumen, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      source.start();
    }, 55);

    return () => {
      clearInterval(interval);
      try { ctx.close(); } catch {}
    };
  } catch {
    return null;
  }
}

// Fanfarria triunfal al anunciar al ganador
function reproducirFanfarria() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === "suspended") ctx.resume();

    const notas = [523.25, 659.25, 783.99, 1046.50];
    notas.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.09);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.09);
      osc.stop(ctx.currentTime + 2.2);
    });
  } catch {}
}

export default function PodioGanadores({ equipos = [], onCerrar }) {
  // Secuencia de animación:
  // 0: Introducción (~2.5s)
  // 1: Revelación 3er Lugar (~5s)
  // 2: Revelación 2do Lugar (~5s)
  // "tambores": Animación de tambores previo al 1er lugar (~4.5s)
  // 3: Revelación 1er Lugar (Ganador + Confeti + Fanfarria)
  const [paso, setPaso] = useState(0);
  const confettiIntervalRef = useRef(null);
  const audioDetenerRef = useRef(null);

  const top3 = equipos.slice(0, 3);
  const primerLugar = top3[0] || null;
  const segundoLugar = top3[1] || null;
  const tercerLugar = top3[2] || null;

  const lanzarConfetiCelebracion = useCallback(() => {
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#FFD700", "#FFA500", "#0474C4", "#FFFFFF", "#38BDF8"],
      });

      const end = Date.now() + 3500;
      const interval = setInterval(() => {
        if (Date.now() > end) {
          clearInterval(interval);
          return;
        }

        confetti({
          particleCount: 35,
          angle: 60,
          spread: 60,
          origin: { x: 0, y: 0.75 },
          colors: ["#FFD700", "#FFA500", "#0474C4", "#FFFFFF"],
        });
        confetti({
          particleCount: 35,
          angle: 120,
          spread: 60,
          origin: { x: 1, y: 0.75 },
          colors: ["#FFD700", "#FFA500", "#0474C4", "#FFFFFF"],
        });
      }, 350);

      confettiIntervalRef.current = interval;
    } catch (e) {
      console.error("Error al lanzar confeti", e);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (confettiIntervalRef.current) clearInterval(confettiIntervalRef.current);
      if (audioDetenerRef.current) audioDetenerRef.current();
    };
  }, []);

  // Control de tiempos entre etapas (~5 segundos entre puestos y tambores previos al 1°)
  useEffect(() => {
    let timer;

    if (paso === 0) {
      timer = setTimeout(() => setPaso(1), 2500);
    } else if (paso === 1) {
      timer = setTimeout(() => setPaso(2), 5000);
    } else if (paso === 2) {
      timer = setTimeout(() => {
        setPaso("tambores");
      }, 5000);
    } else if (paso === "tambores") {
      audioDetenerRef.current = reproducirRedobleWebAudio();
      timer = setTimeout(() => {
        if (audioDetenerRef.current) {
          audioDetenerRef.current();
          audioDetenerRef.current = null;
        }
        setPaso(3);
        reproducirFanfarria();
        lanzarConfetiCelebracion();
      }, 4500);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [paso, lanzarConfetiCelebracion]);

  const saltarAlFinal = () => {
    if (audioDetenerRef.current) {
      audioDetenerRef.current();
      audioDetenerRef.current = null;
    }
    setPaso(3);
    reproducirFanfarria();
    lanzarConfetiCelebracion();
  };

  const reiniciarAnimacion = () => {
    if (confettiIntervalRef.current) clearInterval(confettiIntervalRef.current);
    if (audioDetenerRef.current) audioDetenerRef.current();
    setPaso(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between overflow-y-auto overflow-x-hidden bg-slate-950/95 text-white backdrop-blur-md p-3 sm:p-6 lg:p-10 animate-fade-in select-none">
      {/* Resplandor ambiental de fondo */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-sapphire-500/15 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-amber-500/10 rounded-full blur-3xl" />

      {/* Barra superior con controles para móvil y escritorio */}
      <header className="relative z-10 flex items-center justify-between w-full max-w-5xl mx-auto border-b border-slate-800 pb-3 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="p-2 sm:p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base sm:text-xl lg:text-2xl font-extrabold tracking-tight text-white flex items-center gap-1.5 truncate">
              Podio de Ganadores
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-400 truncate">
              Resultados finales de la competencia
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {paso !== 3 && (
            <button
              onClick={saltarAlFinal}
              className="px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg sm:rounded-xl transition-all border border-slate-700"
            >
              Saltar
            </button>
          )}

          <button
            onClick={onCerrar}
            className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-rose-950/70 rounded-lg sm:rounded-xl transition-all border border-slate-700"
            title="Volver al menú y ranking normal"
          >
            <X size={16} />
            <span className="hidden xs:inline">Cerrar</span>
          </button>
        </div>
      </header>

      {/* Mensaje de estado dinámico */}
      <div className="relative z-10 text-center my-3 sm:my-5">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-lg text-xs sm:text-base font-semibold">
          {paso === 0 && (
            <span className="text-slate-300 animate-pulse flex items-center gap-2">
              ✨ ¡Iniciando premiación! Descubriendo los resultados...
            </span>
          )}
          {paso === 1 && (
            <span className="text-orange-300 flex items-center gap-2">
              <Medal className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
              🥉 ¡3er Lugar revelado!
            </span>
          )}
          {paso === 2 && (
            <span className="text-slate-200 flex items-center gap-2">
              <Medal className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300" />
              🥈 ¡2do Lugar revelado!
            </span>
          )}
          {paso === "tambores" && (
            <span className="text-amber-300 flex items-center gap-2 font-black animate-pulse">
              🥁 ¡REDOBLE DE TAMBORES! ¿Quién será el campeón?
            </span>
          )}
          {paso === 3 && (
            <span className="text-amber-300 flex items-center gap-2 font-bold animate-bounce">
              <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              🥇 ¡1er Lugar y Campeón del Taller!
            </span>
          )}
        </div>
      </div>

      {/* Podio Principal */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex-1 flex flex-col justify-end">
        {equipos.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm sm:text-base">
            No hay equipos registrados para mostrar en el podio.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1.5 sm:gap-4 lg:gap-6 items-end justify-center px-1 sm:px-4">
            
            {/* 🥈 2DO LUGAR (Izquierda) */}
            <div className="flex flex-col items-center">
              <div
                className={`w-full min-h-[120px] sm:min-h-[170px] p-2 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-700 ${
                  (paso === 2 || paso === "tambores" || paso === 3)
                    ? "opacity-100 translate-y-0 scale-100 bg-gradient-to-b from-slate-800/90 to-slate-900/90 border-2 border-slate-400 shadow-xl shadow-slate-500/10"
                    : "opacity-35 translate-y-3 scale-95 bg-slate-900/50 border border-slate-800 border-dashed"
                }`}
              >
                {(paso === 2 || paso === "tambores" || paso === 3) && segundoLugar ? (
                  <>
                    <div className="p-1.5 sm:p-2.5 rounded-full bg-slate-700/70 border border-slate-400/50 text-slate-200 mb-1 sm:mb-2 shadow-inner">
                      <Medal className="w-5 h-5 sm:w-7 sm:h-7 text-slate-300" />
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                      2° Lugar
                    </span>
                    <h3 className="font-extrabold text-xs sm:text-base lg:text-lg text-white mt-0.5 line-clamp-2">
                      {segundoLugar.nombre}
                    </h3>

                    {/* Integrantes del 2do lugar */}
                    {segundoLugar.integrantes && segundoLugar.integrantes.length > 0 && (
                      <div className="mt-1 flex items-center justify-center gap-1 text-[10px] sm:text-xs text-slate-300 font-medium">
                        <Users size={11} className="text-slate-400 shrink-0" />
                        <span className="line-clamp-2 text-center">
                          {segundoLugar.integrantes.map((i) => `${i.nombre} ${i.apellido}`).join(", ")}
                        </span>
                      </div>
                    )}

                    <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-bold bg-slate-700/80 text-slate-200 border border-slate-500/30">
                      {segundoLugar.puntos} pts
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-500 py-3">
                    <span className="text-xl sm:text-3xl font-black">?</span>
                    <span className="text-[9px] sm:text-xs mt-1 text-slate-500">2° Lugar</span>
                  </div>
                )}
              </div>

              {/* Pedestal Bloque */}
              <div className="w-full h-24 sm:h-36 lg:h-48 mt-2 rounded-t-xl sm:rounded-t-3xl bg-gradient-to-t from-slate-800 via-slate-700 to-slate-600 border-t-4 border-slate-300 shadow-2xl flex flex-col items-center justify-center text-white relative overflow-hidden">
                <span className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tighter text-slate-300/90 drop-shadow-md">
                  2
                </span>
                <span className="text-[9px] sm:text-xs uppercase tracking-widest font-bold text-slate-300 mt-0.5">
                  Plata
                </span>
              </div>
            </div>

            {/* 🥇 1ER LUGAR (Centro - El más alto) */}
            <div className="flex flex-col items-center">
              <div
                className={`w-full min-h-[140px] sm:min-h-[190px] p-2.5 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-700 relative ${
                  paso === 3
                    ? "opacity-100 translate-y-0 scale-100 bg-gradient-to-b from-amber-900/50 via-slate-900 to-slate-900 border-2 border-amber-400 shadow-2xl shadow-amber-500/30 ring-2 sm:ring-4 ring-amber-400/20"
                    : paso === "tambores"
                    ? "opacity-100 translate-y-0 scale-100 bg-amber-500/10 border-2 border-amber-400 shadow-2xl shadow-amber-500/30 animate-pulse"
                    : "opacity-35 translate-y-3 scale-95 bg-slate-900/50 border border-slate-800 border-dashed"
                }`}
              >
                {paso === 3 && primerLugar ? (
                  <>
                    <div className="absolute -top-5 sm:-top-6 p-2 sm:p-2.5 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 shadow-lg shadow-amber-500/50 animate-bounce">
                      <Crown className="w-5 h-5 sm:w-7 sm:h-7 fill-current" />
                    </div>
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-400 mt-2.5 sm:mt-3">
                      ¡CAMPEÓN!
                    </span>
                    <h3 className="font-black text-sm sm:text-lg lg:text-xl text-yellow-300 mt-0.5 line-clamp-2 drop-shadow-sm">
                      {primerLugar.nombre}
                    </h3>

                    {/* Integrantes del 1er lugar */}
                    {primerLugar.integrantes && primerLugar.integrantes.length > 0 && (
                      <div className="mt-1 flex items-center justify-center gap-1 text-[10px] sm:text-xs text-yellow-100 font-medium">
                        <Users size={12} className="text-yellow-300 shrink-0" />
                        <span className="line-clamp-2 text-center">
                          {primerLugar.integrantes.map((i) => `${i.nombre} ${i.apellido}`).join(", ")}
                        </span>
                      </div>
                    )}

                    <div className="mt-1.5 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-black bg-amber-500 text-slate-950 shadow-md">
                      {primerLugar.puntos} pts
                    </div>
                  </>
                ) : paso === "tambores" ? (
                  /* Animación especial de Tambores previa al anuncio */
                  <div className="flex flex-col items-center justify-center py-2 sm:py-4">
                    <div className="text-3xl sm:text-5xl animate-bounce mb-1">
                      🥁
                    </div>
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-amber-300 animate-pulse">
                      ¡REDOBLE!
                    </span>
                    <span className="text-[9px] sm:text-[11px] text-amber-200/80 font-medium mt-0.5">
                      Descubriendo al campeón...
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-amber-500/50 py-4">
                    <span className="text-2xl sm:text-4xl font-black">?</span>
                    <span className="text-[9px] sm:text-xs mt-1 text-slate-500 font-semibold">1° Lugar</span>
                  </div>
                )}
              </div>

              {/* Pedestal Bloque */}
              <div
                className={`w-full h-32 sm:h-48 lg:h-64 mt-2 rounded-t-xl sm:rounded-t-3xl bg-gradient-to-t from-amber-800 via-amber-600 to-yellow-500 border-t-4 border-yellow-300 shadow-2xl shadow-amber-600/30 flex flex-col items-center justify-center text-white relative overflow-hidden ${
                  paso === "tambores" ? "animate-pulse" : ""
                }`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-300/40 via-transparent to-transparent" />
                <span className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tighter text-slate-950/80 drop-shadow-lg">
                  1
                </span>
                <span className="text-[9px] sm:text-xs uppercase tracking-widest font-black text-amber-950 mt-0.5 bg-yellow-400/80 px-2 sm:px-3 py-0.5 rounded-full">
                  ORO
                </span>
              </div>
            </div>

            {/* 🥉 3ER LUGAR (Derecha) */}
            <div className="flex flex-col items-center">
              <div
                className={`w-full min-h-[120px] sm:min-h-[170px] p-2 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-700 ${
                  paso >= 1 || paso === "tambores"
                    ? "opacity-100 translate-y-0 scale-100 bg-gradient-to-b from-orange-950/50 to-slate-900/90 border-2 border-orange-500/60 shadow-xl shadow-orange-900/20"
                    : "opacity-35 translate-y-3 scale-95 bg-slate-900/50 border border-slate-800 border-dashed"
                }`}
              >
                {(paso >= 1 || paso === "tambores") && tercerLugar ? (
                  <>
                    <div className="p-1.5 sm:p-2.5 rounded-full bg-orange-950/80 border border-orange-600/50 text-orange-400 mb-1 sm:mb-2 shadow-inner">
                      <Medal className="w-5 h-5 sm:w-7 sm:h-7 text-orange-400" />
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-orange-400">
                      3° Lugar
                    </span>
                    <h3 className="font-extrabold text-xs sm:text-base lg:text-lg text-white mt-0.5 line-clamp-2">
                      {tercerLugar.nombre}
                    </h3>

                    {/* Integrantes del 3er lugar */}
                    {tercerLugar.integrantes && tercerLugar.integrantes.length > 0 && (
                      <div className="mt-1 flex items-center justify-center gap-1 text-[10px] sm:text-xs text-orange-200 font-medium">
                        <Users size={11} className="text-orange-400 shrink-0" />
                        <span className="line-clamp-2 text-center">
                          {tercerLugar.integrantes.map((i) => `${i.nombre} ${i.apellido}`).join(", ")}
                        </span>
                      </div>
                    )}

                    <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-bold bg-orange-950/80 text-orange-300 border border-orange-700/40">
                      {tercerLugar.puntos} pts
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-500 py-3">
                    <span className="text-xl sm:text-3xl font-black">?</span>
                    <span className="text-[9px] sm:text-xs mt-1 text-slate-500">3° Lugar</span>
                  </div>
                )}
              </div>

              {/* Pedestal Bloque */}
              <div className="w-full h-18 sm:h-28 lg:h-40 mt-2 rounded-t-xl sm:rounded-t-3xl bg-gradient-to-t from-orange-950 via-orange-900 to-amber-700 border-t-4 border-orange-400 shadow-2xl flex flex-col items-center justify-center text-white relative overflow-hidden">
                <span className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tighter text-orange-200/90 drop-shadow-md">
                  3
                </span>
                <span className="text-[9px] sm:text-xs uppercase tracking-widest font-bold text-orange-300 mt-0.5">
                  Bronce
                </span>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Barra de acciones inferior adaptada para móviles */}
      <footer className="relative z-10 w-full max-w-4xl mx-auto pt-4 sm:pt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 sm:gap-3">
        {paso === 3 && (
          <button
            onClick={reiniciarAnimacion}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold transition-all border border-slate-700 text-xs sm:text-sm order-2 sm:order-1"
          >
            <RotateCcw size={16} />
            <span>Repetir animación</span>
          </button>
        )}

        <button
          onClick={onCerrar}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sapphire-500 to-sapphire-600 hover:from-sapphire-600 hover:to-sapphire-700 text-white font-bold transition-all shadow-lg shadow-sapphire-500/25 hover:scale-105 active:scale-95 text-xs sm:text-base order-1 sm:order-2"
        >
          <ArrowLeft size={16} />
          <span>Volver al Ranking y mostrar normal</span>
        </button>
      </footer>
    </div>
  );
}
