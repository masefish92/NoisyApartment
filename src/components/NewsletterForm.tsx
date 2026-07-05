"use client";

import { useState, type FormEvent } from "react";

export default function NewsletterForm({
  variant = "light",
}: {
  variant?: "light" | "dark";
}) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
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
        placeholder={variant === "dark" ? "YOUR EMAIL ADDRESS" : "Your email address"}
        className={
          variant === "dark"
            ? "w-full bg-background/10 border-b-2 border-on-primary-container/30 focus:border-on-primary-container outline-none px-4 py-3 text-on-primary-container placeholder:text-on-primary-container/50 font-label-sm"
            : "flex-grow bg-transparent border-b-2 border-primary py-2 px-0 focus:outline-none focus:border-secondary transition-colors placeholder:text-outline/50"
        }
      />
      <button
        type="submit"
        className={
          variant === "dark"
            ? "w-full md:w-auto whitespace-nowrap bg-secondary-container text-on-secondary-container px-10 py-4 rounded-lg font-label-sm uppercase tracking-widest hover:bg-secondary transition-all hover:text-white"
            : "bg-primary text-white px-8 py-3 rounded-lg font-label-sm uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all"
        }
      >
        {variant === "dark" ? "Subscribe" : "JOIN"}
      </button>
    </form>
  );
}
