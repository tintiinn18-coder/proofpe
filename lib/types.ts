export type VerificationStatus =
  | "verified"
  | "proof_uploaded"
  | "unverified"
  | "rejected";

export type ListingType = "directory" | "for_sale" | "wanted";

export type Startup = {
  id: string;
  slug: string;
  name: string;
  founderName: string;
  founderEmail?: string;
  website: string;
  tagline: string;
  description: string;
  category: string;
  country: string;
  city: string;
  pricingModel: string;
  revenue30d: number;
  mrr: number;
  growthPercent: number;
  listingType: ListingType;
  askingPrice?: number | null;
  verificationStatus: VerificationStatus;
  proofImageUrl?: string;
  proofUpdatedAt?: string;
  logo?: string;
  featured: boolean;
  approved: boolean;
  rejected: boolean;
  createdAt: string;
  updatedAt: string;
  socials?: {
    x?: string;
    linkedin?: string;
  };
};
