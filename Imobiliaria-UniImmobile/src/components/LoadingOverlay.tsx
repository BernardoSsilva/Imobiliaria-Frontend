import { Spinner } from "@heroui/react";

type Props = {
  open: boolean;
  label?: string;
};

export function LoadingOverlay({ open, label = "Carregando dados" }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
      <div className="flex items-center gap-3 rounded-xl border border-(--primary-color) bg-white px-6 py-4 shadow-xl">
        <Spinner className="size-6 text-(--primary-color)" />
        <span className="font-medium text-(--primary-color)">{label}</span>
      </div>
    </div>
  );
}
