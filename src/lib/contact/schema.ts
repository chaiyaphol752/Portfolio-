// zod/mini: same validation semantics as zod, tree-shakable, so the client bundle stays small.
import * as z from "zod/mini";
import { locales } from "@/i18n/config";

export const enquiryTypes = ["job-opportunity", "internship", "collaboration", "feedback", "other"] as const;

/**
 * Error messages are stable codes, not sentences: the client maps each code to
 * a translated message, so validation feedback is localized without server-side i18n.
 */
export const contactSchema = z.object({
  name: z.string().check(z.trim(), z.minLength(2, "name.short"), z.maxLength(100, "name.long")),
  email: z.string().check(z.trim(), z.maxLength(200, "email.long"), z.regex(z.regexes.email, "email.invalid")),
  company: z.optional(z.string().check(z.trim(), z.maxLength(120, "company.long"))),
  enquiryType: z.enum(enquiryTypes, { error: "enquiryType.invalid" }),
  message: z.string().check(z.trim(), z.minLength(20, "message.short"), z.maxLength(4000, "message.long")),
  language: z.enum(locales, { error: "language.invalid" }),
  consent: z.literal("on", { error: "consent.required" }),
  /** Honeypot: real visitors never see or fill this field. */
  website: z.optional(z.string().check(z.maxLength(0))),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactErrorCode = "name.short" | "name.long" | "email.invalid" | "email.long" | "company.long" | "enquiryType.invalid" | "message.short" | "message.long" | "language.invalid" | "consent.required";

export type ContactFieldErrors = Partial<Record<keyof ContactInput, string>>;

const optionalFields = ["company"] as const;

/** Returns validated data or a per-field map of error codes. */
export function parseContact(raw: Record<string, unknown>):
  | { success: true; data: ContactInput }
  | { success: false; fieldErrors: ContactFieldErrors; honeypot: boolean } {
  // Empty form inputs arrive as "": treat optional ones as "not provided".
  const input = { ...raw };
  for (const key of optionalFields) {
    const value = input[key];
    if (typeof value === "string" && value.trim() === "") delete input[key];
  }
  const result = contactSchema.safeParse(input);
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
