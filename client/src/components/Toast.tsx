// ============================================================
// src/components/Toast.tsx
// Eenvoudige toast-notificaties (vaste positie rechtsonder)
// ============================================================

export interface ToastItem {
  id: number;
  message: string;
}

interface Props {
  items: ToastItem[];
}

export function ToastContainer({ items }: Props) {
  if (items.length === 0) return null;
  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50 pointer-events-none">
      {items.map((t) => (
        <div
          key={t.id}
          className="bg-slate-700 border border-slate-500 text-slate-100 text-sm px-4 py-2 rounded-lg shadow-lg"
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
