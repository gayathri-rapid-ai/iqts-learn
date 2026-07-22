import React, { useCallback, useState } from "react";
import { CodeContent } from "../../data";
import { Editor } from "@monaco-editor/react";
import { Language } from "../../../lib/runner";

function CodeEditor({
    content,
    languages,
    onChangeLang,
}: {
    content: CodeContent;
    languages: Language[];
    onChangeLang: (lang: Language) => void;
}) {
    const [output, setOutput] = useState("");
    const [running, setRunning] = useState(false);

    const execute = useCallback(async (language: Language, codeText: string) => {
        const res = await fetch("/api/execute", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ language, code: codeText }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Execution failed");
        return String(data.output || "");
    }, []);

    const onRun = useCallback(async () => {
        setRunning(true);
        setOutput("");
        try {
            setOutput(await execute(content.language, content.code));
        } catch (e: any) {
            setOutput(e?.message || String(e));
        } finally {
            setRunning(false);
        }
    }, [content, execute]);

    const handleBeforeMount = useCallback((monaco: Parameters<NonNullable<React.ComponentProps<typeof Editor>["beforeMount"]>>[0]) => {
        monaco.editor.defineTheme("iq-space-noir", {
            base: "vs-dark",
            inherit: true,
            rules: [
                { token: "comment", foreground: "8D8477", fontStyle: "italic" },
                { token: "keyword", foreground: "D4A574" },
                { token: "string", foreground: "E7C787" },
                { token: "number", foreground: "C7B18B" },
                { token: "identifier", foreground: "F4E9D8" },
            ],
            colors: {
                "editor.background": "#191512",
                "editor.foreground": "#F3E6D4",
                "editorLineNumber.foreground": "#8B7963",
                "editorLineNumber.activeForeground": "#F0D8B0",
                "editorCursor.foreground": "#D8A15D",
                "editor.selectionBackground": "#5A453233",
                "editor.inactiveSelectionBackground": "#4A382A22",
                "editor.lineHighlightBackground": "#241D1822",
                "editorIndentGuide.background1": "#3A2E26",
                "editorIndentGuide.activeBackground1": "#725944",
            },
        });
    }, []);

    return (
        <section className="code-panel">
            <div className="code-panel__controls">
                <strong className="code-panel__label">Sample</strong>
                <label htmlFor="language">Language</label>
                <select
                    className="code-select"
                    id="language"
                    value={content.language}
                    onChange={(e) => onChangeLang(e.target.value as Language)}
                >
                    {languages.map((language) => (
                        <option key={language} value={language}>
                            {language[0].toUpperCase() + language.slice(1)}
                        </option>
                    ))}
                </select>
                <button
                    className="run-button"
                    onClick={onRun}
                    disabled={running}
                >
                    {running ? "Running…" : "Run"}
                </button>
            </div>
            <Editor
                beforeMount={handleBeforeMount}
                height="420px"
                language={content.language}
                value={content.code}
                //onChange={(v) => setCode(v || "")}
                theme="iq-space-noir"
                options={{ fontSize: 14, minimap: { enabled: false } }}
            />
            <div className="code-output">
                <label
                    htmlFor="output"
                    className="code-output__label"
                >
                    Output
                </label>
                <pre
                    id="output"
                    className="code-output__pre"
                >
                    {output}
                </pre>
            </div>
        </section>
    );
}

export default CodeEditor;
