import { clsx, type ClassValue } from "clsx";
import type { VerificationStatus } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatDate(value?: string) {
  if (!value) return "Not updated";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

export function statusLabel(status: VerificationStatus) {
  const labels: Record<VerificationStatus, string> = {
    verified: "Verified",
    proof_uploaded: "Proof Uploaded",
    unverified: "Unverified",
    rejected: "Rejected"
  };

  return labels[status];
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
