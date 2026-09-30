import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { clsx } from "clsx";

interface Props {
  href: string;
  variant?: "primary" | "ghost";
  children: React.ReactNode;
  className?: string;
  arrow?: boolean;
  onNight?: boolean;
}

/** Pill button rendered as a Next.js <Link>. */
export function ButtonLink({ href, variant = "primary", children, className, arrow = true, onNight }: Props) {
  return (
    <Link href={href} className={clsx("btn", variant === "primary" ? "btn-primary" : "btn-ghost", onNight && "btn-on-night", className)}>
      {children}
      {arrow && <ArrowRight className="arrow size-4" aria-hidden />}
    </Link>
  );
}
