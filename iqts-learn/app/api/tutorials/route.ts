import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";
import {
  addCourse,
  addSection,
  addTutorial,
  deleteCourse,
  deleteTutorial,
  getAppData,
  updateCourse,
  updateSection,
  updateTutorial,
} from "../../../lib/tutorial-store";

export async function GET() {
  const data = await getAppData();

  return Response.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = String(body?.action ?? "create-lesson");
    let concept = null;

    if (action === "create-section") {
      await addSection(String(body?.headerTitle ?? ""));
    } else if (action === "update-section") {
      await updateSection(String(body?.previousHeaderTitle ?? ""), String(body?.headerTitle ?? ""));
    } else if (action === "create-course") {
      await addCourse(String(body?.headerTitle ?? ""), String(body?.optionTitle ?? ""));
    } else if (action === "update-course") {
      await updateCourse(
        String(body?.headerTitle ?? ""),
        String(body?.previousOptionTitle ?? ""),
        String(body?.optionTitle ?? ""),
      );
    } else if (action === "delete-course") {
      await deleteCourse(String(body?.headerTitle ?? ""), String(body?.optionTitle ?? ""));
    } else if (action === "update-lesson") {
      concept = await updateTutorial(
        String(body?.headerTitle ?? ""),
        String(body?.optionTitle ?? ""),
        String(body?.previousConceptName ?? ""),
        {
          headerTitle: String(body?.headerTitle ?? ""),
          optionTitle: String(body?.optionTitle ?? ""),
          conceptName: String(body?.conceptName ?? ""),
          conceptDescription: String(body?.conceptDescription ?? ""),
          storyContent: typeof body?.storyContent === "string" ? body.storyContent : "",
          codeContent: typeof body?.codeContent === "string" ? body.codeContent : "",
          codeSnippets: Array.isArray(body?.codeSnippets) ? body.codeSnippets : undefined,
          quizContent: typeof body?.quizContent === "string" ? body.quizContent : "",
        },
      );
    } else if (action === "delete-lesson") {
      await deleteTutorial(
        String(body?.headerTitle ?? ""),
        String(body?.optionTitle ?? ""),
        String(body?.conceptName ?? ""),
      );
    } else {
      concept = await addTutorial({
        headerTitle: String(body?.headerTitle ?? ""),
        optionTitle: String(body?.optionTitle ?? ""),
        conceptName: String(body?.conceptName ?? ""),
        conceptDescription: String(body?.conceptDescription ?? ""),
        storyContent: typeof body?.storyContent === "string" ? body.storyContent : "",
        codeContent: typeof body?.codeContent === "string" ? body.codeContent : "",
        codeSnippets: Array.isArray(body?.codeSnippets) ? body.codeSnippets : undefined,
        quizContent: typeof body?.quizContent === "string" ? body.quizContent : "",
      });
    }

    revalidatePath("/");
    revalidatePath("/concept/[menu]/[submenu]", "page");

    return Response.json({ ok: true, concept });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save tutorial.";

    return Response.json({ error: message }, { status: 400 });
  }
}
