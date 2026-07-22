import "server-only";

import { promises as fs } from "fs";
import path from "path";
import { unstable_noStore as noStore } from "next/cache";
import { data, type AppHeader, type AppLayout, type CodeContent, type Concept } from "../app/data";

const tutorialsPath = path.join(process.cwd(), "app", "tutorials.json");

type StoredTutorialData = {
  headers: AppHeader[];
};

type NewTutorialInput = {
  headerTitle: string;
  optionTitle: string;
  conceptName: string;
  conceptDescription: string;
  storyContent?: string;
  codeContent?: string;
  codeSnippets?: CodeContent[];
  quizContent?: string;
};

function normalizeTitle(value: string) {
  return value.trim().toLowerCase();
}

function createTutorialConcept(input: NewTutorialInput): Concept {
  const codeSnippets = input.codeSnippets?.filter(
    (snippet) => snippet.code.trim().length > 0,
  );

  return {
    name: input.conceptName.trim(),
    description: input.conceptDescription.trim(),
    tabs: [
      {
        type: "Story",
        content: input.storyContent?.trim() ?? "",
      },
      {
        type: "Code",
        ...(codeSnippets?.length
          ? { codeSnippets }
          : { content: input.codeContent?.trim() ?? "" }),
      },
      {
        type: "Quiz",
        content: input.quizContent?.trim() ?? "",
      },
    ],
  };
}

async function ensureTutorialsFile() {
  try {
    await fs.access(tutorialsPath);
  } catch {
    await fs.writeFile(tutorialsPath, JSON.stringify({ headers: [] }, null, 2), "utf8");
  }
}

async function readStoredTutorials(): Promise<StoredTutorialData> {
  noStore();
  await ensureTutorialsFile();

  const raw = await fs.readFile(tutorialsPath, "utf8");
  const parsed = JSON.parse(raw) as Partial<StoredTutorialData>;

  return {
    headers: Array.isArray(parsed.headers) ? parsed.headers : [],
  };
}

