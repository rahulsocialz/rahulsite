"use client";

import { useState } from "react";
import { site } from "@/data/site";
import { Field } from "@/components/ui/Field";
import { Tape } from "@/components/analog/Analog";

type Status = "idle" | "sending" | "sent" | "error";

/* Contact lives on the homepage only. Submitted via Web3Forms (web3forms.com)
   so messages land straight in the inbox with no server of our own. The access
   key is public by design — it only routes mail to the registered address, it
   can't be used to read anything or send as anyone. */
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
    <section id="contact" className="shell scroll-mt-16 py-10 lg:py-14">
      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,18rem)_1fr] lg:gap-14">
        <div>
          <h2 className="d3">Contact</h2>
          <span aria-hidden className="mt-5 block h-px w-12 bg-[var(--ink)]" />
        </div>

        <div className="relative max-w-2xl">
          <Tape className="-top-4 right-6 hidden lg:block" rotate={7} />

          <form onSubmit={handleSubmit} className="mt-8 grid gap-7">
            {/* Web3Forms routing + spam protection — hidden, never shown */}
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
              <Field
                label="Email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
              />
            </div>

            <Field label="Message" name="message" textarea required rows={4} />

            <div>
              <button
                type="submit"
                disabled={status === "sending"}
                className="label flex min-h-11 w-full items-center justify-center bg-[var(--ink)] px-8 py-4 text-[var(--paper)] transition-opacity duration-300 hover:opacity-85 disabled:opacity-50 sm:w-auto sm:min-w-[18rem]"
              >
                {status === "sending" ? "Sending…" : "Send Message"}
              </button>

              {status === "sent" && (
                <p className="meta mt-4 text-[var(--muted)]" role="status">
                  Thanks — your message is on its way.
                </p>
              )}
              {status === "error" && (
                <p className="meta mt-4 text-[var(--muted)]" role="status">
                  Something went wrong sending that. Please try again, or email {site.email} directly.
                </p>
              )}
            </div>
          </form>

          <div className="mt-8 flex flex-wrap gap-x-10 gap-y-3">
            <a
              href={site.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ul-link meta text-[var(--muted)]"
            >
              Instagram {site.instagramHandle}
            </a>
            <a
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ul-link meta text-[var(--muted)]"
            >
              {site.url.replace(/^https?:\/\//, "")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
