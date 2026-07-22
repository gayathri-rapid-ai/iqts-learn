"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const [isEditingCourse, setIsEditingCourse] = React.useState(false);
  const [isAddingLesson, setIsAddingLesson] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [courseTitle, setCourseTitle] = React.useState(name);
  const [lessonTitle, setLessonTitle] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();

  React.useEffect(() => {
    setCourseTitle(name);
  }, [name]);

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

  const handleCourseUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/tutorials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update-section",
          previousHeaderTitle: name,
          headerTitle: courseTitle,
        }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to update course.");
      }

      setIsEditingCourse(false);
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to update course.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLessonCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/tutorials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create-course",
          headerTitle: name,
          optionTitle: lessonTitle,
        }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to create lesson.");
      }

      const nextPath = `/concept/${encodeURIComponent(name.toLowerCase())}/${encodeURIComponent(lessonTitle.toLowerCase())}?edit=1`;
      setLessonTitle("");
      setIsAddingLesson(false);
      setIsOpen(false);
      router.refresh();
      router.push(nextPath);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to create lesson.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="header-dropdown-group" ref={containerRef}>
      <div className="header-dropdown">
        <button
          className="header-dropdown__button"
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          aria-expanded={isOpen}
          aria-haspopup="menu"
        >
          {name} ▾
        </button>

        {isOpen ? (
          <div className="header-dropdown__menu whitespace-nowrap" role="menu">
            <div className="header-dropdown__menu-head">
              <p className="header-dropdown__label">Lessons</p>
              <div className="header-dropdown__menu-actions">
                <button
                  type="button"
                  className="header-dropdown__icon-button"
                  aria-label={`Edit ${name}`}
                  onClick={() => {
                    setIsEditingCourse((current) => !current);
                    setIsAddingLesson(false);
                    setErrorMessage("");
                  }}
                >
                  ✎
                </button>
                <button
                  type="button"
                  className="header-dropdown__add"
                  aria-label={`Add lesson to ${name}`}
                  onClick={() => {
                    setIsAddingLesson((current) => !current);
                    setIsEditingCourse(false);
                    setErrorMessage("");
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {isEditingCourse ? (
              <form className="inline-add-form" onSubmit={handleCourseUpdate}>
                <input
                  className="inline-add-form__input"
                  value={courseTitle}
                  onChange={(event) => setCourseTitle(event.target.value)}
                  placeholder="Course title"
                  required
                />
                {errorMessage ? <p className="inline-add-form__status inline-add-form__status--error">{errorMessage}</p> : null}
                <button className="inline-add-form__submit" type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save course"}
                </button>
              </form>
            ) : null}

            {appHeader.options.map((option) => (
              <div key={option.title} className="header-dropdown__lesson-row">
                <Link
                  href={`/concept/${encodeURIComponent(name.toLowerCase())}/${encodeURIComponent(option.title.toLowerCase())}`}
                  data-iq-sorting={option.title}
                  className="header-dropdown__item"
                  onClick={() => setIsOpen(false)}
                >
                  {option.title}
                </Link>
                <Link
                  href={`/concept/${encodeURIComponent(name.toLowerCase())}/${encodeURIComponent(option.title.toLowerCase())}?edit=1`}
                  className="header-dropdown__icon-button header-dropdown__icon-button--lesson"
                  aria-label={`Edit ${option.title}`}
                  onClick={() => setIsOpen(false)}
                >
                  ✎
                </Link>
              </div>
            ))}

            {isAddingLesson ? (
              <form className="inline-add-form" onSubmit={handleLessonCreate}>
                <input
                  className="inline-add-form__input"
                  value={lessonTitle}
                  onChange={(event) => setLessonTitle(event.target.value)}
                  placeholder="Lesson title"
                  required
                />
                {errorMessage ? <p className="inline-add-form__status inline-add-form__status--error">{errorMessage}</p> : null}
                <button className="inline-add-form__submit" type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save lesson"}
                </button>
              </form>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
