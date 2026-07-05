"use client";

import { useState, type FormEvent } from "react";
import { X } from "lucide-react";

export default function GetCalmButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const close = () => {
    setOpen(false);
    setSubmitted(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={
          className ??
          "bg-primary text-on-primary px-6 py-2 rounded-lg font-label-sm text-label-sm uppercase tracking-widest active:scale-[0.98] transition-all hover:bg-primary-container"
        }
      >
        GET CALM
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-inverse-surface/40 backdrop-blur-sm px-4"
          onClick={close}
        >
          <div
            className="w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-xl p-8 relative hard-shadow"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              onClick={close}
              aria-label="Close"
              className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors"
            >
              <X size={20} />
            </button>

            {submitted ? (
              <div className="py-6 text-center">
                <h3 className="font-headline-md text-headline-md text-primary mb-3">
                  Request received.
                </h3>
                <p className="font-body-md text-on-surface-variant">
                  An acoustic architect will reach out within one business day
                  to schedule your consultation.
                </p>
                <button
                  onClick={close}
                  className="mt-6 bg-primary text-on-primary px-6 py-2 rounded-lg font-label-sm text-label-sm uppercase tracking-widest"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-headline-md text-headline-md text-primary mb-2">
                  Get Calm
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                  Tell us about your space and an acoustic architect will follow up
                  with a tailored plan.
                </p>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <input
                    required
                    type="text"
                    placeholder="YOUR NAME"
                    className="w-full bg-surface-container-low border-b-2 border-tertiary/40 focus:border-primary outline-none px-4 py-3 font-label-sm text-label-sm placeholder:text-on-surface-variant/60 transition-colors"
                  />
                  <input
                    required
                    type="email"
                    placeholder="YOUR EMAIL ADDRESS"
                    className="w-full bg-surface-container-low border-b-2 border-tertiary/40 focus:border-primary outline-none px-4 py-3 font-label-sm text-label-sm placeholder:text-on-surface-variant/60 transition-colors"
                  />
                  <textarea
                    placeholder="TELL US ABOUT YOUR NOISE PROBLEM"
                    rows={3}
                    className="w-full bg-surface-container-low border-b-2 border-tertiary/40 focus:border-primary outline-none px-4 py-3 font-label-sm text-label-sm placeholder:text-on-surface-variant/60 transition-colors resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full bg-primary text-on-primary px-6 py-3 rounded-lg font-label-sm text-label-sm uppercase tracking-widest hover:bg-primary-container transition-all active:scale-[0.98]"
                  >
                    Request Consultation
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
