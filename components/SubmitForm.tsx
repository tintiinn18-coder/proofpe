"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { FirebaseError } from "firebase/app";
import {
  browserLocalPersistence,
  getRedirectResult,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signInWithRedirect,
  User
} from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { categories } from "@/lib/seed";
import { auth, db, googleProvider, isFirebaseConfigured, storage } from "@/lib/firebase";
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
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialState);
  const [proof, setProof] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const progress = useMemo(() => `${step}/5`, [step]);

  useEffect(() => {
    if (!auth) {
      setAuthChecked(true);
      return;
    }

    const firebaseAuth = auth;

    setPersistence(firebaseAuth, browserLocalPersistence)
      .then(() => getRedirectResult(firebaseAuth))
      .then((result) => {
        if (result?.user) {
          console.log("[ProofPe Auth] Google redirect success", {
            uid: result.user.uid,
            email: result.user.email
          });
          setUser(result.user);
          setError("");
        }
      })
      .catch((redirectError) => {
        console.error("[ProofPe Auth] Google redirect failed", redirectError);
        setError(getAuthErrorMessage(redirectError));
      });

    return onAuthStateChanged(auth, (currentUser) => {
      console.log("[ProofPe Auth] Auth state changed", {
        signedIn: Boolean(currentUser),
        email: currentUser?.email ?? null
      });
      setUser(currentUser);
      setAuthChecked(true);
      if (currentUser?.email) {
        setForm((current) => ({
          ...current,
          founderEmail: current.founderEmail || currentUser.email || ""
        }));
      }
    });
  }, []);

  function update<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setForm((current) => ({
      ...current,
      [key]: value,
      ...(key === "name" && !current.slug ? { slug: slugify(String(value)) } : {})
    }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setWarning("");

    if (!user) {
      setError("Not authenticated");
      return;
    }

    if (step < 5) {
      setStep((current) => current + 1);
      return;
    }

    if (!form.consent) {
      setStatus("Please confirm consent before submitting.");
      return;
    }

    if (!isFirebaseConfigured || !db || !storage) {
      setError("Firebase env variables are missing. Add them to submit live data.");
      return;
    }

    setIsSubmitting(true);
    setStatus("Uploading proof and saving your submission...");
    setError("");
    setWarning("");

    try {
      const now = new Date().toISOString();
      const slug = form.slug || slugify(form.name);
      let proofImageUrl = "";
      let verificationStatus: "proof_uploaded" | "unverified" = "unverified";

      if (proof) {
        try {
          proofImageUrl = await uploadProofImage(proof, slug);
          verificationStatus = "proof_uploaded";
        } catch (uploadError) {
          console.error("[ProofPe Submit] Continuing without proof image", uploadError);
          setWarning("Submission saved without screenshot proof because upload is unavailable right now.");
        }
      }

      const submission = {
        slug,
        name: form.name,
        founderName: form.founderName,
        founderEmail: form.founderEmail,
        submittedByUid: user.uid,
        submittedByEmail: user.email ?? "",
        website: form.website,
        tagline: form.tagline,
        description: form.description,
        category: form.category,
        country: form.country,
        city: form.city,
        pricingModel: form.pricingModel,
        revenue: Number(form.revenue30d),
        revenue30d: Number(form.revenue30d),
        mrr: Number(form.mrr),
        growthPercent: Number(form.growthPercent),
        status: verificationStatus,
        verificationStatus,
        proofUrl: proofImageUrl,
        proofImageUrl,
        proofUpdatedAt: proofImageUrl ? now : "",
        featured: false,
        approved: false,
        rejected: false,
        createdAt: now,
        updatedAt: now
      };

      try {
        console.log("[ProofPe Submit] Firestore write start", {
          slug,
          uid: user.uid
        });
        const docRef = await withTimeout(
          addDoc(collection(db, "startups"), submission),
          15000,
          "Database error"
        );
        console.log("[ProofPe Submit] Firestore write success", docRef.id);
      } catch (databaseError) {
        console.error("[ProofPe Submit] Firestore write fail", databaseError);
        throw new Error("Database error");
      }

      setForm(initialState);
      setProof(null);
      setStep(1);
      setStatus(
        proofImageUrl
          ? "Submitted. Your profile is pending internal review."
          : "Submitted. Your profile was saved without screenshot proof and is pending internal review."
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Submission failed. Please try again.";
      setStatus("");
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function login() {
    setError("");
    setStatus("");

    if (!isFirebaseConfigured || !auth) {
      setError("Firebase env variables are missing. Add them to submit live data.");
      return;
    }

    try {
      setStatus("Opening Google sign-in...");
      await setPersistence(auth, browserLocalPersistence);
      const result = await signInWithPopup(auth, googleProvider);
      console.log("[ProofPe Auth] Google popup success", {
        uid: result.user.uid,
        email: result.user.email
      });
      setUser(result.user);
      setError("");
      setStatus("");
    } catch (loginError) {
      console.error("[ProofPe Auth] Google login failed", loginError);
      const message = getAuthErrorMessage(loginError);

      if (
        loginError instanceof FirebaseError &&
        ["auth/popup-blocked", "auth/popup-closed-by-user", "auth/cancelled-popup-request"].includes(loginError.code)
      ) {
        try {
          setStatus("Redirecting to Google sign-in...");
          await signInWithRedirect(auth, googleProvider);
          return;
        } catch (redirectError) {
          console.error("[ProofPe Auth] Google redirect start failed", redirectError);
          setStatus("");
          setError(getAuthErrorMessage(redirectError));
          return;
        }
      }

      setStatus("");
      setError(message);
    }
  }

  if (!authChecked) {
    return (
      <div className="rounded-lg border border-black/10 bg-white p-6 shadow-premium">
        <p className="text-sm font-black text-steel">Checking sign-in status...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-lg border border-black/10 bg-white p-6 shadow-premium">
        <h2 className="text-2xl font-black">Sign in with Google to submit your startup</h2>
        <p className="mt-3 text-sm leading-6 text-steel">
          ProofPe requires founder sign-in before revenue proof can be submitted.
        </p>
        <button
          type="button"
          onClick={login}
          disabled={!isFirebaseConfigured}
          className="mt-5 rounded-lg bg-ink px-5 py-3 text-sm font-black text-white hover:bg-mint"
        >
          Sign in with Google
        </button>
        {!isFirebaseConfigured ? (
          <p className="mt-5 text-sm font-bold text-coral">
            Firebase env variables are missing. Add them in .env.local and restart the dev server.
          </p>
        ) : null}
        {status ? <p className="mt-5 text-sm font-bold text-mint">{status}</p> : null}
        {error ? <p className="mt-5 text-sm font-bold text-coral">{error}</p> : null}
      </div>
    );
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
                type="file"
                accept="image/*"
                onChange={(event) => setProof(event.target.files?.[0] ?? null)}
                className="mt-4 block w-full text-sm"
              />
              {proof ? <span className="mt-3 block text-mint">{proof.name}</span> : null}
              {!proof ? <span className="mt-3 block text-steel">Optional for now</span> : null}
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
          {isSubmitting ? "Submitting..." : step === 5 ? "Submit startup" : "Continue"}
        </button>
      </div>

      {status ? <p className="mt-5 text-sm font-bold text-mint">{status}</p> : null}
      {warning ? <p className="mt-5 text-sm font-bold text-gold">{warning}</p> : null}
      {error ? <p className="mt-5 text-sm font-bold text-coral">{error}</p> : null}
    </form>
  );
}

async function uploadProofImage(file: File, slug: string) {
  if (!storage) throw new Error("Upload failed");

  try {
    console.log("[ProofPe Submit] Upload start", {
      name: file.name,
      size: file.size,
      type: file.type
    });

    const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const proofRef = ref(storage, `proofs/${slug}-${Date.now()}-${safeFileName}`);
    const snapshot = await withTimeout(
      uploadBytes(proofRef, file, { contentType: file.type }),
      20000,
      "Upload failed"
    );
    const downloadUrl = await withTimeout(
      getDownloadURL(snapshot.ref),
      10000,
      "Upload failed"
    );

    console.log("[ProofPe Submit] Upload success", downloadUrl);
    return downloadUrl;
  } catch (uploadError) {
    console.error("[ProofPe Submit] Upload fail", uploadError);
    throw new Error("Upload failed");
  }
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(message)), timeoutMs);
  });

  return Promise.race([promise, timeout]).finally(() => {
    if (timeoutId) clearTimeout(timeoutId);
  });
}

function getAuthErrorMessage(error: unknown) {
  if (!(error instanceof FirebaseError)) {
    if (error instanceof Error && error.message) {
      return `Google sign-in failed: ${error.message}`;
    }

    return "Google sign-in failed. Check Firebase Auth configuration.";
  }

  const messages: Record<string, string> = {
    "auth/unauthorized-domain":
      "Google sign-in failed: this domain is not authorized in Firebase Auth.",
    "auth/operation-not-allowed":
      "Google sign-in failed: enable Google provider in Firebase Auth.",
    "auth/invalid-api-key":
      "Google sign-in failed: Firebase API key is invalid.",
    "auth/api-key-not-valid":
      "Google sign-in failed: Firebase API key is invalid.",
    "auth/popup-blocked":
      "Google sign-in popup was blocked. Redirect sign-in is starting.",
    "auth/popup-closed-by-user":
      "Google sign-in was closed before completion.",
    "auth/cancelled-popup-request":
      "Google sign-in was cancelled. Try again.",
    "auth/network-request-failed":
      "Google sign-in failed because of a network error.",
    "auth/configuration-not-found":
      "Google sign-in failed: Firebase Auth is not configured for this project."
  };

  return messages[error.code] ?? `Google sign-in failed: ${error.code}`;
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
