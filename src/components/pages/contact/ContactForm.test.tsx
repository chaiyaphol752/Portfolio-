// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { contactContent } from "@/content/contact";
import { common } from "@/content/common";
import { profile } from "@/config/profile";

const submitContact = vi.fn();
vi.mock("@/app/actions/contact", () => ({ submitContact: (...args: unknown[]) => submitContact(...args) }));

import { ContactForm } from "./ContactForm";

afterEach(() => {
  cleanup();
  submitContact.mockReset();
  window.history.replaceState(null, "", "/");
});

const t = contactContent.en.form;
const field = (id: string) => document.getElementById(`contact-${id}`) as HTMLInputElement;
const renderForm = (locale: "en" | "de" = "en") => render(<ContactForm t={contactContent[locale].form} common={common[locale]} locale={locale} />);

function fillValid() {
  fireEvent.change(field("name"), { target: { value: "Ada Lovelace" } });
  fireEvent.change(field("email"), { target: { value: "ada@example.com" } });
  fireEvent.change(field("enquiryType"), { target: { value: "job-opportunity" } });
  fireEvent.change(field("message"), { target: { value: "I would like to talk about a junior web development role in your team." } });
  fireEvent.click(field("consent"));
}

describe("ContactForm", () => {
  it("shows localized field errors and does not call the server when invalid", () => {
    renderForm();
    fireEvent.submit(document.querySelector("form")!);
    expect(screen.getByText(t.errors["name.short"])).toBeTruthy();
    expect(screen.getByText(t.errors["email.invalid"])).toBeTruthy();
    expect(field("name").getAttribute("aria-invalid")).toBe("true");
    expect(field("name").getAttribute("aria-describedby")).toBe("contact-name-error");
    expect(submitContact).not.toHaveBeenCalled();
  });

  it("offers every enquiry type from the schema", () => {
    renderForm();
    const values = Array.from(field("enquiryType").querySelectorAll("option")).map((o) => o.getAttribute("value"));
    expect(values).toEqual(["", "job-opportunity", "internship", "collaboration", "feedback", "other"]);
  });

  it("preselects the enquiry type from ?type=", () => {
    window.history.replaceState(null, "", "/en/contact?type=job-opportunity");
    renderForm();
    expect(field("enquiryType").value).toBe("job-opportunity");
  });

  it("ignores unknown ?type= values", () => {
    window.history.replaceState(null, "", "/en/contact?type=<script>");
    renderForm();
    expect(field("enquiryType").value).toBe("");
  });

  it("defaults the preferred language to the current locale and includes a hidden honeypot", () => {
    renderForm("de");
    expect(field("language").value).toBe("de");
    const honeypot = document.querySelector<HTMLInputElement>('input[name="website"]')!;
    expect(honeypot.tabIndex).toBe(-1);
    expect(honeypot.closest("[aria-hidden]")).not.toBeNull();
  });

  it("submits valid data through the server action and shows the success state", async () => {
    submitContact.mockResolvedValue({ status: "success", acknowledged: false });
    renderForm();
    fillValid();
    fireEvent.submit(document.querySelector("form")!);
    await waitFor(() => expect(screen.getByText(t.success.title)).toBeTruthy());
    expect(screen.queryByText(t.success.acknowledged)).toBeNull();
    const formData = submitContact.mock.calls[0]?.[1] as FormData;
    expect(formData.get("email")).toBe("ada@example.com");
    expect(formData.get("enquiryType")).toBe("job-opportunity");
    expect(formData.get("consent")).toBe("on");
    expect(formData.get("language")).toBe("en");
  });

  it("mentions the confirmation email only when one was sent", async () => {
    submitContact.mockResolvedValue({ status: "success", acknowledged: true });
    renderForm();
    fillValid();
    fireEvent.submit(document.querySelector("form")!);
    await waitFor(() => expect(screen.getByText(t.success.acknowledged)).toBeTruthy());
  });

  it("offers direct email and phone when delivery is unavailable", async () => {
    submitContact.mockResolvedValue({ status: "unavailable" });
    renderForm();
    fillValid();
    fireEvent.submit(document.querySelector("form")!);
    await waitFor(() => expect(screen.getByText(t.states.unavailable)).toBeTruthy());
    expect(document.querySelector(`a[href="mailto:${profile.contact.email}"]`)).not.toBeNull();
    expect(document.querySelector(`a[href="${profile.contact.phone.href}"]`)).not.toBeNull();
  });

  it("maps server field errors to messages", async () => {
    submitContact.mockResolvedValue({ status: "invalid", fieldErrors: { email: "email.invalid" } });
    renderForm();
    fillValid();
    fireEvent.submit(document.querySelector("form")!);
    await waitFor(() => expect(screen.getByText(t.errors["email.invalid"])).toBeTruthy());
  });
});
