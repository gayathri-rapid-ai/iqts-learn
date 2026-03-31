"use client";

import Link from "next/link";
import { AppHeader } from "./data";
import React from "react";

export default function HeaderDropdown({
  name,
  appHeader,
}: {
  name: string;
  appHeader: AppHeader;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

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

    const handleScroll = () => {
      setIsOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen]);

  return (
      <div className="header-dropdown" ref={containerRef}>
        <button
          className="header-dropdown__button"
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          aria-expanded={isOpen}
          aria-haspopup="menu"
        >
          {name} ▾
        </button>

        {isOpen && (
            <div className="header-dropdown__menu whitespace-nowrap" role="menu">
            {appHeader.options.map((option) => (
              <Link
              key={option.title}
              href={`/concept/${name.toLowerCase()}/${option.title.toLowerCase()}`}
              data-iq-sorting={option.title}
              className="header-dropdown__item"
              onClick={() => setIsOpen(false)}
              >
              {option.title}
              </Link>
            ))}
            </div>
        )}
      </div>
  );
}
