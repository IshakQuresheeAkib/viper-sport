"use client";

import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { KineticInput } from "@/components/ui/Input";

export function ContactSection() {
  return (
    <section id="contact" className="py-20">
      <div className="container grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-kinetic-primary-container">
            Contact
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-kinetic-primary sm:text-4xl">
            Brand partnerships and event sponsorships.
          </h2>
        </div>
        <form
          className="glass-card grid gap-4 rounded-md p-5"
          onSubmit={(event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const data = new FormData(form);
            const subject = encodeURIComponent(
              "ViperSport sponsorship inquiry",
            );
            const body = encodeURIComponent(
              `Name: ${data.get("name") ?? ""}\nEmail: ${data.get("email") ?? ""}\n\n${
                data.get("message") ?? ""
              }`,
            );
            window.location.href = `mailto:partnerships@vipersport.com?subject=${subject}&body=${body}`;
          }}
        >
          <KineticInput
            id="contact-name"
            name="name"
            label="Name"
            placeholder="Your name"
            autoComplete="name"
            required
          />
          <KineticInput
            id="contact-email"
            name="email"
            label="Email"
            placeholder="you@company.com"
            type="email"
            autoComplete="email"
            required
          />
          <div className="flex flex-col gap-1">
            <label
              htmlFor="contact-message"
              className="text-[11px] font-bold uppercase tracking-wider text-kinetic-outline"
            >
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              className="min-h-32 w-full rounded-md border border-white/10 bg-kinetic-surface-container/50 px-3 py-3 text-sm text-kinetic-on-surface outline-none transition placeholder:text-kinetic-on-surface-variant focus:border-kinetic-primary-container focus:ring-2 focus:ring-kinetic-primary-container/15"
              placeholder="Tell us about your partnership idea"
              required
            />
          </div>
          <Button
            type="submit"
            variant="lime"
            className="w-fit px-4 py-2 text-sm"
          >
            <Send size={17} /> Send inquiry
          </Button>
        </form>
      </div>
    </section>
  );
}
