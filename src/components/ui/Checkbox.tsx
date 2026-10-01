import { Check } from "lucide-react";
import { clsx } from "clsx";

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "className" | "size"> & {
  /** Visual size of the box; the native input always covers a 44px touch area. */
  box?: "sm" | "md";
  dark?: boolean;
  className?: string;
};

/**
 * Native checkbox stretched invisibly over a 44px hit area, with a drawn box on top.
 * Keeps native semantics, keyboard behaviour and form submission.
 */
export function Checkbox({ box = "md", dark, className, ...input }: Props) {
  return (
    <span className={clsx("relative inline-flex size-11 shrink-0 items-center justify-center", className)}>
      <input {...input} type="checkbox" className="peer absolute inset-0 m-0 size-full cursor-pointer opacity-0" />
      <span
        aria-hidden
        className={clsx(
          "pointer-events-none flex items-center justify-center rounded-[3px] border transition-colors",
          box === "md" ? "size-5" : "size-4",
          dark ? "border-night-ink" : "border-ink",
          "peer-checked:border-accent-ink peer-checked:bg-accent-ink peer-checked:text-white",
          "peer-aria-[invalid=true]:border-accent-ink",
          "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink",
          "[&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100",
        )}
      >
        <Check className={box === "md" ? "size-3.5" : "size-3"} strokeWidth={3} />
      </span>
    </span>
  );
}
