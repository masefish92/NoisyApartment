// Google removed FAQ rich results in May 2026 — this schema is now for Bing
// and AI answer-engine extraction only (AI Overviews, Perplexity, ChatGPT),
// not for a Google SERP rich result. Only render this on pages with real,
// visible Q&A content that matches the markup exactly — mismatched FAQ
// markup risks a manual spam action. In this codebase, always source items
// from extractFaqItems() (src/lib/content.ts), which parses the actual
// article body, rather than typing them separately by hand.

type FaqItem = { question: string; answer: string };

export default function FAQSchema({ items }: { items: FaqItem[] }) {
  if (items.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
