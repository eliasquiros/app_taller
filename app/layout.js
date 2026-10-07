import NavBar from "@/components/NavBar";
import "./globals.css";

export const metadata = {
  title: "Taller",
  description: "Tabla de puntuación del taller",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-slate-100 text-slate-900">
        <div className="flex-1 pb-16">{children}</div>
        <NavBar />
      </body>
    </html>
  );
}
