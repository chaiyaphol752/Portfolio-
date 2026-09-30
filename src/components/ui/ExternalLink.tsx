import { ArrowUpRight } from "lucide-react";

interface Props extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "target" | "rel"> {
  hint?: string;
  icon?: boolean;
}

/** Safe external link: new tab, no opener, announced to assistive tech. */
export function ExternalLink({ children, hint, icon = true, className, ...rest }: Props) {
  return (
    <a {...rest} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      {icon && <ArrowUpRight className="ml-1 inline size-3.5 align-[-1px]" aria-hidden />}
      {hint && <span className="sr-only"> ({hint})</span>}
    </a>
  );
}
