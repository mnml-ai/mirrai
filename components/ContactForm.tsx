"use client";

import { useState, type FormEvent } from "react";
import type { getDictionary } from "@/lib/i18n";

type ContactCopy = ReturnType<typeof getDictionary>["contactPage"];

type ContactFormProps = {
  contact: ContactCopy;
  arrow: string;
};

export default function ContactForm({ contact, arrow }: ContactFormProps) {
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setIsSubmitting(true);
    setStatus(contact.sending);

    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const visitorSubject = String(formData.get("subject") || "").trim();
    const message = String(formData.get("message") || "").trim();

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          subject: visitorSubject,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("Contact email failed");
      }

      form.reset();
      setStatus(contact.success);
    } catch {
      setStatus(contact.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="contact-page-card"
      aria-labelledby="contact-form-title"
      onSubmit={handleSubmit}
    >
      <h2 id="contact-form-title">{contact.formTitle}</h2>
      <span className="contact-page-card-rule" aria-hidden />

      <div className="contact-page-form-grid">
        <label>
          <span>
            {contact.fields.name.label} <b aria-hidden>*</b>
          </span>
          <input type="text" name="name" placeholder={contact.fields.name.placeholder} required />
        </label>

        <label>
          <span>
            {contact.fields.email.label} <b aria-hidden>*</b>
          </span>
          <input type="email" name="email" placeholder={contact.fields.email.placeholder} required />
        </label>

        <label>
          <span>
            {contact.fields.phone.label} <b aria-hidden>*</b>
          </span>
          <input type="tel" name="phone" placeholder={contact.fields.phone.placeholder} required />
        </label>

        <label>
          <span>
            {contact.fields.subject.label} <b aria-hidden>*</b>
          </span>
          <input type="text" name="subject" placeholder={contact.fields.subject.placeholder} required />
        </label>

        <label className="contact-page-message">
          <span>
            {contact.fields.message.label} <b aria-hidden>*</b>
          </span>
          <textarea name="message" placeholder={contact.fields.message.placeholder} required rows={6} />
        </label>
      </div>

      <button type="submit" disabled={isSubmitting}>
        <span>{isSubmitting ? contact.sending : contact.submit}</span>
        <span aria-hidden>{arrow}</span>
      </button>

      {status ? <p className="contact-page-status">{status}</p> : null}
    </form>
  );
}
