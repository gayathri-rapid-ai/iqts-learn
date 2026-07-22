import ConceptPageClient from "./concept-page-client";
import { getAppData } from "../../../../lib/tutorial-store";

function normalizeTitle(value: string) {
  return decodeURIComponent(value).trim().toLowerCase();
}

async function ConceptPage({
  params,
  searchParams,
}: {
  params: Promise<{ menu: string; submenu: string }>;
  searchParams?: Promise<{ edit?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const appData = await getAppData();
  const normalizedMenu = normalizeTitle(resolvedParams.menu);
  const normalizedSubmenu = normalizeTitle(resolvedParams.submenu);
  const editable = resolvedSearchParams?.edit === "1";
  const header = appData.headers.find(
    (item) => normalizeTitle(item.title) === normalizedMenu,
  );
  const conceptDetails = header?.options.find(
    (option) => normalizeTitle(option.title) === normalizedSubmenu,
  );
  const concepts = conceptDetails?.concepts;

  if (!concepts) {
    return (
      <div className="panel">
        <p className="panel__kicker">Not Found</p>
        <h1 className="panel__title">No concept found for this lesson</h1>
        <p className="panel__text">
          We couldn&apos;t match <strong>{resolvedParams.menu}</strong> / <strong>{resolvedParams.submenu}</strong> to the current data set.
        </p>
      </div>
    );
  }
  return (
    <ConceptPageClient
      menuLabel={header?.title ?? decodeURIComponent(resolvedParams.menu)}
      lessonTitle={conceptDetails?.title ?? decodeURIComponent(resolvedParams.submenu)}
      concepts={concepts}
      editable={editable}
    />
  );
}

export default ConceptPage;
