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
            const subject = encodeURIComponent("ViperSport sponsorship inquiry");
            const body = encodeURIComponent(
              `Name: ${data.get("name") ?? ""}\nEmail: ${data.get("email") ?? ""}\n\n${
                data.get("message") ?? ""
              }`
            );
            window.location.href = `mailto:partnerships@vipersport.com?subject=${subject}&body=${body}`;
          }}
        >
          <KineticInput
            name="name"
            placeholder="Name"
            required
          />
          <KineticInput
            name="email"
            placeholder="Email"
            type="email"
            required
          />
          <textarea
            name="message"
            className="min-h-32 w-full rounded-md border border-white/10 bg-kinetic-surface-container/50 px-3 py-3 text-sm text-kinetic-on-surface outline-none transition placeholder:text-kinetic-on-surface-variant focus:border-kinetic-primary-container focus:ring-2 focus:ring-kinetic-primary-container/15"
            placeholder="Message"
            required
          />
          <Button type="submit" variant="coral" className="w-fit px-4 py-2 text-sm">
            <Send size={17} /> Send inquiry
          </Button>
        </form>
      </div>
    </section>
  );
}
