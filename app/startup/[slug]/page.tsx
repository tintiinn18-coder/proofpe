import type { Metadata } from "next";
import { StartupProfileClient } from "@/components/StartupProfileClient";
import { seedStartups } from "@/lib/seed";

type Props = {
  params: { slug: string };
  searchParams?: { submitted?: string };
};

export function generateStaticParams() {
  return seedStartups.map((startup) => ({ slug: startup.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const startup = seedStartups.find((item) => item.slug === params.slug);

  if (!startup) {
    return {
      title: "Startup Profile",
      description: "ProofPe startup profile.",
      alternates: { canonical: `/startup/${params.slug}` }
    };
  }

  return {
    title: `${startup.name} Revenue Profile`,
    description: `${startup.name} reports ${startup.tagline} See revenue, MRR, growth, and verification status on ProofPe.`,
    alternates: { canonical: `/startup/${startup.slug}` },
    openGraph: {
      title: `${startup.name} on ProofPe`,
      description: `${startup.tagline} Revenue: ${startup.revenue30d}, MRR: ${startup.mrr}.`,
      type: "profile",
      url: `/startup/${startup.slug}`
    }
  };
}

export default function StartupProfilePage({ params, searchParams }: Props) {
  const startup = seedStartups.find((item) => item.slug === params.slug);

  return (
    <StartupProfileClient
      initialStartup={startup}
      slug={params.slug}
      justSubmitted={searchParams?.submitted === "1"}
    />
  );
}
