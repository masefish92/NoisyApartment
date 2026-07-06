type DecibelRow = {
  db: string;
  sound: string;
  context: string;
};

const ROWS: DecibelRow[] = [
  {
    db: "30 dB",
    sound: "Whisper, quiet library",
    context:
      "Barely noticeable — this is what a well-soundproofed bedroom should feel like at night.",
  },
  {
    db: "40 dB",
    sound: "Quiet residential area, refrigerator hum",
    context:
      "Many local ordinances treat ~40–45 dB as the nighttime limit for residential zones.",
  },
  {
    db: "50 dB",
    sound: "Moderate rainfall, normal conversation two rooms away",
    context: "Noticeable but usually livable during the day.",
  },
  {
    db: "55 dB",
    sound: "Conversation through a wall, a TV at moderate volume next door",
    context:
      "Around the threshold where neighbor noise starts to feel intrusive at night.",
  },
  {
    db: "60 dB",
    sound: "Normal conversation at 3 feet, dishwasher",
    context: "Clearly audible through shared walls; disruptive during quiet hours.",
  },
  {
    db: "70 dB",
    sound: "Vacuum cleaner, busy street traffic",
    context: "Loud enough to interrupt sleep and conversation through typical apartment walls.",
  },
  {
    db: "80 dB",
    sound: "Loud music, garbage disposal",
    context: "Sustained exposure is genuinely disruptive; often exceeds ordinance limits.",
  },
  {
    db: "90+ dB",
    sound: "Heavy bass party, power tools",
    context: "Well beyond residential limits — strong grounds for a documented complaint.",
  },
];

export default function DecibelReference() {
  return (
    <div>
      <p className="font-body-md text-body-md text-on-surface-variant mb-6">
        Noise complaints are easier to act on when you can describe how loud
        something actually is. Here&apos;s what common decibel (dB) levels
        sound like and why they matter for apartment living.
      </p>
      <div className="overflow-x-auto border border-outline-variant">
        <table className="w-full border-collapse font-body-md text-sm">
          <thead>
            <tr className="bg-surface-container-low">
              <th className="border border-outline-variant px-4 py-3 text-left font-label-sm text-label-sm uppercase tracking-widest">
                Level
              </th>
              <th className="border border-outline-variant px-4 py-3 text-left font-label-sm text-label-sm uppercase tracking-widest">
                Sounds like
              </th>
              <th className="border border-outline-variant px-4 py-3 text-left font-label-sm text-label-sm uppercase tracking-widest">
                Why it matters
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.db}>
                <td className="border border-outline-variant px-4 py-3 align-top font-bold text-primary whitespace-nowrap">
                  {row.db}
                </td>
                <td className="border border-outline-variant px-4 py-3 align-top text-on-surface-variant">
                  {row.sound}
                </td>
                <td className="border border-outline-variant px-4 py-3 align-top text-on-surface-variant">
                  {row.context}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 font-body-md text-sm text-on-surface-variant">
        Decibels are logarithmic — every 10 dB roughly doubles perceived
        loudness. A free phone sound-meter app gives a rough reading; for
        anything official, ordinance enforcement uses calibrated equipment.
        Exact legal limits vary by city and time of day.
      </p>
    </div>
  );
}
