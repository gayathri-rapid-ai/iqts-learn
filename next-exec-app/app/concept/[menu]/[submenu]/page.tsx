"use client";

import { useCallback, useState } from "react";
import { Concept, data } from "../../../data";
import Sidebar from "../../../modules/sidebar";
import Tabs from "../../../modules/tabs";

function ConceptPage({
  params,
}: {
  params: { menu: string; submenu: string };
}) {
  // Get concept data for the selected menu and submenu
  const decodedMenu = decodeURIComponent(params.menu);
  const decodedSubmenu = decodeURIComponent(params.submenu);
  const conceptDetails = data.headers
    .find((header) => header.title.toLowerCase() === decodedMenu)
    ?.options.find((option) => option.title.toLowerCase() === decodedSubmenu);
  const concepts = conceptDetails?.concepts;
  const [selectedConceptName, setSelectedConceptName] = useState<string>(
    concepts?.[0]?.name ?? "",
  );

  const applyConcept = useCallback((concept: Concept) => {
    setSelectedConceptName(concept.name);
    // update code pane(s) with current language(s)
  }, []);

  if (!concepts) {
    return (
      <div className="panel">
        <p className="panel__kicker">Not Found</p>
        <h1 className="panel__title">No concept found for this lesson</h1>
        <p className="panel__text">
          We couldn&apos;t match <strong>{params.menu}</strong> / <strong>{params.submenu}</strong> to the current data set.
        </p>
      </div>
    );
  }

  const selectedConcept = concepts.find((c) => c.name === selectedConceptName) ?? concepts[0];

  return (
    <div>
      <div className="concept-layout">
        <Sidebar
          sectionLabel={decodedMenu}
          concepts={concepts}
          selectedConceptName={selectedConceptName}
          onClickItem={applyConcept}
        />
        <section className="content-stack">
            {selectedConcept && (
              <Tabs concept={selectedConcept} />
            )}
        </section>
      </div>
    </div>
  );
}

export default ConceptPage;