async function writeStoredTutorials(value: StoredTutorialData) {
  await fs.writeFile(tutorialsPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function cloneStoredHeader(headerTitle: string): AppHeader {
  return {
    title: headerTitle,
    options: [],
  };
}

function mergeHeaders(baseHeaders: AppHeader[], extraHeaders: AppHeader[]) {
  const merged = baseHeaders.map((header) => ({
    ...header,
    options: [...header.options],
  }));

  for (const extraHeader of extraHeaders) {
    const existingHeader = merged.find(
      (header) => normalizeTitle(header.title) === normalizeTitle(extraHeader.title),
    );

    if (!existingHeader) {
      merged.push({
        ...extraHeader,
        options: [...extraHeader.options],
      });
      continue;
    }

    for (const option of extraHeader.options) {
      const existingOption = existingHeader.options.find(
        (item) => normalizeTitle(item.title) === normalizeTitle(option.title),
      );

      if (!existingOption) {
        existingHeader.options.push({
          ...option,
          concepts: [...option.concepts],
        });
        continue;
      }

      existingOption.concepts.push(...option.concepts);
    }
  }

  return merged;
}

export async function getAppData(): Promise<AppLayout> {
  const stored = await readStoredTutorials();

  return {
    headers: mergeHeaders(data.headers, stored.headers),
  };
}

export async function addSection(headerTitleInput: string) {
  const headerTitle = headerTitleInput.trim();

  if (!headerTitle) {
    throw new Error("Section title is required.");
  }

  const stored = await readStoredTutorials();
  const merged = mergeHeaders(data.headers, stored.headers);
  const exists = merged.some((header) => normalizeTitle(header.title) === normalizeTitle(headerTitle));

  if (exists) {
    throw new Error("A section with that name already exists.");
  }

  stored.headers.push(cloneStoredHeader(headerTitle));
  await writeStoredTutorials(stored);
}

export async function addCourse(headerTitleInput: string, optionTitleInput: string) {
  const headerTitle = headerTitleInput.trim();
  const optionTitle = optionTitleInput.trim();

  if (!headerTitle || !optionTitle) {
    throw new Error("Section and course title are required.");
  }

  const stored = await readStoredTutorials();
  const merged = mergeHeaders(data.headers, stored.headers);
  const existingHeader = merged.find((header) => normalizeTitle(header.title) === normalizeTitle(headerTitle));

  if (!existingHeader) {
    throw new Error("Section not found.");
  }

  const duplicateCourse = existingHeader.options.some(
    (option) => normalizeTitle(option.title) === normalizeTitle(optionTitle),
  );

  if (duplicateCourse) {
    throw new Error("A course with that name already exists in this section.");
  }

  let storedHeader = stored.headers.find(
    (header) => normalizeTitle(header.title) === normalizeTitle(headerTitle),
  );

  if (!storedHeader) {
    storedHeader = cloneStoredHeader(headerTitle);
    stored.headers.push(storedHeader);
  }

  storedHeader.options.push({
    title: optionTitle,
    concepts: [],
  });

  await writeStoredTutorials(stored);
}

export async function updateSection(previousTitleInput: string, nextTitleInput: string) {
  const previousTitle = previousTitleInput.trim();
  const nextTitle = nextTitleInput.trim();

  if (!previousTitle || !nextTitle) {
    throw new Error("Section title is required.");
  }

  const stored = await readStoredTutorials();
  const duplicate = mergeHeaders(data.headers, stored.headers).some(
    (header) =>
      normalizeTitle(header.title) === normalizeTitle(nextTitle) &&
      normalizeTitle(header.title) !== normalizeTitle(previousTitle),
  );

  if (duplicate) {
    throw new Error("A section with that name already exists.");
  }

  const storedHeader = stored.headers.find(
    (header) => normalizeTitle(header.title) === normalizeTitle(previousTitle),
  );

  if (!storedHeader) {
    throw new Error("Only custom sections can be edited right now.");
  }

  storedHeader.title = nextTitle;
  await writeStoredTutorials(stored);
}

export async function updateCourse(
  headerTitleInput: string,
  previousTitleInput: string,
  nextTitleInput: string,
) {
  const headerTitle = headerTitleInput.trim();
  const previousTitle = previousTitleInput.trim();
  const nextTitle = nextTitleInput.trim();

  if (!headerTitle || !previousTitle || !nextTitle) {
    throw new Error("Section and course title are required.");
  }

  const stored = await readStoredTutorials();
  const storedHeader = stored.headers.find(
    (header) => normalizeTitle(header.title) === normalizeTitle(headerTitle),
  );

  if (!storedHeader) {
    throw new Error("Only custom courses can be edited right now.");
  }

  const duplicate = mergeHeaders(data.headers, stored.headers)
    .find((header) => normalizeTitle(header.title) === normalizeTitle(headerTitle))
    ?.options.some(
      (option) =>
        normalizeTitle(option.title) === normalizeTitle(nextTitle) &&
        normalizeTitle(option.title) !== normalizeTitle(previousTitle),
    );

  if (duplicate) {
    throw new Error("A course with that name already exists in this section.");
  }

  const storedOption = storedHeader.options.find(
    (option) => normalizeTitle(option.title) === normalizeTitle(previousTitle),
  );

  if (!storedOption) {
    throw new Error("Only custom courses can be edited right now.");
  }

  storedOption.title = nextTitle;
  await writeStoredTutorials(stored);
}

export async function deleteCourse(headerTitleInput: string, optionTitleInput: string) {
  const headerTitle = headerTitleInput.trim();
  const optionTitle = optionTitleInput.trim();

  if (!headerTitle || !optionTitle) {
    throw new Error("Section and lesson title are required.");
  }

  const stored = await readStoredTutorials();
  const storedHeader = stored.headers.find(
    (header) => normalizeTitle(header.title) === normalizeTitle(headerTitle),
  );

  if (!storedHeader) {
    throw new Error("Only custom lessons can be removed right now.");
  }

  const nextOptions = storedHeader.options.filter(
    (option) => normalizeTitle(option.title) !== normalizeTitle(optionTitle),
  );

  if (nextOptions.length === storedHeader.options.length) {
    throw new Error("Only custom lessons can be removed right now.");
  }

  storedHeader.options = nextOptions;
  await writeStoredTutorials(stored);
}

export async function addTutorial(input: NewTutorialInput) {
  if (!input.headerTitle.trim() || !input.optionTitle.trim() || !input.conceptName.trim()) {
    throw new Error("Header, tutorial title, and concept name are required.");
  }

  const stored = await readStoredTutorials();
  const concept = createTutorialConcept(input);
  const headerTitle = input.headerTitle.trim();
  const optionTitle = input.optionTitle.trim();

  const existingHeader = stored.headers.find(
    (header) => normalizeTitle(header.title) === normalizeTitle(headerTitle),
  );

  if (!existingHeader) {
    stored.headers.push({
      title: headerTitle,
      options: [
        {
          title: optionTitle,
          concepts: [concept],
        },
      ],
    });
    await writeStoredTutorials(stored);
    return;
  }

  const existingOption = existingHeader.options.find(
    (option) => normalizeTitle(option.title) === normalizeTitle(optionTitle),
  );

  if (!existingOption) {
    existingHeader.options.push({
      title: optionTitle,
      concepts: [concept],
    });
    await writeStoredTutorials(stored);
    return;
  }

  const duplicateConcept = existingOption.concepts.some(
    (item) => normalizeTitle(item.name) === normalizeTitle(concept.name),
  );

  if (duplicateConcept) {
    throw new Error("A concept with that name already exists in this tutorial.");
  }

  existingOption.concepts.push(concept);
  await writeStoredTutorials(stored);

  return concept;
}

export async function updateTutorial(
  headerTitleInput: string,
  optionTitleInput: string,
  previousConceptNameInput: string,
  input: NewTutorialInput,
) {
  const headerTitle = headerTitleInput.trim();
  const optionTitle = optionTitleInput.trim();
  const previousConceptName = previousConceptNameInput.trim();
  const nextConceptName = input.conceptName.trim();
  if (!headerTitle || !optionTitle || !previousConceptName || !nextConceptName) {
    throw new Error("Section, course, and lesson title are required.");
  }

  const stored = await readStoredTutorials();
  const storedHeader = stored.headers.find(
    (header) => normalizeTitle(header.title) === normalizeTitle(headerTitle),
  );

  if (!storedHeader) {
    throw new Error("Only custom lessons can be edited right now.");
  }

  const storedOption = storedHeader.options.find(
    (option) => normalizeTitle(option.title) === normalizeTitle(optionTitle),
  );

  if (!storedOption) {
    throw new Error("Only custom lessons can be edited right now.");
  }

  const storedConcept = storedOption.concepts.find(
    (concept) => normalizeTitle(concept.name) === normalizeTitle(previousConceptName),
  );

  if (!storedConcept) {
    throw new Error("Only custom lessons can be edited right now.");
  }

  const duplicate = storedOption.concepts.some(
    (concept) =>
      normalizeTitle(concept.name) === normalizeTitle(nextConceptName) &&
      normalizeTitle(concept.name) !== normalizeTitle(previousConceptName),
  );

  if (duplicate) {
    throw new Error("A lesson with that name already exists in this course.");
  }

  const nextConcept = createTutorialConcept(input);
  storedConcept.name = nextConcept.name;
  storedConcept.description = nextConcept.description;
  storedConcept.tabs = nextConcept.tabs;

  await writeStoredTutorials(stored);

  return storedConcept;
}

export async function deleteTutorial(
  headerTitleInput: string,
  optionTitleInput: string,
  conceptNameInput: string,
) {
  const headerTitle = headerTitleInput.trim();
  const optionTitle = optionTitleInput.trim();
  const conceptName = conceptNameInput.trim();

  if (!headerTitle || !optionTitle || !conceptName) {
    throw new Error("Section, lesson, and section title are required.");
  }

  const stored = await readStoredTutorials();
  const storedHeader = stored.headers.find(
    (header) => normalizeTitle(header.title) === normalizeTitle(headerTitle),
  );

  if (!storedHeader) {
    throw new Error("Only custom sections can be removed right now.");
  }

  const storedOption = storedHeader.options.find(
    (option) => normalizeTitle(option.title) === normalizeTitle(optionTitle),
  );

  if (!storedOption) {
    throw new Error("Only custom sections can be removed right now.");
  }

  const nextConcepts = storedOption.concepts.filter(
    (concept) => normalizeTitle(concept.name) !== normalizeTitle(conceptName),
  );

  if (nextConcepts.length === storedOption.concepts.length) {
    throw new Error("Only custom sections can be removed right now.");
  }

  storedOption.concepts = nextConcepts;
  await writeStoredTutorials(stored);
}
