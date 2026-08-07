"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";

/**
 * The site has no backend, so this form doesn't POST anywhere — it builds a
 * pre-filled `mailto:` link and opens the visitor's own email client, which
 * genuinely works with zero server infrastructure. The hidden "company"
 * field is a honeypot: real visitors never fill it in, so any submission
 * with it populated is silently discarded as spam.
 *
 * To wire this up to a real inbox instead (recommended before launch), see
 * README.md → "How to connect the contact form to an email service".
 */
export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (company) return; // honeypot triggered — silently drop

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in your name, email, and message.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const subject = encodeURIComponent(`Message from ${name} via ${siteConfig.name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${siteConfig.contactEmail}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  // No contact inbox configured yet (NEXT_PUBLIC_CONTACT_EMAIL unset) — show
  // an honest "not yet available" state rather than a form that mails
  // nowhere or a fabricated address.
  if (!siteConfig.contactEmail) {
    return (
      <p className="text-ink-500 text-sm leading-relaxed">
        Our contact form is being finalized. In the meantime, please check back soon —
        we&apos;re not able to receive messages here yet.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="name" className="text-ink-700 mb-1.5 block text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border-ink-300 text-ink-900 w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        />
      </div>

      <div>
        <label htmlFor="email" className="text-ink-700 mb-1.5 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border-ink-300 text-ink-900 w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="text-ink-700 mb-1.5 block text-sm font-medium"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border-ink-300 text-ink-900 w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      {sent && (
        <p role="status" className="text-sm text-emerald-700">
          Your email app should have opened with your message ready to send.
        </p>
      )}

      <button
        type="submit"
        className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
      >
        Open in email app
      </button>
    </form>
  );
}
