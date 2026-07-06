"use client";

import { useMemo, useState, type ChangeEvent } from "react";

/**
 * Client-side letter assembler. No backend — all text is composed in-browser
 * from the selected inputs, then copied to clipboard or downloaded as .txt.
 * Nothing is transmitted or stored.
 */

type NoiseTypeKey = "footsteps" | "music" | "dog" | "parties" | "tv" | "other";
type StageKey = "neighbor" | "landlord" | "demand";
type TimeKey = "latenight" | "earlymorning" | "evenings" | "allday";

const NOISE_TYPES: Record<NoiseTypeKey, { label: string; phrase: string }> = {
  footsteps: {
    label: "Footsteps / stomping from above",
    phrase:
      "persistent heavy footsteps and stomping from the unit above, which carry clearly into my living space",
  },
  music: {
    label: "Loud music or bass",
    phrase:
      "loud music with heavy bass that vibrates through the shared wall and is audible throughout my unit",
  },
  dog: {
    label: "Barking dog",
    phrase:
      "a dog that barks for extended periods, including during early morning and late evening hours",
  },
  parties: {
    label: "Parties / gatherings",
    phrase:
      "frequent late-night gatherings with sustained loud voices and music well past a reasonable hour",
  },
  tv: {
    label: "Loud TV / voices through walls",
    phrase:
      "loud television audio and raised voices that transmit clearly through the shared wall",
  },
  other: {
    label: "Other / general disturbance",
    phrase:
      "recurring excessive noise that disrupts the quiet use and enjoyment of my home",
  },
};

const STAGES: Record<StageKey, { label: string }> = {
  neighbor: { label: "Friendly note to a neighbor" },
  landlord: { label: "Formal complaint to landlord / property manager" },
  demand: { label: "Written demand citing quiet enjoyment" },
};

const TIMES: Record<TimeKey, string> = {
  latenight: "primarily late at night (roughly 11 PM–3 AM)",
  earlymorning: "primarily in the early morning hours",
  evenings: "most evenings",
  allday: "at various times throughout the day and night",
};

type ComposeParams = {
  stage: StageKey;
  noiseType: NoiseTypeKey;
  time: TimeKey;
  senderName: string;
  senderUnit: string;
  recipientName: string;
  address: string;
  building: string;
  quietHours: boolean;
  logAttached: boolean;
};

function composeLetter({
  stage,
  noiseType,
  time,
  senderName,
  senderUnit,
  recipientName,
  address,
  building,
  quietHours,
  logAttached,
}: ComposeParams): string {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const noise = NOISE_TYPES[noiseType].phrase;
  const timePhrase = TIMES[time];
  const unit = senderUnit ? ` in Unit ${senderUnit}` : "";
  const logLine = logAttached
    ? "\n\nI have kept a dated log of these disturbances, which I have attached for your reference."
    : "";
  const quietLine =
    quietHours && (stage === "landlord" || stage === "demand")
      ? ` This falls within the building's designated quiet hours${
          building ? ` at ${building}` : ""
        }.`
      : "";

  if (stage === "neighbor") {
    return `${today}

Hi${recipientName ? ` ${recipientName}` : " there"},

I'm your neighbor${unit}, and I wanted to reach out directly rather than involve anyone else. I've been noticing ${noise}, ${timePhrase}.

I know noise travels in ways that are easy to miss from inside your own unit, so I'm not assuming anything — I just wanted to let you know it's been affecting me. If we could find a way to keep things a little quieter during those hours, I'd really appreciate it.${logLine}

Thanks so much for understanding. Feel free to knock or reach out anytime.

Best,
${senderName || "[Your name]"}${unit}`;
  }

  if (stage === "landlord") {
    return `${today}

${recipientName || "[Landlord / Property Manager name]"}
${address || "[Property management address]"}

Re: Noise complaint — ${building || "[Building / property]"}${
      senderUnit ? `, Unit ${senderUnit}` : ""
    }

Dear ${recipientName || "Property Manager"},

I am a tenant${unit} and I am writing to formally report an ongoing noise problem. I have been experiencing ${noise}, ${timePhrase}.${quietLine}${logLine}

I have attempted to resolve this directly where appropriate, but the disturbances have continued. I am requesting that you address this matter with the responsible party, as the noise is interfering with the quiet use and enjoyment of my home.

Please let me know what steps you will take and by when. I am happy to provide additional detail, including my log of specific dates and times.

Thank you for your prompt attention.

Sincerely,
${senderName || "[Your name]"}${unit}`;
  }

  // demand
  return `${today}

${recipientName || "[Landlord / Property Manager name]"}
${address || "[Property management address]"}

Re: Formal demand to remedy ongoing noise — ${
    building || "[Building / property]"
  }${senderUnit ? `, Unit ${senderUnit}` : ""}

Dear ${recipientName || "Property Manager"},

This letter constitutes a formal written demand that you remedy an ongoing noise disturbance affecting my unit. Despite prior notice, I continue to experience ${noise}, ${timePhrase}.${quietLine}${logLine}

The covenant of quiet enjoyment — implied in residential tenancies in most jurisdictions — obligates the landlord to ensure tenants can use their homes without substantial interference. The ongoing disturbance described above breaches that covenant.

I am requesting that you take concrete action to resolve this matter within a reasonable time. Please respond in writing describing the steps you intend to take. I am retaining a copy of this letter and my disturbance log for my records.

Sincerely,
${senderName || "[Your name]"}${unit}

Note: This letter is a self-help template, not legal advice. Tenant remedies and notice requirements vary by state and locality — verify the rules that apply to you before relying on this.`;
}

