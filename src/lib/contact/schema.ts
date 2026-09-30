import { z } from "zod";
import { locales } from "@/i18n/config";

export const projectTypes = ["website", "webapp", "saas", "ecommerce", "ai", "other"] as const;
export const budgets = ["under-1k", "1k-5k", "5k-15k", "15k-plus", "unsure"] as const;

/** Empty form inputs arrive as "" — treat them as "not provided". */
const optional = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (typeof v === "string" && v.trim() === "" ? undefined : v), schema.optional());

/**
 * Error messages are stable codes, not sentences: the client maps each code to
 * a translated message, so validation feedback is localized without server-side i18n.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "name.short").max(100, "name.long"),
  email: z.string().trim().max(200, "email.long").email("email.invalid"),
  company: optional(z.string().trim().max(120, "company.long")),
  projectType: z.enum(projectTypes, { error: "projectType.invalid" }),
  budget: optional(z.enum(budgets, { error: "budget.invalid" })),
  message: z.string().trim().min(20, "message.short").max(4000, "message.long"),
  language: z.enum(locales, { error: "language.invalid" }),
  consent: z.literal("on", { error: "consent.required" }),
  /** Honeypot: real visitors never see or fill this field. */
  website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactErrorCode = "name.short" | "name.long" | "email.invalid" | "email.long" | "company.long" | "projectType.invalid" | "budget.invalid" | "message.short" | "message.long" | "language.invalid" | "consent.required";

export type ContactFieldErrors = Partial<Record<keyof ContactInput, string>>;

/** Returns validated data or a per-field map of error codes. */
export function parseContact(raw: Record<string, unknown>):
  | { success: true; data: ContactInput }
  | { success: false; fieldErrors: ContactFieldErrors; honeypot: boolean } {
  const result = contactSchema.safeParse(raw);
  if (result.success) return { success: true, data: result.data };
  const fieldErrors: ContactFieldErrors = {};
  let honeypot = false;
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof ContactInput | undefined;
    if (key === "website") honeypot = true;
    else if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return { success: false, fieldErrors, honeypot };
}
