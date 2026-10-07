import Navigation from "@/components/Navigation";
import "./globals.css";

export const metadata = {
  title: "Taller",
  description: "Tabla de puntuación del taller",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="flex min-h-full flex-col lg:flex-row bg-background text-foreground">
        <Navigation />
        <div className="flex-1 overflow-x-hidden">{children}</div>
      </body>
    </html>
  );
}
