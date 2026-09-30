// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { systemsContent } from "@/content/systems";

const submitContact = vi.fn();
vi.mock("@/app/actions/contact", () => ({ submitContact: (...args: unknown[]) => submitContact(...args) }));

import { ContactForm } from "./ContactForm";

afterEach(() => {
  cleanup();
  submitContact.mockReset();
});

const t = systemsContent.en.contact;
const field = (id: string) => document.getElementById(`contact-${id}`) as HTMLInputElement;

function fillValid() {
  fireEvent.change(field("name"), { target: { value: "Ada Lovelace" } });
  fireEvent.change(field("email"), { target: { value: "ada@example.com" } });
  fireEvent.change(field("projectType"), { target: { value: "webapp" } });
  fireEvent.change(field("message"), { target: { value: "I need an internal dashboard for our operations team." } });
  fireEvent.click(field("consent"));
}

describe("ContactForm", () => {
  it("shows localized field errors and does not call the server when invalid", () => {
    render(<ContactForm t={t} locale="en" />);
    fireEvent.submit(document.querySelector("form")!);
    expect(screen.getByText(t.errors["name.short"])).toBeTruthy();
    expect(screen.getByText(t.errors["email.invalid"])).toBeTruthy();
    expect(field("name").getAttribute("aria-invalid")).toBe("true");
    expect(field("name").getAttribute("aria-describedby")).toBe("contact-name-error");
    expect(submitContact).not.toHaveBeenCalled();
  });

  it("defaults the preferred language to the current locale and includes a hidden honeypot", () => {
    render(<ContactForm t={systemsContent.de.contact} locale="de" />);
    expect(field("language").value).toBe("de");
    const honeypot = document.querySelector<HTMLInputElement>('input[name="website"]')!;
    expect(honeypot.tabIndex).toBe(-1);
    expect(honeypot.closest("[aria-hidden]")).not.toBeNull();
  });

  it("submits valid data through the server action and shows the success state", async () => {
    submitContact.mockResolvedValue({ status: "success" });
    render(<ContactForm t={t} locale="en" />);
    fillValid();
    fireEvent.submit(document.querySelector("form")!);
    await waitFor(() => expect(screen.getByText(t.success.title)).toBeTruthy());
    const formData = submitContact.mock.calls[0]?.[1] as FormData;
    expect(formData.get("email")).toBe("ada@example.com");
    expect(formData.get("consent")).toBe("on");
    expect(formData.get("language")).toBe("en");
  });

  it("explains an unavailable backend and offers a mailto fallback only when configured", async () => {
    submitContact.mockResolvedValue({ status: "unavailable" });
    render(<ContactForm t={t} locale="en" fallbackEmail="hello@example.com" />);
    fillValid();
    fireEvent.submit(document.querySelector("form")!);
    await waitFor(() => expect(screen.getByText(new RegExp(t.states.unavailable))).toBeTruthy());
    expect(document.querySelector('a[href="mailto:hello@example.com"]')).not.toBeNull();
  });

  it("maps server field errors to messages", async () => {
    submitContact.mockResolvedValue({ status: "invalid", fieldErrors: { email: "email.invalid" } });
    render(<ContactForm t={t} locale="en" />);
    fillValid();
    fireEvent.submit(document.querySelector("form")!);
    await waitFor(() => expect(screen.getByText(t.errors["email.invalid"])).toBeTruthy());
  });
});
