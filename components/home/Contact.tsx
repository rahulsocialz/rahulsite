"use client";

import { useState } from "react";
import { site } from "@/data/site";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Divider } from "@/components/ui/Divider";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "sending" | "sent" | "error";

/* Luxury minimal contact form, submitted via Web3Forms (web3forms.com) so
   messages land straight in the inbox with no server of our own required.
   The access key is public by design — it only routes mail to the
   registered address, it can't be used to read or send anything else. */
export function Contact() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!site.web3formsAccessKey) return;
    setStatus("sending");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      const result = await res.json();
      if (result.success) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="scroll-mt-24 py-7 lg:py-10">
      <Divider />
      <div className="shell mt-6 grid gap-8 lg:grid-cols-[minmax(0,34%)_1fr] lg:gap-20">
        <Eyebrow as="h2">Contact</Eyebrow>

        <div className="max-w-2xl">
          <form onSubmit={handleSubmit} className="grid gap-7">
            {/* Web3Forms routing + spam protection — all hidden, none shown to visitors */}
            <input type="hidden" name="access_key" value={site.web3formsAccessKey} />
            <input type="hidden" name="subject" value="New enquiry — rahulb.me portfolio" />
            <input type="hidden" name="from_name" value="Rahul Bhatt Portfolio" />
            <input
              type="checkbox"
              name="botcheck"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

            <div className="grid gap-7 sm:grid-cols-2">
              <Field label="Name" name="name" required autoComplete="name" placeholder="Your name" />
              <Field label="Email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
            </div>
            <Field label="Message" name="message" textarea required />
            <div>
              <Button type="submit" variant="primary" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Send Message"}
              </Button>
              {status === "sent" && (
                <p className="mt-4 text-caption text-muted" role="status">
                  Thanks — your message is on its way.
                </p>
              )}
              {status === "error" && (
                <p className="mt-4 text-caption text-muted" role="status">
                  Something went wrong sending that. Please try again, or email{" "}
                  {site.email} directly.
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
