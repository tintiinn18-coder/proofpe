"use client";

import { FormEvent, useMemo, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { categories } from "@/lib/seed";
import { db, isFirebaseConfigured, storage } from "@/lib/firebase";
import { slugify } from "@/lib/utils";

type FormState = {
  name: string;
  slug: string;
  website: string;
  founderName: string;
  founderEmail: string;
  category: string;
  tagline: string;
  description: string;
  pricingModel: string;
  country: string;
  city: string;
  revenue30d: string;
  mrr: string;
  growthPercent: string;
  consent: boolean;
};

const initialState: FormState = {
  name: "",
  slug: "",
  website: "",
  founderName: "",
  founderEmail: "",
  category: "SaaS",
  tagline: "",
  description: "",
  pricingModel: "",
  country: "India",
  city: "",
  revenue30d: "",
  mrr: "",
  growthPercent: "",
  consent: false
};

export function SubmitForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialState);
  const [proof, setProof] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const progress = useMemo(() => `${step}/5`, [step]);

  function update<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setForm((current) => ({
      ...current,
      [key]: value,
      ...(key === "name" && !current.slug ? { slug: slugify(String(value)) } : {})
    }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < 5) {
      setStep((current) => current + 1);
      return;
    }

    if (!form.consent) {
      setStatus("Please confirm consent before submitting.");
      return;
    }

    if (!isFirebaseConfigured || !db || !storage) {
      setStatus("Firebase env variables are missing. Add them to submit live data.");
      return;
    }

    setIsSubmitting(true);
    setStatus("Uploading proof and saving your submission...");

    try {
      let proofImageUrl = "";
      const now = new Date().toISOString();

      if (proof) {
        const proofRef = ref(storage, `proofs/${form.slug || slugify(form.name)}-${Date.now()}-${proof.name}`);
        await uploadBytes(proofRef, proof);
        proofImageUrl = await getDownloadURL(proofRef);
      }

      await addDoc(collection(db, "startups"), {
        slug: form.slug || slugify(form.name),
        name: form.name,
        founderName: form.founderName,
        founderEmail: form.founderEmail,
        website: form.website,
        tagline: form.tagline,
        description: form.description,
        category: form.category,
        country: form.country,
        city: form.city,
        pricingModel: form.pricingModel,
        revenue30d: Number(form.revenue30d),
        mrr: Number(form.mrr),
        growthPercent: Number(form.growthPercent),
        verificationStatus: proofImageUrl ? "proof_uploaded" : "unverified",
        proofImageUrl,
        proofUpdatedAt: proofImageUrl ? now : "",
        featured: false,
        approved: false,
        rejected: false,
        createdAt: now,
        updatedAt: now
      });

      setForm(initialState);
      setProof(null);
      setStep(1);
      setStatus("Submitted. Your profile is pending internal review.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-lg border border-black/10 bg-white p-6 shadow-premium">
      <div className="flex items-center justify-between border-b border-black/10 pb-5">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-mint">Step {progress}</p>
          <h2 className="mt-1 text-2xl font-black">{stepTitles[step - 1]}</h2>
        </div>
        <div className="h-2 w-32 rounded-full bg-paper">
          <div className="h-2 rounded-full bg-mint" style={{ width: `${(step / 5) * 100}%` }} />
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {step === 1 ? (
          <>
            <Field label="Startup name" value={form.name} onChange={(value) => update("name", value)} required />
            <Field label="Slug" value={form.slug} onChange={(value) => update("slug", slugify(value))} required />
            <Field label="Website" value={form.website} onChange={(value) => update("website", value)} required type="url" />
            <Field label="Founder name" value={form.founderName} onChange={(value) => update("founderName", value)} required />
            <Field label="Email" value={form.founderEmail} onChange={(value) => update("founderEmail", value)} required type="email" />
          </>
        ) : null}

        {step === 2 ? (
          <>
            <label className="text-sm font-black text-steel">
              Category
              <select value={form.category} onChange={(event) => update("category", event.target.value)} className="mt-2 w-full rounded-lg border border-black/10 px-4 py-3 text-ink outline-none focus:border-mint">
                {categories.map((category) => <option key={category}>{category}</option>)}
              </select>
            </label>
            <Field label="Tagline" value={form.tagline} onChange={(value) => update("tagline", value)} required />
            <label className="text-sm font-black text-steel">
              Description
              <textarea required rows={5} value={form.description} onChange={(event) => update("description", event.target.value)} className="mt-2 w-full rounded-lg border border-black/10 px-4 py-3 text-ink outline-none focus:border-mint" />
            </label>
            <Field label="Pricing model" value={form.pricingModel} onChange={(value) => update("pricingModel", value)} required />
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Country" value={form.country} onChange={(value) => update("country", value)} required />
              <Field label="City" value={form.city} onChange={(value) => update("city", value)} required />
            </div>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <Field label="Revenue (30 days)" value={form.revenue30d} onChange={(value) => update("revenue30d", value)} required type="number" />
            <Field label="MRR" value={form.mrr} onChange={(value) => update("mrr", value)} required type="number" />
            <Field label="Growth %" value={form.growthPercent} onChange={(value) => update("growthPercent", value)} required type="number" />
          </>
        ) : null}

        {step === 4 ? (
          <div className="grid gap-4">
            <label className="rounded-lg border border-dashed border-black/20 bg-paper p-6 text-sm font-black text-steel">
              Upload screenshot
              <input
                required
                type="file"
                accept="image/*"
                onChange={(event) => setProof(event.target.files?.[0] ?? null)}
                className="mt-4 block w-full text-sm"
              />
              {proof ? <span className="mt-3 block text-mint">{proof.name}</span> : null}
            </label>
            <div className="rounded-lg border border-black/10 p-4 text-sm font-bold text-steel">Razorpay connect: coming soon</div>
            <div className="rounded-lg border border-black/10 p-4 text-sm font-bold text-steel">Stripe connect: coming soon</div>
          </div>
        ) : null}

        {step === 5 ? (
          <label className="flex gap-3 rounded-lg border border-black/10 bg-paper p-4 text-sm font-bold leading-6 text-steel">
            <input
              type="checkbox"
              checked={form.consent}
              onChange={(event) => update("consent", event.target.checked)}
              className="mt-1"
            />
            I confirm that I am authorized to submit this startup data and proof
            for internal verification and public display on ProofPe.
          </label>
        ) : null}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {step > 1 ? (
          <button type="button" onClick={() => setStep((current) => current - 1)} className="rounded-lg border border-black/10 px-5 py-3 text-sm font-black">
            Back
          </button>
        ) : null}
        <button disabled={isSubmitting} className="rounded-lg bg-ink px-5 py-3 text-sm font-black text-white hover:bg-mint disabled:cursor-not-allowed disabled:opacity-60">
          {step === 5 ? "Submit startup" : "Continue"}
        </button>
      </div>

      {status ? <p className="mt-5 text-sm font-bold text-mint">{status}</p> : null}
    </form>
  );
}

const stepTitles = [
  "Founder and startup basics",
  "Market and positioning",
  "Revenue metrics",
  "Proof method",
  "Consent and submit"
];

function Field({
  label,
  value,
  onChange,
  required,
  type = "text"
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="text-sm font-black text-steel">
      {label}
      <input
        required={required}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-lg border border-black/10 px-4 py-3 text-ink outline-none focus:border-mint"
      />
    </label>
  );
}
