import { cn } from "@/lib/utils/cn";

export function Card({
  className,
  children,
  as: As = "div",
}: {
  className?: string;
  children: React.ReactNode;
  as?: React.ElementType;
}) {
  return (
    <As
      className={cn(
        "border-ink-100 rounded-2xl border bg-white shadow-sm shadow-slate-900/[0.03]",
        className,
      )}
    >
      {children}
    </As>
  );
}
