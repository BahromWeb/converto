import { siteConfig } from "@converto/data";

// Tiny <script type="application/ld+json"> wrapper. Keeping the JSON.stringify
// in one place so future schemas don't each re-invent the dangerouslySetInnerHTML
// dance — schema.org payloads have no user input so XSS isn't a concern.
function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Organization + WebSite + SearchAction live together on the homepage so a
// single fetch by Google's crawler picks up brand identity, social profiles,
// and the sitelinks search box treatment in one shot.
export function HomeJsonLd() {
  const base = siteConfig.url.replace(/\/$/, "");

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: base,
    logo: `${base}/logo.png`,
    sameAs: [siteConfig.links.twitter, siteConfig.links.github],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: base,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${base}/tools?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <JsonLd data={organization} />
      <JsonLd data={website} />
    </>
  );
}

// SoftwareApplication + BreadcrumbList for tool pages. Each tool is a
// distinct "WebApplication" in schema.org's vocabulary — listing them
// individually lets Google show per-tool rich results (rating, price,
// usage info) rather than a single conflated entry for the whole site.
export function ToolJsonLd({
  slug,
  name,
  description,
}: {
  slug: string;
  name: string;
  description: string;
}) {
  const base = siteConfig.url.replace(/\/$/, "");
  const url = `${base}/${slug}`;

  const application = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    url,
    description,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Modern browser.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: base,
    },
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: base,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tools",
        item: `${base}/tools`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name,
        item: url,
      },
    ],
  };

  return (
    <>
      <JsonLd data={application} />
      <JsonLd data={breadcrumb} />
    </>
  );
}

// FAQPage schema — Google shows expandable Q&A right in the SERP when this
// is present and the questions feel high-quality. Pass already-translated
// strings; the schema cares about content not locale of UI.
export function FaqJsonLd({ items }: { items: { q: string; a: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: a,
      },
    })),
  };
  return <JsonLd data={data} />;
}
