import Link from "next/link";

export default function AffiliateDisclosure() {
  return (
    <div className="mb-10 border-l-4 border-secondary bg-surface-container-low px-6 py-4">
      <p className="font-body-md text-sm text-on-surface-variant">
        This article contains affiliate links. If you buy something through
        one of them, we may earn a commission at no extra cost to you. See our{" "}
        <Link href="/disclosure" className="text-primary underline">
          disclosure policy
        </Link>{" "}
        for details.
      </p>
    </div>
  );
}
