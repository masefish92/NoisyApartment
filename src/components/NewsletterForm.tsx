"use client";

import { useState, type FormEvent } from "react";
import { NEWSLETTER_ENDPOINT } from "@/lib/newsletter-config";

export default function NewsletterForm({
  variant = "light",
}: {
  variant?: "light" | "dark";
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!NEWSLETTER_ENDPOINT) {
      // No provider configured yet — show the success UI so the component
      // can be reviewed end-to-end, but nothing is actually sent anywhere.
      setStatus("success");
      return;
    }

    setStatus("pending");
    try {
      const response = await fetch(NEWSLETTER_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(response.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <p
        className={
          variant === "dark"
            ? "font-label-sm text-label-sm uppercase tracking-widest text-on-primary-container"
            : "font-label-sm text-label-sm uppercase tracking-widest text-primary"
        }
      >
        You&apos;re on the list. Welcome to the quiet.
      </p>
    );
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className={
          variant === "dark"
            ? "flex flex-col md:flex-row gap-4 items-center"
            : "flex w-full max-w-md gap-4"
        }
      >
        <input
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={variant === "dark" ? "YOUR EMAIL ADDRESS" : "Your email address"}
          aria-label="Email address"
          className={
            variant === "dark"
              ? "w-full bg-background/10 border-b-2 border-on-primary-container/30 focus:border-on-primary-container outline-none px-4 py-3 text-on-primary-container placeholder:text-on-primary-container/50 font-label-sm"
              : "flex-grow bg-transparent border-b-2 border-primary py-2 px-0 focus:outline-none focus:border-secondary transition-colors placeholder:text-outline/50"
          }
        />
        <button
          type="submit"
          disabled={status === "pending"}
          className={
            (variant === "dark"
              ? "w-full md:w-auto whitespace-nowrap bg-secondary-container text-on-secondary-container px-10 py-4 rounded-lg font-label-sm uppercase tracking-widest hover:bg-secondary transition-all hover:text-white"
              : "bg-primary text-white px-8 py-3 rounded-lg font-label-sm uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all") +
            " disabled:opacity-60 disabled:cursor-not-allowed"
          }
        >
          {status === "pending" ? "Joining…" : variant === "dark" ? "Subscribe" : "JOIN"}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-2 font-body-md text-sm text-error">
          Something went wrong — please try again in a moment.
        </p>
      )}
    </div>
  );
}
