import React, { useEffect } from "react";
import { CodeContent, Concept, ConceptTab } from "../../data";
import CodeTab from "../code-tab";
import { Language } from "../../../lib/runner";

type EditableTabValues = {
  conceptDescription: string;
  storyContent: string;
  codeSnippets: CodeContent[];
  quizContent: string;
};

const supportedLanguages: Language[] = ["javascript", "python", "java", "go"];

function getTabContent(concept: Concept, type: string) {
  return concept.tabs.find((tab) => tab.type === type)?.content ?? "";
}

function getEditableCodeSnippets(concept: Concept): CodeContent[] {
  const codeTab = concept.tabs.find((tab) => tab.type === "Code");
  const existing = codeTab?.codeSnippets ?? [];

  return supportedLanguages.map((language) => ({
    language,
    code:
      existing.find((snippet) => snippet.language === language)?.code ??
      (language === "javascript" ? codeTab?.content ?? "" : ""),
  }));
}

export default function Tabs({
  concept,
  editable = false,
  values,
  onChangeValues,
  onSave,
  isSaving = false,
  errorMessage = "",
}: {
  concept: Concept;
  editable?: boolean;
  values?: EditableTabValues;
  onChangeValues?: (values: EditableTabValues) => void;
  onSave?: () => void;
  isSaving?: boolean;
  errorMessage?: string;
}) {
  const [selectedTab, setSelectedTab] = React.useState<ConceptTab>(concept.tabs?.[0]);
  const [selectedLanguage, setSelectedLanguage] = React.useState<Language>("javascript");

  useEffect(() => {
    setSelectedTab(concept.tabs?.[0]);
  }, [concept]);

  useEffect(() => {
    const firstWithCode = (values?.codeSnippets ?? getEditableCodeSnippets(concept)).find(
      (snippet) => snippet.code.trim().length > 0,
    );
    setSelectedLanguage(firstWithCode?.language ?? "javascript");
  }, [concept, values?.codeSnippets]);

  const codeTab = concept.tabs.find((tab) => tab.type === "Code");
  const hasCodeSnippets = !!codeTab?.codeSnippets?.length;
  const editorValues = values ?? {
    conceptDescription: concept.description,
    storyContent: getTabContent(concept, "Story"),
    codeSnippets: getEditableCodeSnippets(concept),
    quizContent: getTabContent(concept, "Quiz"),
  };
  const hasChanges = editable && !!onSave;
  const currentSnippet = editorValues.codeSnippets.find(
    (snippet) => snippet.language === selectedLanguage,
  ) ?? editorValues.codeSnippets[0];

  return (
    <>
      {editable ? (
        <section className="panel">
          <p className="panel__kicker">Section Details</p>
          <h2 className="panel__title">{concept.name}</h2>
          <div className="inline-editor">
            <textarea
              className="inline-editor__textarea inline-editor__textarea--compact"
              value={editorValues.conceptDescription}
              onChange={(event) =>
                onChangeValues?.({
                  ...editorValues,
                  conceptDescription: event.target.value,
                })
              }
              rows={3}
              placeholder="Add a short description for this section"
            />
          </div>
        </section>
      ) : null}

      <div className="tabs-row">
        {concept?.tabs?.map((tab) => {
          const isCodeTab = tab.type === "Code" && (tab.codeSnippets?.length || editable || tab.content);

          return (
            (isCodeTab || tab.type !== "Code") && (
              <button
                key={tab.type}
                className={`tab-button${selectedTab.type === tab.type ? " tab-button--active" : ""}`}
                onClick={() => setSelectedTab(tab)}
              >
                {tab.type}
              </button>
            )
          );
        })}
      </div>

      {selectedTab.type === "Story" && (
        <section className="panel">
          <p className="panel__kicker">Story</p>
          <h2 className="panel__title">{concept.name}</h2>
          {editable ? (
            <div className="inline-editor">
              <textarea
                className="inline-editor__textarea"
                value={editorValues.storyContent}
                onChange={(event) =>
                  onChangeValues?.({
                    ...editorValues,
                    storyContent: event.target.value,
                  })
                }
                rows={10}
                placeholder="Write the story section"
              />
              {errorMessage ? <p className="inline-add-form__status inline-add-form__status--error">{errorMessage}</p> : null}
              {hasChanges ? (
                <button className="inline-add-form__submit" type="button" onClick={onSave} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save"}
                </button>
              ) : null}
            </div>
          ) : typeof selectedTab.content === "string" ? (
            selectedTab.content.split("\n").filter(Boolean).map((paragraph, index) => (
              <p key={index} className="panel__text">{paragraph}</p>
            ))
          ) : null}
        </section>
      )}

      {selectedTab.type === "Code" && (
        !editable && hasCodeSnippets ? (
          <CodeTab contents={codeTab?.codeSnippets ?? []} />
        ) : (
          <section className="panel">
            <p className="panel__kicker">Code</p>
            <h2 className="panel__title">{concept.name}</h2>
            {editable ? (
              <div className="inline-editor">
                <div className="technology-row">
                  {supportedLanguages.map((language) => (
                    <button
                      key={language}
                      type="button"
                      className={`technology-pill${selectedLanguage === language ? " technology-pill--active" : ""}`}
                      onClick={() => setSelectedLanguage(language)}
                    >
                      {language}
                    </button>
                  ))}
                </div>
                <textarea
                  className="inline-editor__textarea inline-editor__textarea--code"
                  value={currentSnippet?.code ?? ""}
                  onChange={(event) =>
                    onChangeValues?.({
                      ...editorValues,
                      codeSnippets: editorValues.codeSnippets.map((snippet) =>
                        snippet.language === selectedLanguage
                          ? { ...snippet, code: event.target.value }
                          : snippet,
                      ),
                    })
                  }
                  rows={12}
                  placeholder="Add coding notes or code samples"
                />
                {errorMessage ? <p className="inline-add-form__status inline-add-form__status--error">{errorMessage}</p> : null}
                {hasChanges ? (
                  <button className="inline-add-form__submit" type="button" onClick={onSave} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                ) : null}
              </div>
            ) : (
              <pre className="inline-editor__preview">{getTabContent(concept, "Code")}</pre>
            )}
          </section>
        )
      )}

      {selectedTab.type === "Quiz" && (
        <section className="panel">
          <p className="panel__kicker">Quiz</p>
          <h2 className="panel__title">Check your understanding</h2>
          {editable ? (
            <div className="inline-editor">
              <textarea
                className="inline-editor__textarea"
                value={editorValues.quizContent}
                onChange={(event) =>
                  onChangeValues?.({
                    ...editorValues,
                    quizContent: event.target.value,
                  })
                }
                rows={8}
                placeholder="Write quiz questions"
              />
              {errorMessage ? <p className="inline-add-form__status inline-add-form__status--error">{errorMessage}</p> : null}
              {hasChanges ? (
                <button className="inline-add-form__submit" type="button" onClick={onSave} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save"}
                </button>
              ) : null}
            </div>
          ) : typeof selectedTab.content === "string" ? (
            selectedTab.content.split("\n").filter(Boolean).map((paragraph, index) => (
              <p key={index} className="panel__text">{paragraph}</p>
            ))
          ) : null}
        </section>
      )}
    </>
  );
}
