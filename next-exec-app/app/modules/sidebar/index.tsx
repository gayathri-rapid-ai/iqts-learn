import { Concept } from "../../data";

export default function Sidebar({
  sectionLabel,
  concepts,
  selectedConceptName,
  onClickItem,
}: {
  sectionLabel: string;
  concepts: Concept[];
  selectedConceptName: string;
  onClickItem: (concept: Concept) => void;
}) {


    return (
        <aside className="sidebar-card">
          <div className="sidebar-card__eyebrow">{sectionLabel}</div>
          <ul className="sidebar-list">
            {concepts.map((c: Concept) => {
              const active = c.name === selectedConceptName;
              return (
                <li key={c.name}>
                  <button
                    type="button"
                    className={`sidebar-button${active ? " sidebar-button--active" : ""}`}
                    onClick={() => onClickItem(c)}
                  >
                    <span className="sidebar-button__title">{c.name}</span>
                    <span className="sidebar-button__description">{c.description}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>
    )
}
