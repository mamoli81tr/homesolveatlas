import { AlertTriangle, Info, ShieldAlert, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const variants = {
  info: {
    wrap: "border-blue-200 bg-blue-50",
    icon: "text-blue-600",
    Icon: Info,
  },
  warning: {
    wrap: "border-amber-200 bg-amber-50",
    icon: "text-amber-600",
    Icon: AlertTriangle,
  },
  danger: {
    wrap: "border-red-200 bg-red-50",
    icon: "text-red-600",
    Icon: ShieldAlert,
  },
  success: {
    wrap: "border-emerald-200 bg-emerald-50",
    icon: "text-emerald-600",
    Icon: CheckCircle2,
  },
} as const;

export function Callout({
  variant = "info",
  title,
  children,
}: {
  variant?: keyof typeof variants;
  title?: string;
  children: React.ReactNode;
}) {
  const { wrap, icon, Icon } = variants[variant];
  return (
    <div role="note" className={cn("flex gap-3 rounded-xl border p-4", wrap)}>
      <Icon className={cn("mt-0.5 h-5 w-5 flex-none", icon)} aria-hidden="true" />
      <div className="text-ink-700 text-sm leading-relaxed">
        {title && <p className="text-ink-900 mb-1 font-semibold">{title}</p>}
        {children}
      </div>
    </div>
  );
}
