"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  getAllIncidents,
  addIncident,
  updateIncident,
  deleteIncident,
  clearAllIncidents,
  getMeta,
  setMeta,
  type Incident,
  type NoiseType,
  type LogMeta,
} from "@/lib/noise-log-store";

const NOISE_TYPE_LABELS: Record<NoiseType, string> = {
  footsteps: "Footsteps / Impact",
  music_bass: "Music / Bass",
  voices_party: "Voices / Party",
  tv: "TV / Media",
  pets: "Pets (barking, etc.)",
  appliance_hvac: "Appliance / HVAC",
  construction: "Construction",
  other: "Other",
};

const inputClass =
  "bg-surface-container-low border-b-2 border-tertiary/40 focus:border-primary outline-none px-4 py-3 font-body-md text-sm transition-colors";

function nowForInput(): string {
  const d = new Date();
  d.setSeconds(0, 0);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

function emptyForm() {
  return {
    dateTime: nowForInput(),
    durationMinutes: "",
    noiseType: "footsteps" as NoiseType,
    decibelReading: "",
    description: "",
    quietHoursViolation: false,
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function NoiseLog() {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [meta, setMetaState] = useState<LogMeta>({});
  const [form, setForm] = useState(emptyForm());
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [loadedIncidents, loadedMeta] = await Promise.all([
        getAllIncidents(),
        Promise.resolve(getMeta()),
      ]);
      setIncidents(loadedIncidents);
      setMetaState(loadedMeta);
      setLoaded(true);
    })();
  }, []);

  async function refresh() {
    setIncidents(await getAllIncidents());
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.description.trim()) return;

    const incident: Incident = {
      id: editingId ?? crypto.randomUUID(),
      dateTime: new Date(form.dateTime).toISOString(),
      durationMinutes: form.durationMinutes ? Number(form.durationMinutes) : undefined,
      noiseType: form.noiseType,
      decibelReading: form.decibelReading ? Number(form.decibelReading) : undefined,
      description: form.description.trim(),
      quietHoursViolation: form.quietHoursViolation,
    };

    if (editingId) {
      await updateIncident(editingId, incident);
    } else {
      await addIncident(incident);
    }
    setForm(emptyForm());
    setEditingId(null);
    await refresh();
  }

  function handleEdit(incident: Incident) {
    setEditingId(incident.id);
    setForm({
      dateTime: incident.dateTime.slice(0, 16),
      durationMinutes: incident.durationMinutes?.toString() ?? "",
      noiseType: incident.noiseType,
      decibelReading: incident.decibelReading?.toString() ?? "",
      description: incident.description,
      quietHoursViolation: incident.quietHoursViolation ?? false,
    });
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this incident? This can't be undone.")) return;
    await deleteIncident(id);
    if (editingId === id) {
      setEditingId(null);
      setForm(emptyForm());
    }
    await refresh();
  }

  async function handleClearAll() {
    if (!window.confirm("Delete every logged incident? This can't be undone.")) return;
    if (!window.confirm("Really clear the entire log? There is no way to recover it after this.")) return;
    await clearAllIncidents();
    setEditingId(null);
    setForm(emptyForm());
    await refresh();
  }

  function handleMetaChange(patch: Partial<LogMeta>) {
    const next = { ...meta, ...patch };
    setMetaState(next);
    setMeta(next);
  }

  const summary = useMemo(() => {
    if (incidents.length === 0) return null;
    const sorted = [...incidents].sort(
      (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
    );
    const quietHoursCount = incidents.filter((i) => i.quietHoursViolation).length;
    const typeCounts = incidents.reduce<Record<string, number>>((acc, i) => {
      acc[i.noiseType] = (acc[i.noiseType] ?? 0) + 1;
      return acc;
    }, {});
    const mostFrequent = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0];

    return {
      total: incidents.length,
      rangeStart: formatDate(sorted[0].dateTime),
      rangeEnd: formatDate(sorted[sorted.length - 1].dateTime),
      quietHoursCount,
      mostFrequentLabel: mostFrequent
        ? NOISE_TYPE_LABELS[mostFrequent[0] as NoiseType]
        : "—",
    };
  }, [incidents]);

  const groupedByDate = useMemo(() => {
    const sorted = [...incidents].sort(
      (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
    );
    const groups = new Map<string, Incident[]>();
    for (const incident of sorted) {
      const key = formatDate(incident.dateTime);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(incident);
    }
    return Array.from(groups.entries());
  }, [incidents]);

  async function exportPdf() {
    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;

    const doc = new jsPDF();
    const generated = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    doc.setFontSize(16);
    doc.text(`Noise Incident Log — ${meta.address || "Unspecified address"}`, 14, 18);
    doc.setFontSize(10);
    doc.text(`Generated: ${generated}`, 14, 26);
    if (summary) {
      doc.text(
        `Covers: ${summary.rangeStart} – ${summary.rangeEnd} · ${summary.total} incident(s)`,
        14,
        32
      );
    }

    const sorted = [...incidents].sort(
      (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
    );

    autoTable(doc, {
      startY: 38,
      head: [["Date", "Time", "Duration", "Type", "Quiet hours?", "dB", "Description"]],
      body: sorted.map((i) => [
        formatDate(i.dateTime),
        new Date(i.dateTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        i.durationMinutes ? `${i.durationMinutes} min` : "—",
        NOISE_TYPE_LABELS[i.noiseType],
        i.quietHoursViolation ? "Yes" : "No",
        i.decibelReading ? `${i.decibelReading}` : "—",
        i.description,
      ]),
      styles: { fontSize: 8 },
      didDrawPage: () => {
        const pageCount = doc.getNumberOfPages();
        doc.setFontSize(8);
        doc.text(
          `Self-maintained contemporaneous record. Page ${pageCount}`,
          14,
          doc.internal.pageSize.getHeight() - 10
        );
      },
    });

    doc.save(`noise-log-${new Date().toISOString().slice(0, 10)}.pdf`);
  }

  function exportCsv() {
    const header = ["Date", "Time", "Duration (min)", "Type", "Quiet hours violation", "dB", "Description"];
    const rows = incidents.map((i) => [
      formatDate(i.dateTime),
      new Date(i.dateTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      i.durationMinutes?.toString() ?? "",
      NOISE_TYPE_LABELS[i.noiseType],
      i.quietHoursViolation ? "Yes" : "No",
      i.decibelReading?.toString() ?? "",
      `"${i.description.replace(/"/g, '""')}"`,
    ]);
    const csv = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `noise-log-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function sendToLetterGenerator() {
    if (!summary) return;
    const text = `${summary.total} incident(s) logged ${summary.rangeStart} to ${summary.rangeEnd}; ${summary.quietHoursCount} during quiet hours; most frequent: ${summary.mostFrequentLabel}.`;
    router.push(`/community?logSummary=${encodeURIComponent(text)}#letter`);
  }

  if (!loaded) {
    return (
      <p className="font-body-md text-sm text-on-surface-variant">Loading your log…</p>
    );
  }

  return (
    <div>
      <div className="mb-10 border-l-4 border-secondary bg-surface-container-low px-6 py-4">
        <p className="font-body-md text-sm text-on-surface-variant">
          Everything you enter here is stored only in this browser — never
          uploaded, never tracked. Clearing your browser data or clicking
          &quot;Clear all&quot; below removes it permanently. There is no
          account and nothing is sent anywhere.
        </p>
      </div>

      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="border border-outline-variant bg-background p-4 text-center">
            <p className="font-display-lg text-2xl text-primary">{summary.total}</p>
            <p className="font-label-sm text-xs uppercase tracking-widest text-on-surface-variant">
              Incidents
            </p>
          </div>
          <div className="border border-outline-variant bg-background p-4 text-center">
            <p className="font-body-md text-sm text-primary font-bold">
              {summary.rangeStart} – {summary.rangeEnd}
            </p>
            <p className="font-label-sm text-xs uppercase tracking-widest text-on-surface-variant">
              Date range
            </p>
          </div>
          <div className="border border-outline-variant bg-background p-4 text-center">
            <p className="font-display-lg text-2xl text-primary">{summary.quietHoursCount}</p>
            <p className="font-label-sm text-xs uppercase tracking-widest text-on-surface-variant">
              During quiet hours
            </p>
          </div>
          <div className="border border-outline-variant bg-background p-4 text-center">
            <p className="font-body-md text-sm text-primary font-bold">
              {summary.mostFrequentLabel}
            </p>
            <p className="font-label-sm text-xs uppercase tracking-widest text-on-surface-variant">
              Most frequent
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <label className="flex flex-col gap-2">
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">
            Date &amp; time
          </span>
          <input
            type="datetime-local"
            required
            value={form.dateTime}
            onChange={(e) => setForm((f) => ({ ...f, dateTime: e.target.value }))}
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">
            Noise type
          </span>
          <select
            value={form.noiseType}
            onChange={(e) =>
              setForm((f) => ({ ...f, noiseType: e.target.value as NoiseType }))
            }
            className={inputClass}
          >
            {Object.entries(NOISE_TYPE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">
            Duration (minutes, optional)
          </span>
          <input
            type="number"
            min={0}
            value={form.durationMinutes}
            onChange={(e) => setForm((f) => ({ ...f, durationMinutes: e.target.value }))}
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">
            dB reading (optional)
          </span>
          <input
            type="number"
            min={0}
            value={form.decibelReading}
            onChange={(e) => setForm((f) => ({ ...f, decibelReading: e.target.value }))}
            className={inputClass}
          />
          <span className="font-body-md text-xs text-on-surface-variant">
            Optional. If you use a phone sound-meter app, enter its reading.
            Phone readings are approximate and not calibrated.
          </span>
        </label>

        <label className="md:col-span-2 flex flex-col gap-2">
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">
            Description
          </span>
          <textarea
            required
            rows={3}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="What happened, and how it affected you"
            className={inputClass}
          />
        </label>

        <label className="md:col-span-2 flex items-start gap-3 font-body-md text-sm">
          <input
            type="checkbox"
            checked={form.quietHoursViolation}
            onChange={(e) =>
              setForm((f) => ({ ...f, quietHoursViolation: e.target.checked }))
            }
            className="mt-1"
          />
          <span>This happened during posted quiet hours</span>
        </label>

        <div className="md:col-span-2 flex gap-3">
          <button
            type="submit"
            className="bg-primary text-on-primary px-8 py-3 rounded-lg font-label-sm text-label-sm uppercase tracking-widest hover:bg-primary-container transition-all"
          >
            {editingId ? "Save changes" : "Add incident"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm());
              }}
              className="border border-outline text-on-surface-variant px-8 py-3 rounded-lg font-label-sm text-label-sm uppercase tracking-widest hover:border-primary transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 border-t border-outline-variant pt-6">
        <label className="flex flex-col gap-2">
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">
            Address / unit (for your report header, optional)
          </span>
          <input
            value={meta.address ?? ""}
            onChange={(e) => handleMetaChange({ address: e.target.value })}
            placeholder="123 Main St, Unit 4B"
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">
            Landlord / property manager (optional)
          </span>
          <input
            value={meta.unitOrLandlord ?? ""}
            onChange={(e) => handleMetaChange({ unitOrLandlord: e.target.value })}
            placeholder="Property manager name"
            className={inputClass}
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-3 mb-12">
        <button
          type="button"
          disabled={incidents.length === 0}
          onClick={exportPdf}
          className="bg-primary text-on-primary px-6 py-3 rounded-lg font-label-sm text-xs uppercase tracking-widest hover:bg-primary-container transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Export PDF
        </button>
        <button
          type="button"
          disabled={incidents.length === 0}
          onClick={exportCsv}
          className="border border-primary text-primary px-6 py-3 rounded-lg font-label-sm text-xs uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Export CSV
        </button>
        <button
          type="button"
          disabled={incidents.length === 0}
          onClick={sendToLetterGenerator}
          className="border border-secondary text-secondary px-6 py-3 rounded-lg font-label-sm text-xs uppercase tracking-widest hover:bg-secondary hover:text-on-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send to Letter Generator
        </button>
        <button
          type="button"
          disabled={incidents.length === 0}
          onClick={handleClearAll}
          className="border border-error text-error px-6 py-3 rounded-lg font-label-sm text-xs uppercase tracking-widest hover:bg-error hover:text-on-error transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear all
        </button>
      </div>

      {incidents.length === 0 ? (
        <p className="font-body-md text-on-surface-variant border border-outline-variant p-8 text-center">
          No incidents logged yet. Add your first one above — even a short
          description with a date and time is a real record.
        </p>
      ) : (
        <div className="space-y-8">
          {groupedByDate.map(([date, dayIncidents]) => (
            <div key={date}>
              <h3 className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mb-3">
                {date}
              </h3>
              <div className="space-y-2">
                {dayIncidents.map((incident) => (
                  <div
                    key={incident.id}
                    className="border border-outline-variant bg-background p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                  >
                    <div>
                      <p className="font-body-md text-sm text-primary font-bold">
                        {formatDateTime(incident.dateTime)} ·{" "}
                        {NOISE_TYPE_LABELS[incident.noiseType]}
                        {incident.quietHoursViolation && (
                          <span className="ml-2 font-label-sm text-xs text-on-error-container bg-error-container px-2 py-0.5 rounded-full">
                            Quiet hours
                          </span>
                        )}
                      </p>
                      <p className="font-body-md text-sm text-on-surface-variant mt-1">
                        {incident.description}
                      </p>
                      {(incident.durationMinutes || incident.decibelReading) && (
                        <p className="font-body-md text-xs text-on-surface-variant mt-1">
                          {incident.durationMinutes && `${incident.durationMinutes} min`}
                          {incident.durationMinutes && incident.decibelReading && " · "}
                          {incident.decibelReading && `${incident.decibelReading} dB`}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEdit(incident)}
                        className="font-label-sm text-xs uppercase tracking-widest text-primary underline hover:text-secondary transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(incident.id)}
                        className="font-label-sm text-xs uppercase tracking-widest text-error underline hover:opacity-70 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
