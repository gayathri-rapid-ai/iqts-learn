import React, { useState } from "react";
import { CodeContent } from "../../data";
import CodeEditor from "../code-editor";

function CodeTab({ contents }: { contents: Array<CodeContent> }) {
  const [sampleMode, setSampleMode] = useState<"single" | "compare">("single");

  const [showContents, setShowContents] = useState<CodeContent[]>([
    contents[0],
  ]);

  return (
    <div className="editor-shell">
      <div className="editor-toolbar">
        <div className="editor-toolbar__group">
        <span className="toolbar-label">Mode</span>
        <button
          className={`pill-button${sampleMode === "single" ? " pill-button--active" : ""}`}
          onClick={() => {
            setSampleMode("single");
            setShowContents([showContents[0]]);
          }}
        >
          Single
        </button>
        <button
          className={`pill-button${sampleMode === "compare" ? " pill-button--active" : ""}`}
          onClick={() => {
            setSampleMode("compare");
            setShowContents([
              showContents[0],
              contents[1],
            ]);
          }}
        >
          Compare
        </button>
        </div>
      </div>

      <div className={sampleMode === "compare" ? "code-grid" : ""}>

        {showContents.map((content, idx) => (
            <div key={idx}>
            <CodeEditor
              content={content}
              languages={contents.map((c) => c.language)}
              onChangeLang={(changeLanguage) => {
              const found = contents.find(
                (c) => c.language === changeLanguage,
              );

              setShowContents([
                ...showContents.slice(0, idx),
                ...(found ? [found] : []),
                ...showContents.slice(idx + 1),
              ]);
              }}
            />
            </div>
        ))}
      </div>
    </div>
  );
}

export default CodeTab;
