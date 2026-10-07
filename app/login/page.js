import LoginForm from "./login-form";

export const metadata = { title: "Iniciar sesión | Taller" };

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6 rounded-2xl bg-white p-6 shadow">
        <h1 className="text-center text-2xl font-bold">Taller</h1>
        <LoginForm />
      </div>
    </main>
  );
}
