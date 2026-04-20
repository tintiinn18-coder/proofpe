"use client";

import { useState } from "react";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  return (
    <form
      className="rounded-lg border border-black/10 bg-white p-6 shadow-premium"
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
    >
      <div className="grid gap-4">
        <label className="text-sm font-black text-steel">
          Name
          <input required className="mt-2 w-full rounded-lg border border-black/10 px-4 py-3 text-ink outline-none focus:border-mint" />
        </label>
        <label className="text-sm font-black text-steel">
          Email
          <input required type="email" className="mt-2 w-full rounded-lg border border-black/10 px-4 py-3 text-ink outline-none focus:border-mint" />
        </label>
        <label className="text-sm font-black text-steel">
          Message
          <textarea required rows={5} className="mt-2 w-full rounded-lg border border-black/10 px-4 py-3 text-ink outline-none focus:border-mint" />
        </label>
      </div>
      <button className="mt-5 rounded-lg bg-ink px-5 py-3 text-sm font-black text-white hover:bg-mint">
        Send message
      </button>
      {sent ? (
        <p className="mt-4 text-sm font-bold text-mint">
          Thanks. For launch support, email support@proofpe.com.
        </p>
      ) : null}
    </form>
  );
}
