export default function SourceLink({ label, url }: { label: string; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 font-label-sm text-sm text-primary underline hover:text-secondary transition-colors"
    >
      {label} <span aria-hidden="true">↗</span>
    </a>
  );
}
