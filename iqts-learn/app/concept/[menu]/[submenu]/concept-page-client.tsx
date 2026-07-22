"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CodeContent, Concept } from "../../../data";
import Sidebar from "../../../modules/sidebar";
import Tabs from "../../../modules/tabs";

type EditorValues = {
  conceptDescription: string;
  storyContent: string;
  codeSnippets: CodeContent[];
  quizContent: string;
};

function getTabContent(concept: Concept, type: string) {
  return concept.tabs.find((tab) => tab.type === type)?.content ?? "";
}

function getCodeSnippets(concept: Concept): CodeContent[] {
  const codeTab = concept.tabs.find((tab) => tab.type === "Code");

  if (codeTab?.codeSnippets?.length) {
    return codeTab.codeSnippets;
  }

  if (codeTab?.content?.trim()) {
    return [
      {
        language: "javascript",
        code: codeTab.content,
      },
    ];
  }

  return [
    { language: "javascript", code: "" },
    { language: "python", code: "" },
    { language: "java", code: "" },
    { language: "go", code: "" },
  ];
}

const emptyEditorValues: EditorValues = {
  conceptDescription: "",
  storyContent: "",
  codeSnippets: [
    { language: "javascript", code: "" },
    { language: "python", code: "" },
    { language: "java", code: "" },
    { language: "go", code: "" },
  ],
  quizContent: "",
};

export default function ConceptPageClient({
  menuLabel,
  lessonTitle,
  concepts,
  editable,
}: {
  menuLabel: string;
  lessonTitle: string;
  concepts: Concept[];
  editable: boolean;
}) {
  const [items, setItems] = useState<Concept[]>(concepts);
  const [selectedConceptName, setSelectedConceptName] = useState<string>(concepts[0]?.name ?? "");
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [contentError, setContentError] = useState("");
  const [isSavingContent, setIsSavingContent] = useState(false);

  const applyConcept = useCallback((concept: Concept) => {
    setSelectedConceptName(concept.name);
  }, []);

  const handleSectionSaved = useCallback((concept: Concept, previousConceptName?: string) => {
    setItems((current) => {
      const existingIndex = current.findIndex(
        (item) => item.name === (previousConceptName ?? concept.name),
      );

      if (existingIndex === -1) {
        return [...current, concept];
      }

      const next = [...current];
      next[existingIndex] = concept;
      return next;
    });
    setSelectedConceptName(concept.name);
  }, []);

  const handleSectionDeleted = useCallback((conceptName: string) => {
    setItems((current) => current.filter((item) => item.name !== conceptName));
    setSelectedConceptName((current) => (current === conceptName ? "" : current));
  }, []);

  const selectedConcept = useMemo(
    () => items.find((concept) => concept.name === selectedConceptName) ?? items[0],
    [items, selectedConceptName],
  );
  const [editorValues, setEditorValues] = useState<EditorValues>(emptyEditorValues);

  useEffect(() => {
    if (!selectedConcept) {
      setEditorValues(emptyEditorValues);
      return;
    }

    setEditorValues({
      conceptDescription: selectedConcept.description,
      storyContent: getTabContent(selectedConcept, "Story"),
      codeSnippets: getCodeSnippets(selectedConcept),
      quizContent: getTabContent(selectedConcept, "Quiz"),
    });
  }, [selectedConcept]);

  const hasContentChanges = !!selectedConcept && (
    editorValues.conceptDescription !== selectedConcept.description ||
    editorValues.storyContent !== getTabContent(selectedConcept, "Story") ||
    JSON.stringify(editorValues.codeSnippets) !== JSON.stringify(getCodeSnippets(selectedConcept)) ||
    editorValues.quizContent !== getTabContent(selectedConcept, "Quiz")
  );

  const handleContentSave = async () => {
    if (!selectedConcept) {
      return;
    }

    setIsSavingContent(true);
    setContentError("");

    try {
      const response = await fetch("/api/tutorials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update-lesson",
          previousConceptName: selectedConcept.name,
          headerTitle: menuLabel,
          optionTitle: lessonTitle,
          conceptName: selectedConcept.name,
          conceptDescription: editorValues.conceptDescription,
          storyContent: editorValues.storyContent,
          codeSnippets: editorValues.codeSnippets,
          quizContent: editorValues.quizContent,
        }),
      });

      const payload = (await response.json()) as { error?: string; concept?: Concept };

      if (!response.ok || !payload.concept) {
        throw new Error(payload.error || "Unable to update section content.");
      }

      handleSectionSaved(payload.concept, selectedConcept.name);
    } catch (error) {
      setContentError(error instanceof Error ? error.message : "Unable to update section content.");
    } finally {
      setIsSavingContent(false);
    }
  };

  return (
    <div className="content-stack">
      <div className="concept-layout">
        <Sidebar
          sectionLabel={menuLabel}
          lessonTitle={lessonTitle}
          concepts={items}
          selectedConceptName={selectedConceptName}
          onClickItem={applyConcept}
          onSectionSaved={handleSectionSaved}
          onSectionDeleted={handleSectionDeleted}
          editable={editable}
          isAddingSection={isAddingSection}
          onAddSectionOpenChange={setIsAddingSection}
        />
        <section className="content-stack">
          {selectedConcept ? (
            <Tabs
              concept={selectedConcept}
              editable={editable}
              values={editorValues}
              onChangeValues={setEditorValues}
              onSave={hasContentChanges ? handleContentSave : undefined}
              isSaving={isSavingContent}
              errorMessage={contentError}
            />
          ) : (
            <section className="panel">
              <p className="panel__kicker">No Sections Yet</p>
              <h2 className="panel__title">{lessonTitle}</h2>
              <p className="panel__text">
                {editable
                  ? "Use the + button in the sidebar to add the first section to this lesson."
                  : "This lesson does not have any sections yet."}
              </p>
            </section>
          )}
        </section>
      </div>
    </div>
  );
}
