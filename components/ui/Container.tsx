import { cn } from "@/lib/utils/cn";

export function Container({
  className,
  children,
  as: As = "div",
}: {
  className?: string;
  children: React.ReactNode;
  as?: React.ElementType;
}) {
  return (
    <As className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </As>
  );
}
