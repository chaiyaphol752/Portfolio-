import { notFound } from "next/navigation";

export const dynamicParams = true;

/** Any unknown path under a valid locale renders the localized 404. */
export default function CatchAll() {
  notFound();
}