const inputClass =
  "bg-surface-container-low border-b-2 border-tertiary/40 focus:border-primary outline-none px-4 py-3 font-body-md text-sm transition-colors";

export default function LetterGenerator() {
  const [stage, setStage] = useState<StageKey>("neighbor");
  const [noiseType, setNoiseType] = useState<NoiseTypeKey>("footsteps");
  const [time, setTime] = useState<TimeKey>("latenight");
  const [senderName, setSenderName] = useState("");
  const [senderUnit, setSenderUnit] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [address, setAddress] = useState("");
  const [building, setBuilding] = useState("");
  const [quietHours, setQuietHours] = useState(false);
  const [logAttached, setLogAttached] = useState(false);
  const [copied, setCopied] = useState(false);

  const letter = useMemo(
    () =>
      composeLetter({
        stage,
        noiseType,
        time,
        senderName,
        senderUnit,
        recipientName,
        address,
        building,
        quietHours,
        logAttached,
      }),
    [
      stage,
      noiseType,
      time,
      senderName,
      senderUnit,
      recipientName,
      address,
      building,
      quietHours,
      logAttached,
    ]
  );

  async function copy() {
    try {
      await navigator.clipboard.writeText(letter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  function download() {
    const blob = new Blob([letter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `noise-letter-${stage}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">
              Who is this letter to?
            </span>
            <select
              value={stage}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setStage(e.target.value as StageKey)
              }
              className={inputClass}
            >
              {Object.entries(STAGES).map(([key, info]) => (
                <option key={key} value={key}>
                  {info.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">
              What kind of noise?
            </span>
            <select
              value={noiseType}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setNoiseType(e.target.value as NoiseTypeKey)
              }
              className={inputClass}
            >
              {Object.entries(NOISE_TYPES).map(([key, info]) => (
                <option key={key} value={key}>
                  {info.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">
              When does it happen?
            </span>
            <select
              value={time}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setTime(e.target.value as TimeKey)}
              className={inputClass}
            >
              {Object.entries(TIMES).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">
              Your name
            </span>
            <input
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="Jane Doe"
              className={inputClass}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">
              Your unit (optional)
            </span>
            <input
              value={senderUnit}
              onChange={(e) => setSenderUnit(e.target.value)}
              placeholder="4B"
              className={inputClass}
            />
          </label>

          {stage !== "neighbor" && (
            <>
              <label className="flex flex-col gap-2">
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">
                  Recipient name
                </span>
                <input
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Property Manager / landlord"
                  className={inputClass}
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">
                  Management address (optional)
                </span>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main St, Suite 200"
                  className={inputClass}
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">
                  Building / property name (optional)
                </span>
                <input
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  placeholder="Maplewood Apartments"
                  className={inputClass}
                />
              </label>
              <label className="flex items-start gap-3 font-body-md text-sm">
                <input
                  type="checkbox"
                  checked={quietHours}
                  onChange={(e) => setQuietHours(e.target.checked)}
                  className="mt-1"
                />
                <span>Noise falls within posted quiet hours</span>
              </label>
            </>
          )}

          <label className="flex items-start gap-3 font-body-md text-sm">
            <input
              type="checkbox"
              checked={logAttached}
              onChange={(e) => setLogAttached(e.target.checked)}
              className="mt-1"
            />
            <span>I&apos;m attaching a dated noise log</span>
          </label>
        </div>

        <div className="flex flex-col border border-outline-variant min-h-[320px]">
          <div className="flex items-center justify-between px-4 py-3 bg-surface-container-low border-b border-outline-variant">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">
              Your letter
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={copy}
                className="bg-primary text-on-primary px-3 py-1.5 rounded-lg font-label-sm text-xs uppercase tracking-widest hover:bg-primary-container transition-all"
              >
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                type="button"
                onClick={download}
                className="border border-primary text-primary px-3 py-1.5 rounded-lg font-label-sm text-xs uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all"
              >
                Download .txt
              </button>
            </div>
          </div>
          <pre className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap break-words bg-background">
            {letter}
          </pre>
        </div>
      </div>
      <p className="mt-6 font-body-md text-sm text-on-surface-variant">
        These templates are informational self-help tools, not legal advice.
        Tenant rights, notice periods, and quiet-hours rules vary by state and
        city — confirm what applies to you before sending.
      </p>
    </div>
  );
}
