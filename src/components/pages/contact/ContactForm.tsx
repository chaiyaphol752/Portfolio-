"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { submitContact, type ContactState } from "@/app/actions/contact";
import { budgets, parseContact, projectTypes, type ContactErrorCode, type ContactFieldErrors } from "@/lib/contact/schema";
import { locales, localeMeta, type Locale } from "@/i18n/config";
import { interpolate } from "@/lib/interpolate";
import type { ContactContent } from "@/content/contact";
import type { CommonContent } from "@/content/common";
import { Checkbox } from "@/components/ui/Checkbox";
import { ContactActions } from "@/components/ui/ContactActions";

type FieldName = keyof ContactFieldErrors;

const control =
  "w-full border-0 border-b border-ink bg-transparent px-0 py-3 text-base text-ink placeholder:text-ink-3 focus:border-accent-ink focus:shadow-[0_1px_0_0_var(--color-accent-ink)] focus:outline-none focus-visible:outline-none focus-visible:ring-0 aria-[invalid=true]:border-accent-ink";

interface FieldProps {
  name: FieldName;
  label: string;
  optionalLabel?: string;
  error?: string;
  className?: string;
  children: (props: { id: string; "aria-invalid": boolean; "aria-describedby"?: string }) => React.ReactNode;
}

function Field({ name, label, optionalLabel, error, className, children }: FieldProps) {
  const id = `contact-${name}`;
  return (
    <div className={className}>
      <label htmlFor={id} className="eyebrow flex items-baseline justify-between gap-3">
        <span>{label}</span>
        {optionalLabel && <span className="normal-case tracking-normal text-ink-3">{optionalLabel}</span>}
      </label>
      {children({ id, "aria-invalid": Boolean(error), "aria-describedby": error ? `${id}-error` : undefined })}
      <p id={`${id}-error`} className="mt-1.5 min-h-5 text-sm text-accent-ink">
        {error}
      </p>
    </div>
  );
}

interface Props {
  t: ContactContent["form"];
  common: CommonContent;
  locale: Locale;
}

/** Reads ?type=redesign etc. so contextual CTAs can preselect what the visitor needs. */
function typeFromUrl(): string | null {
  const value = new URLSearchParams(window.location.search).get("type");
  return value && (projectTypes as readonly string[]).includes(value) ? value : null;
}

