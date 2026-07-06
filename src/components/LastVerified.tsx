export default function LastVerified({ date }: { date: string }) {
  const formatted = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <p className="font-label-sm text-xs uppercase tracking-widest text-on-surface-variant">
      Last verified: {formatted}
    </p>
  );
}
