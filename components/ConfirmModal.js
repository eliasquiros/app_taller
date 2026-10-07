import { AlertTriangle } from "lucide-react";

export default function ConfirmModal({ isOpen, titulo, mensaje, onConfirm, onCancel, confirmText = "Eliminar", cancelText = "Cancelar" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-sapphire-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl animate-slide-up border border-sapphire-100 text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 mb-2">
          <AlertTriangle size={32} />
        </div>
        <h2 className="text-2xl font-extrabold text-sapphire-900">{titulo}</h2>
        <p className="text-base text-sapphire-800">{mensaje}</p>
        
        <div className="flex gap-3 pt-4">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl px-4 py-3 font-bold text-sapphire-700 hover:bg-sapphire-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-red-500 px-4 py-3 font-bold text-white shadow-lg hover:bg-red-600 hover:shadow-xl transition-all active:scale-95"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
