import React, { useEffect } from "react";
import { Concept, ConceptTab } from "../../data";
import CodeTab from "../code-tab";

export default function Tabs({ concept }: { concept: Concept }) {
    const [selectedTab, setSelectedTab] = React.useState<ConceptTab>(
        concept.tabs?.[0],
    );

    useEffect(() => {
      setSelectedTab(concept.tabs?.[0]);
    }, [concept]);

    return (
        <>
            <div className="tabs-row">
                {concept?.tabs?.map((t) => {

                    const isCodeTab = t.type === "Code" && t.codeSnippets && t.codeSnippets.length > 0;

                    return ((isCodeTab || t.type !== "Code") && <button
                        key={t.type}
                        className={`tab-button${selectedTab.type === t.type ? " tab-button--active" : ""}`}
                        onClick={() => setSelectedTab(t)}
                    >
                        {t.type}
                    </button>)
                })}
            </div>

            {selectedTab.type === "Story" && (
                <section className="panel">
                    <p className="panel__kicker">Story</p>
                    <h2 className="panel__title">{concept.name}</h2>
                    {typeof selectedTab.content === "string" && (
                        selectedTab.content.split("\n").filter(Boolean).map((paragraph, index) => (
                            <p key={index} className="panel__text">{paragraph}</p>
                        ))
                    )}
                </section>
            )}

            {selectedTab.type === "Code" && selectedTab.codeSnippets?.length && (
                <CodeTab contents={selectedTab.codeSnippets ?? []} />
            )}

            {selectedTab.type === "Quiz" && (
                <section className="panel">
                    <p className="panel__kicker">Quiz</p>
                    <h2 className="panel__title">Check your understanding</h2>
                    {typeof selectedTab.content === "string" && (
                        selectedTab.content.split("\n").filter(Boolean).map((paragraph, index) => (
                            <p key={index} className="panel__text">{paragraph}</p>
                        ))
                    )}
                </section>
            )}
        </>
    );
}
