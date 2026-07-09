type SoftwareApplicationSchemaProps = {
  name: string;
  description: string;
  url: string;
  applicationCategory?: string;
};

/** For the site's free, client-side interactive tools (Diagnoser, Letter Generator, Noise Log, Noise Law Lookup). */
export default function SoftwareApplicationSchema({
  name,
  description,
  url,
  applicationCategory = "UtilitiesApplication",
}: SoftwareApplicationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url,
    applicationCategory,
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