export function ContactForm({ t, common, locale }: Props) {
  const [state, formAction, pending] = useActionState<ContactState, FormData>(submitContact, { status: "idle" });
  const [clientErrors, setClientErrors] = useState<ContactFieldErrors>({});
  const [edited, setEdited] = useState<Set<string>>(new Set());
  const [acknowledged, setAcknowledged] = useState<ContactState | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const typeRef = useRef<HTMLSelectElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);

  // The page is statically rendered, so the query param is applied after hydration.
  useEffect(() => {
    const preset = typeFromUrl();
    if (preset && typeRef.current && !typeRef.current.value) typeRef.current.value = preset;
  }, []);

  const showSuccess = state.status === "success" && state !== acknowledged;
  useEffect(() => {
    if (showSuccess) successRef.current?.focus();
  }, [showSuccess]);

  const serverProblem = state.status === "rate-limited" || state.status === "unavailable" || state.status === "error";
  useEffect(() => {
    if (serverProblem) alertRef.current?.focus();
  }, [serverProblem, state]);

  // Client errors win while present; otherwise show what the server reported, minus fields edited since.
  const rawErrors: ContactFieldErrors = Object.keys(clientErrors).length ? clientErrors : state.status === "invalid" ? state.fieldErrors : {};
  const message = (name: FieldName): string | undefined => {
    const code = rawErrors[name];
    if (!code || edited.has(name)) return undefined;
    return t.errors[code as ContactErrorCode] ?? t.states.invalid;
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const parsed = parseContact(Object.fromEntries(data.entries()));
    setEdited(new Set());
    if (!parsed.success && !parsed.honeypot) {
      setClientErrors(parsed.fieldErrors);
      const first = Object.keys(parsed.fieldErrors)[0];
      if (first) formRef.current?.querySelector<HTMLElement>(`#contact-${first}`)?.focus();
      return;
    }
    setClientErrors({});
    startTransition(() => formAction(data));
  };

  const markEdited = (event: React.FormEvent<HTMLFormElement>) => {
    const name = (event.target as HTMLElement & { name?: string }).name;
    if (name) setEdited((prev) => new Set(prev).add(name));
  };

  if (showSuccess) {
    return (
      <div role="status" className="border border-ink bg-paper-2 p-8 sm:p-10">
        <CheckCircle2 className="size-8 text-signal" aria-hidden />
        <h3 ref={successRef} tabIndex={-1} className="h2 mt-5 focus:outline-none">{t.success.title}</h3>
        <p className="body-copy mt-3">{t.success.body}</p>
        {state.status === "success" && state.acknowledged && <p className="body-copy mt-2">{t.success.acknowledged}</p>}
        <button type="button" onClick={() => setAcknowledged(state)} className="btn btn-ghost mt-8">{t.success.again}</button>
      </div>
    );
  }

  const banner =
    state.status === "rate-limited"
      ? interpolate(t.states.rateLimited, { minutes: Math.max(1, Math.ceil(state.retryAfterSec / 60)) })
      : state.status === "unavailable"
        ? t.states.unavailable
        : state.status === "error"
          ? t.states.error
          : (Object.keys(rawErrors) as FieldName[]).some((name) => message(name))
            ? t.states.invalid
            : "";

  return (
    <form ref={formRef} onSubmit={onSubmit} onInput={markEdited} onChange={markEdited} noValidate aria-busy={pending} className="grid gap-x-8 sm:grid-cols-2">
      {/* Honeypot: hidden from people and assistive tech, bots fill it. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <Field name="name" label={t.labels.name} error={message("name")}>
        {(a) => <input {...a} name="name" type="text" autoComplete="name" required maxLength={100} placeholder={t.placeholders.name} className={control} />}
      </Field>
      <Field name="email" label={t.labels.email} error={message("email")}>
        {(a) => <input {...a} name="email" type="email" autoComplete="email" required maxLength={200} placeholder={t.placeholders.email} className={control} />}
      </Field>
      <Field name="company" label={t.labels.company} optionalLabel={t.labels.optional} error={message("company")}>
        {(a) => <input {...a} name="company" type="text" autoComplete="organization" maxLength={120} placeholder={t.placeholders.company} className={control} />}
      </Field>
      <Field name="projectType" label={t.labels.projectType} error={message("projectType")}>
        {(a) => (
          <select {...a} ref={typeRef} name="projectType" required defaultValue="" className={control}>
            <option value="" disabled>{t.select}</option>
            {projectTypes.map((p) => (
              <option key={p} value={p}>{t.projectTypes[p]}</option>
            ))}
          </select>
        )}
      </Field>
      <Field name="budget" label={t.labels.budget} optionalLabel={t.labels.optional} error={message("budget")}>
        {(a) => (
          <select {...a} name="budget" defaultValue="" className={control}>
            <option value="">{t.select}</option>
            {budgets.map((b) => (
              <option key={b} value={b}>{t.budgets[b]}</option>
            ))}
          </select>
        )}
      </Field>
      <Field name="language" label={t.labels.language} error={message("language")}>
        {(a) => (
          <select {...a} name="language" required defaultValue={locale} className={control}>
            {locales.map((l) => (
              <option key={l} value={l} lang={localeMeta[l].htmlLang}>{t.languages[l]}</option>
            ))}
          </select>
        )}
      </Field>
      <Field name="message" label={t.labels.message} error={message("message")} className="sm:col-span-2">
        {(a) => <textarea {...a} name="message" required rows={6} maxLength={4000} placeholder={t.placeholders.message} className={`${control} resize-y`} />}
      </Field>

      <div className="sm:col-span-2">
        <label className="flex cursor-pointer items-start gap-1 text-sm text-ink-2">
          <Checkbox
            id="contact-consent"
            name="consent"
            required
            aria-invalid={Boolean(message("consent"))}
            aria-describedby={message("consent") ? "contact-consent-error" : undefined}
            className="-ml-3 -mt-2.5"
          />
          <span>{t.labels.consent}</span>
        </label>
        <p id="contact-consent-error" className="mt-1.5 min-h-5 text-sm text-accent-ink">{message("consent")}</p>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-4 sm:col-span-2">
        <button type="submit" disabled={pending} className="btn btn-primary">
          {pending && <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" aria-hidden />}
          {pending ? t.sending : t.submit}
        </button>
        <div role="alert" ref={alertRef} tabIndex={-1} className="min-h-6 text-sm text-accent-ink focus:outline-none">
          {banner}
        </div>
      </div>
      {serverProblem && state.status !== "rate-limited" && (
        <div className="mt-6 border-t border-line pt-6 sm:col-span-2">
          <p className="mb-3 text-sm text-ink-2">{t.states.fallback}</p>
          <ContactActions t={common} />
        </div>
      )}
    </form>
  );
}
