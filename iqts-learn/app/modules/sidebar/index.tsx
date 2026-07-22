"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { Concept } from "../../data";

export default function Sidebar({
  sectionLabel,
  lessonTitle,
  concepts,
  selectedConceptName,
  onClickItem,
  onSectionSaved,
  onSectionDeleted,
  editable,
  isAddingSection,
  onAddSectionOpenChange,
}: {
  sectionLabel: string;
  lessonTitle: string;
  concepts: Concept[];
  selectedConceptName: string;
  onClickItem: (concept: Concept) => void;
  onSectionSaved: (concept: Concept, previousConceptName?: string) => void;
  onSectionDeleted: (conceptName: string) => void;
  editable: boolean;
  isAddingSection: boolean;
  onAddSectionOpenChange: (next: boolean) => void;
}) {
  const [isSaving, setIsSaving] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [editingSectionName, setEditingSectionName] = React.useState("");
  const [formState, setFormState] = React.useState({
    conceptName: "",
    conceptDescription: "",
  });
  const router = useRouter();

  const getTabContent = (concept: Concept, type: string) =>
    concept.tabs.find((tab) => tab.type === type)?.content ?? "";

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setFormState({
      conceptName: "",
      conceptDescription: "",
    });
  };

  const handleCreateSection = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/tutorials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create-lesson",
          headerTitle: sectionLabel,
          optionTitle: lessonTitle,
          conceptName: formState.conceptName,
          conceptDescription: formState.conceptDescription,
          storyContent: "",
          codeContent: "",
          quizContent: "",
        }),
      });

      const payload = (await response.json()) as { error?: string; concept?: Concept };

      if (!response.ok || !payload.concept) {
        throw new Error(payload.error || "Unable to create section.");
      }

      onSectionSaved(payload.concept);
      resetForm();
      onAddSectionOpenChange(false);
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to create section.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateSection = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/tutorials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update-lesson",
          previousConceptName: editingSectionName,
          headerTitle: sectionLabel,
          optionTitle: lessonTitle,
          conceptName: formState.conceptName,
          conceptDescription: formState.conceptDescription,
          storyContent: getTabContent(concepts.find((concept) => concept.name === editingSectionName) ?? {
            name: "",
            description: "",
            tabs: [],
          }, "Story"),
          codeContent: getTabContent(concepts.find((concept) => concept.name === editingSectionName) ?? {
            name: "",
            description: "",
            tabs: [],
          }, "Code"),
          quizContent: getTabContent(concepts.find((concept) => concept.name === editingSectionName) ?? {
            name: "",
            description: "",
            tabs: [],
          }, "Quiz"),
        }),
      });

      const payload = (await response.json()) as { error?: string; concept?: Concept };

      if (!response.ok || !payload.concept) {
        throw new Error(payload.error || "Unable to update section.");
      }

      onSectionSaved(payload.concept, editingSectionName);
      resetForm();
      setEditingSectionName("");
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to update section.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSection = async (conceptName: string) => {
    setIsSaving(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/tutorials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete-lesson",
          headerTitle: sectionLabel,
          optionTitle: lessonTitle,
          conceptName,
        }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to delete section.");
      }

      onSectionDeleted(conceptName);
      if (editingSectionName === conceptName) {
        setEditingSectionName("");
        resetForm();
      }
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to delete section.");
    } finally {
      setIsSaving(false);
    }
  };

  const startEditingSection = (concept: Concept) => {
    setEditingSectionName((current) => (current === concept.name ? "" : concept.name));
    onAddSectionOpenChange(false);
    setErrorMessage("");
    setFormState({
      conceptName: concept.name,
      conceptDescription: concept.description,
    });
  };

  return (
    <aside className="sidebar-card">
      <div className="sidebar-card__top">
        <div className="sidebar-card__heading">
          <div className="sidebar-card__eyebrow">{sectionLabel}</div>
          <p className="sidebar-card__course">{lessonTitle}</p>
        </div>
        {editable ? (
          <button
            type="button"
            className="sidebar-card__add"
            aria-label={`Add section to ${lessonTitle}`}
            onClick={() => {
              onAddSectionOpenChange(!isAddingSection);
              setEditingSectionName("");
              setErrorMessage("");
              resetForm();
            }}
          >
            +
          </button>
        ) : null}
      </div>

      {editable && isAddingSection ? (
        <form className="inline-add-form inline-add-form--sidebar" onSubmit={handleCreateSection}>
          <input
            className="inline-add-form__input"
            name="conceptName"
            value={formState.conceptName}
            onChange={handleChange}
            placeholder="Section title"
            required
          />
          <input
            className="inline-add-form__input"
            name="conceptDescription"
            value={formState.conceptDescription}
            onChange={handleChange}
            placeholder="Short description"
          />
          {errorMessage ? <p className="inline-add-form__status inline-add-form__status--error">{errorMessage}</p> : null}
          <button className="inline-add-form__submit" type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save section"}
          </button>
        </form>
      ) : null}

      <ul className="sidebar-list">
        {concepts.map((concept) => {
          const active = concept.name === selectedConceptName;

          return (
            <li key={concept.name}>
              <div className="sidebar-item">
                <button
                  type="button"
                  className={`sidebar-button${active ? " sidebar-button--active" : ""}`}
                  onClick={() => onClickItem(concept)}
                >
                  <span className="sidebar-button__title">{concept.name}</span>
                  <span className="sidebar-button__description">{concept.description}</span>
                </button>
                {editable ? (
                  <div className="sidebar-item__actions">
                    <button
                      type="button"
                      className="sidebar-item__edit"
                      aria-label={`Edit ${concept.name}`}
                      onClick={() => startEditingSection(concept)}
                    >
                      ✎
                    </button>
                    <button
                      type="button"
                      className="sidebar-item__delete"
                      aria-label={`Delete ${concept.name}`}
                      onClick={() => handleDeleteSection(concept.name)}
                    >
                      ×
                    </button>
                  </div>
                ) : null}
              </div>

              {editable && editingSectionName === concept.name ? (
                <form className="inline-add-form inline-add-form--sidebar" onSubmit={handleUpdateSection}>
                  <input
                    className="inline-add-form__input"
                    name="conceptName"
                    value={formState.conceptName}
                    onChange={handleChange}
                    placeholder="Section title"
                    required
                  />
                  <input
                    className="inline-add-form__input"
                    name="conceptDescription"
                    value={formState.conceptDescription}
                    onChange={handleChange}
                    placeholder="Short description"
                  />
                  {errorMessage ? <p className="inline-add-form__status inline-add-form__status--error">{errorMessage}</p> : null}
                  <button className="inline-add-form__submit" type="submit" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save section"}
                  </button>
                </form>
              ) : null}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
