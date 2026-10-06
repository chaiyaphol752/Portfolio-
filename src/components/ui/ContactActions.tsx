import { Mail, Phone } from "lucide-react";
import { clsx } from "clsx";
import { mailtoHref, profile } from "@/config/profile";
import type { CommonContent } from "@/content/common";

/** Email and phone as real mailto:/tel: links. `layout="stack"` for footers and side columns. */
export function ContactActions({ t, layout = "inline", className, dark }: { t: CommonContent; layout?: "inline" | "stack"; className?: string; dark?: boolean }) {
  const item = clsx(
    "group inline-flex min-h-11 items-center gap-3 rounded-full border px-4 py-2.5 text-sm transition-colors",
    dark ? "border-night-line hover:border-night-ink" : "border-line hover:border-ink",
  );
  return (
    <ul className={clsx(layout === "stack" ? "flex flex-col items-start gap-2" : "flex flex-wrap gap-2", className)}>
      <li>
        <a href={mailtoHref} className={item}>
          <Mail className="size-4" aria-hidden />
          <span className="sr-only">{t.contact.email}: </span>
          <span className="mono">{profile.contact.email}</span>
        </a>
      </li>
      <li>
        <a href={profile.contact.phone.href} className={item}>
          <Phone className="size-4" aria-hidden />
          <span className="sr-only">{t.contact.phone}: </span>
          <span className="mono tabular">{profile.contact.phone.display}</span>
        </a>
      </li>
    </ul>
  );
}
