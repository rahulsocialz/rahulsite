"use client";

import { useState } from "react";
import { site } from "@/data/site";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Divider } from "@/components/ui/Divider";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

/* Luxury minimal contact form. Opens the visitor's mail app pre-addressed —
   no server required. */
export function Contact() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "");
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
      `Project enquiry from ${name}`
    )}&body=${encodeURIComponent(`${message}\n\n${name}\n${email}`)}`;
    setSent(true);
  }

  return (
    <section id="contact" className="scroll-mt-24 py-7 lg:py-10">
      <Divider />
      <div className="shell mt-6 grid gap-8 lg:grid-cols-[minmax(0,34%)_1fr] lg:gap-20">
        <Eyebrow as="h2">Contact</Eyebrow>

        <div className="max-w-2xl">
          <form onSubmit={handleSubmit} className="grid gap-7">
            <div className="grid gap-7 sm:grid-cols-2">
              <Field label="Name" name="name" required autoComplete="name" placeholder="Your name" />
              <Field label="Email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
            </div>
            <Field label="Message" name="message" textarea required />
            <div>
              <Button type="submit" variant="primary">Send Message</Button>
              {sent && (
                <p className="mt-4 text-caption text-muted" role="status">
                  Your email app should now be open with the message ready to send.
                </p>
              )}
            </div>
          </form>
          <div className="mt-6 flex gap-8">
            <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer" className="link text-caption text-muted">
              Instagram {site.instagramHandle}
            </a>
            <a href={site.url} target="_blank" rel="noopener noreferrer" className="link text-caption text-muted">
              rahulb.me
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
