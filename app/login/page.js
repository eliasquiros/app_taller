import LoginForm from "./login-form";

export const metadata = { title: "Iniciar sesión | Taller" };

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-sapphire-900 p-6">
      <div className="w-full max-w-sm space-y-8 rounded-3xl bg-white p-8 shadow-2xl animate-slide-up">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-sapphire-900">Bienvenido</h1>
          <p className="text-sm text-sapphire-400">Ingresa tus credenciales de organizador</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
