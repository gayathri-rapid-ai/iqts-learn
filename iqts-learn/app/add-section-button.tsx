"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function AddSectionButton() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [title, setTitle] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();

  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/tutorials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create-section",
          headerTitle: title,
        }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to create section.");
      }

      setTitle("");
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to create section.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="launcher" ref={containerRef}>
      <button
        type="button"
        className="launcher__button"
        aria-label="Add section"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        +
      </button>

      {isOpen ? (
        <div className="launcher__panel launcher__panel--right">
          <form className="launcher__form" onSubmit={handleSubmit}>
            <p className="launcher__title">Add section</p>
            <input
              className="launcher__input"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Section title"
              required
            />
            {errorMessage ? <p className="launcher__status launcher__status--error">{errorMessage}</p> : null}
            <button className="launcher__submit" type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save section"}
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
