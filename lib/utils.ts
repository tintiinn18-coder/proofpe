import { clsx, type ClassValue } from "clsx";
import type { ListingType, VerificationStatus } from "@/lib/types";

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

export function formatCompactINR(value?: number | null) {
  if (!value) return "Ask privately";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);
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

export function listingLabel(type: ListingType) {
  const labels: Record<ListingType, string> = {
    directory: "Open Revenue",
    for_sale: "For Sale",
    wanted: "Looking to Buy"
  };

  return labels[type];
}
