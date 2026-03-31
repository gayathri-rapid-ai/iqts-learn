"use client";

import Editor from '@monaco-editor/react';
import { useCallback, useEffect, useMemo, useState } from 'react';

type Language = 'javascript' | 'python' | 'java' | 'go';

type Exercise = {
  question: string;
  answer: string;
};

type Concept = {
  id: string;
  title: string;
  category: 'Basics' | 'Control Flow' | 'Algorithms';
  description?: string; // short description for sidebar
  content: string; // detailed concept content (can be non-coding info too)
  snippets: Record<Language, string>;
  exercises: Exercise[];
};

const concepts: Concept[] = [
  {
    id: 'hello',
    title: 'Hello World',
    category: 'Basics',
    description: 'Basic printing to stdout.',
    content: `The classic first program prints a greeting to the standard output.\n\nKey ideas:\n- Program entry point (main) for compiled languages\n- Printing APIs (console.log, System.out.println, fmt.Println, print)`,
    snippets: {
      javascript: "console.log('Hello, World!')\n",
      python: "print('Hello, World!')\n",
      java: `public class Temp {\n  public static void main(String[] args) {\n    System.out.println(\"Hello, World!\");\n  }\n}\n`,
      go: `package main\nimport \"fmt\"\nfunc main() {\n  fmt.Println(\"Hello, World!\")\n}\n`
    },
    exercises: [
      { question: 'Change the message to print your name.', answer: 'Update the string literal, e.g., console.log("Hello, Alice!")' },
      { question: 'Print the message twice using a loop.', answer: 'Use a for loop running twice and print in each iteration.' },
    ]
  },
  {
    id: 'variables',
    title: 'Variables',
    category: 'Basics',
    description: 'Declare and print variables.',
    content: `Variables store data values. Types and declaration syntax differ across languages.\n\nKey ideas:\n- Declaration vs initialization\n- Mutability and scope\n- Primitive vs reference types`,
    snippets: {
      javascript: `const x = 42;\nconsole.log('x =', x)\n`,
      python: `x = 42\nprint('x =', x)\n`,
      java: `public class Temp {\n  public static void main(String[] args) {\n    int x = 42;\n    System.out.println(\"x = \" + x);\n  }\n}\n`,
      go: `package main\nimport \"fmt\"\nfunc main(){\n  x := 42\n  fmt.Println(\"x =\", x)\n}\n`
    },
    exercises: [
      { question: 'Declare a second variable y = 10 and print x + y.', answer: 'Compute and print x + y using your language syntax.' },
      { question: 'Change x to a string and print its length.', answer: 'Reassign x to a string (or declare new) and use length/len().' }
    ]
  },
  {
    id: 'loop',
    title: 'Loop 1..5',
    category: 'Control Flow',
    description: 'Simple loop that prints numbers 1 through 5.',
    content: `Loops repeat code. Common forms: for, while, range-based loops.\n\nKey ideas:\n- Loop counters and bounds\n- Off-by-one errors\n- Break/continue`,
    snippets: {
      javascript: `for (let i = 1; i <= 5; i++) {\n  console.log(i);\n}\n`,
      python: `for i in range(1, 6):\n    print(i)\n`,
      java: `public class Temp {\n  public static void main(String[] args) {\n    for (int i = 1; i <= 5; i++) {\n      System.out.println(i);\n    }\n  }\n}\n`,
      go: `package main\nimport \"fmt\"\nfunc main() {\n  for i := 1; i <= 5; i++ {\n    fmt.Println(i)\n  }\n}\n`
    },
    exercises: [
      { question: 'Print only even numbers between 1 and 10.', answer: 'Use a condition (i % 2 == 0) to filter even numbers.' },
      { question: 'Sum numbers from 1 to 100.', answer: 'Accumulate into a variable inside the loop and print the sum.' }
    ]
  },
  {
    id: 'fizzbuzz',
    title: 'FizzBuzz',
    category: 'Algorithms',
    description: 'Classic FizzBuzz from 1..20.',
    content: `FizzBuzz prints Fizz for multiples of 3, Buzz for multiples of 5, and FizzBuzz for both.\n\nKey ideas:\n- Modulo arithmetic\n- Branching order\n- String composition`,
    snippets: {
      javascript: `for (let i = 1; i <= 20; i++) {\n  let s = '';\n  if (i % 3 === 0) s += 'Fizz';\n  if (i % 5 === 0) s += 'Buzz';\n  console.log(s || i);\n}\n`,
      python: `for i in range(1, 21):\n    s = ''\n    if i % 3 == 0: s += 'Fizz'\n    if i % 5 == 0: s += 'Buzz'\n    print(s or i)\n`,
      java: `public class Temp {\n  public static void main(String[] args) {\n    for (int i = 1; i <= 20; i++) {\n      String s = \"\";\n      if (i % 3 == 0) s += \"Fizz\";\n      if (i % 5 == 0) s += \"Buzz\";\n      System.out.println(s.isEmpty() ? i : s);\n    }\n  }\n}\n`,
      go: `package main\nimport \"fmt\"\nfunc main() {\n  for i := 1; i <= 20; i++ {\n    s := \"\"\n    if i%3 == 0 { s += \"Fizz\" }\n    if i%5 == 0 { s += \"Buzz\" }\n    if s == \"\" { fmt.Println(i) } else { fmt.Println(s) }\n  }\n}\n`
    },
    exercises: [
      { question: 'Extend FizzBuzz to 1..100.', answer: 'Change loop bounds to 100; logic stays the same.' },
      { question: 'Print Fizz when divisible by 7 instead of 3.', answer: 'Replace modulo 3 checks with modulo 7.' }
    ]
  },
  {
    id: 'factorial',
    title: 'Factorial (5)',
    category: 'Algorithms',
    description: 'Compute factorial of 5 using a function.',
    content: `Factorial n! multiplies consecutive integers from 1..n.\n\nKey ideas:\n- Recursion vs iteration\n- Base case handling\n- Risk of overflow`,
    snippets: {
      javascript: `function fact(n){ return n<=1?1:n*fact(n-1) }\nconsole.log(fact(5))\n`,
      python: `def fact(n):\n    return 1 if n<=1 else n*fact(n-1)\nprint(fact(5))\n`,
      java: `public class Temp {\n  static long fact(int n){ return n<=1?1:n*fact(n-1); }\n  public static void main(String[] args){ System.out.println(fact(5)); }\n}\n`,
      go: `package main\nimport \"fmt\"\nfunc fact(n int) int { if n<=1 { return 1 }; return n*fact(n-1) }\nfunc main(){ fmt.Println(fact(5)) }\n`
    },
    exercises: [
      { question: 'Implement factorial iteratively.', answer: 'Use a loop multiplying from 1 to n instead of recursion.' },
      { question: 'Handle negative inputs gracefully.', answer: 'Validate n >= 0 and return an error or a message if invalid.' }
    ]
  }
];

const defaultSamples: Record<Language, string> = {
  javascript: "console.log('Hello from JavaScript')\n",
  python: "print('Hello from Python')\n",
  java: `public class Temp {\n  public static void main(String[] args) {\n    System.out.println(\"Hello from Java\");\n  }\n}\n`,
  go: `package main\nimport \"fmt\"\nfunc main() {\n  fmt.Println(\"Hello from Go\")\n}\n`
};

export default function HomePage() {
  // Tabs for the selected concept
  const [tab, setTab] = useState<'Concept' | 'Sample' | 'Exercise'>('Concept');

  // Category selection (controlled by header menu; no local selector)
  const [category, setCategory] = useState<'All' | 'Basics' | 'Control Flow' | 'Algorithms'>('All');

  // Selected concept
  const [selectedConceptId, setSelectedConceptId] = useState<string>('hello');
  const visibleConcepts = useMemo(
    () => concepts.filter(c => category === 'All' || c.category === category),
    [category]
  );
  const selectedConcept = useMemo(
    () => concepts.find(c => c.id === selectedConceptId),
    [selectedConceptId]
  );

  // Keep selected concept valid when category changes
  useEffect(() => {
    if (!visibleConcepts.some(c => c.id === selectedConceptId)) {
      const fallback = visibleConcepts[0]?.id ?? concepts[0].id;
      setSelectedConceptId(fallback);
    }
  }, [category, selectedConceptId, visibleConcepts]);

  // Listen for header menu selections via data attributes/custom events
  useEffect(() => {
    const handler = (e: Event) => {
      try {
        const ce = e as CustomEvent<string>;
        if (ce?.detail === 'Basics' || ce?.detail === 'Control Flow' || ce?.detail === 'Algorithms' || ce?.detail === 'All') {
          setCategory(ce.detail as any);
        }
      } catch {}
    };
    window.addEventListener('iq:setCategory', handler as EventListener);

    const clickCapture = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      // Category via data attr
      const el = target.closest('[data-iq-category]') as HTMLElement | null;
      const cat = el?.getAttribute('data-iq-category');
      if (cat === 'Basics' || cat === 'Control Flow' || cat === 'Algorithms' || cat === 'All') {
        setCategory(cat as any);
        return;
      }
      // Sorting via data attr -> map to Algorithms
      const elSort = target.closest('[data-iq-sorting]') as HTMLElement | null;
      const sort = elSort?.getAttribute('data-iq-sorting');
      if (sort === 'Basic Sorting' || sort === 'Advanced Sorting') {
        setCategory('Algorithms');
        return;
      }
      // Fallbacks
      const text = target.textContent?.trim();
      if (text === 'Basic Programming') setCategory('Basics');
      if (text === 'Basic Sorting' || text === 'Advanced Sorting') setCategory('Algorithms');
    };
    document.addEventListener('click', clickCapture, true);

    return () => {
      window.removeEventListener('iq:setCategory', handler as EventListener);
      document.removeEventListener('click', clickCapture, true);
    };
  }, []);

  // Sample tab mode
  const [sampleMode, setSampleMode] = useState<'single' | 'compare'>('single');

  // Single editor state and run
  const [lang, setLang] = useState<Language>('javascript');
  const [code, setCode] = useState<string>((concepts.find(c => c.id === 'hello')?.snippets.javascript) ?? defaultSamples.javascript);
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);

  // Compare editors state
  const [langA, setLangA] = useState<Language>('javascript');
  const [codeA, setCodeA] = useState<string>((concepts.find(c => c.id === 'hello')?.snippets.javascript) ?? defaultSamples.javascript);
  const [outputA, setOutputA] = useState('');
  const [runningA, setRunningA] = useState(false);

  const [langB, setLangB] = useState<Language>('python');
  const [codeB, setCodeB] = useState<string>((concepts.find(c => c.id === 'hello')?.snippets.python) ?? defaultSamples.python);
  const [outputB, setOutputB] = useState('');
  const [runningB, setRunningB] = useState(false);

  const applyConcept = useCallback((concept: Concept) => {
    setSelectedConceptId(concept.id);
    setTab('Concept');
    // update code pane(s) with current language(s)
    setCode(concept.snippets[lang] ?? defaultSamples[lang]);
    setCodeA(concept.snippets[langA] ?? defaultSamples[langA]);
    setCodeB(concept.snippets[langB] ?? defaultSamples[langB]);
  }, [lang, langA, langB]);

  useEffect(() => {
    // when language changes, update code for current concept (single)
    const c = concepts.find(c => c.id === selectedConceptId);
    if (c) setCode(c.snippets[lang] ?? defaultSamples[lang]);
  }, [lang, selectedConceptId]);

  useEffect(() => {
    // when compare languages change, update code for current concept
    const c = concepts.find(c => c.id === selectedConceptId);
    if (c) {
      setCodeA(c.snippets[langA] ?? defaultSamples[langA]);
      setCodeB(c.snippets[langB] ?? defaultSamples[langB]);
    }
  }, [langA, langB, selectedConceptId]);

  const execute = useCallback(async (language: Language, codeText: string) => {
    const res = await fetch('/api/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language, code: codeText })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Execution failed');
    return String(data.output || '');
  }, []);

  const onRun = useCallback(async () => {
    setRunning(true); setOutput('');
    try { setOutput(await execute(lang, code)); } catch (e: any) { setOutput(e?.message || String(e)); } finally { setRunning(false); }
  }, [code, execute, lang]);

  const onRunA = useCallback(async () => {
    setRunningA(true); setOutputA('');
    try { setOutputA(await execute(langA, codeA)); } catch (e: any) { setOutputA(e?.message || String(e)); } finally { setRunningA(false); }
  }, [codeA, execute, langA]);

  const onRunB = useCallback(async () => {
    setRunningB(true); setOutputB('');
    try { setOutputB(await execute(langB, codeB)); } catch (e: any) { setOutputB(e?.message || String(e)); } finally { setRunningB(false); }
  }, [codeB, execute, langB]);

  const runBoth = useCallback(async () => {
    setRunningA(true); setRunningB(true);
    setOutputA(''); setOutputB('');
    try {
      const [out1, out2] = await Promise.all([
        execute(langA, codeA).catch((e: any) => e?.message || String(e)),
        execute(langB, codeB).catch((e: any) => e?.message || String(e)),
      ]);
      setOutputA(out1); setOutputB(out2);
    } finally {
      setRunningA(false); setRunningB(false);
    }
  }, [codeA, codeB, execute, langA, langB]);

  // Layout styles (kept simple; Tailwind is applied in layout for global areas)
  const shell: React.CSSProperties = { display: 'flex', gap: 12, alignItems: 'stretch' };
  const sidebar: React.CSSProperties = { width: 300, flex: '0 0 300px', border: '1px solid #d0d0d5', borderRadius: 6, background: '#fff', overflow: 'hidden' };
  const sidebarHeader: React.CSSProperties = { padding: 12, fontWeight: 700, borderBottom: '1px solid #e5e7ea', background: '#f6f7f9' };
  const sidebarList: React.CSSProperties = { listStyle: 'none', margin: 0, padding: 8, maxHeight: 700, overflow: 'auto' };
  const sidebarItem = (active: boolean): React.CSSProperties => ({ margin: 0, padding: 0 });
  const sidebarBtn = (active: boolean): React.CSSProperties => ({
    display: 'block', width: '100%', textAlign: 'left', border: '1px solid ' + (active ? '#5b9bff' : '#e1e4ea'),
    background: active ? '#eaf2ff' : '#fff', color: '#111', borderRadius: 6, padding: 10, marginBottom: 8, cursor: 'pointer'
  });

  const panelStyle: React.CSSProperties = {
    flex: '1 1 520px',
    minWidth: 0,
    border: '1px solid #d0d0d5',
    borderRadius: 6,
    overflow: 'hidden',
    background: '#11151b'
  };
  const controlsRow: React.CSSProperties = { display: 'flex', gap: 8, alignItems: 'center', padding: 10, background: '#fff', color: '#111', borderBottom: '1px solid #d0d0d5' };

  const tabsRow: React.CSSProperties = { display: 'flex', gap: 8, alignItems: 'center', padding: 8, background: '#fff', border: '1px solid #d0d0d5', borderRadius: 6 };
  const tabBtn = (active: boolean): React.CSSProperties => ({ padding: '6px 10px', borderRadius: 6, border: '1px solid ' + (active ? '#4378ff' : '#e3e5ea'), background: active ? '#eaf2ff' : '#fff', cursor: 'pointer' });

  const modePill = (active: boolean): React.CSSProperties => ({ padding: '4px 8px', borderRadius: 6, border: '1px solid ' + (active ? '#4378ff' : '#e3e5ea'), background: active ? '#eaf2ff' : '#fff', cursor: 'pointer' });

  return (
    <div>
      <div style={shell}>
        {/* Left sidebar with concepts (filtered by category from header) */}
        <aside style={sidebar}>
          <div style={sidebarHeader}>Concepts {category !== 'All' ? `– ${category}` : ''}</div>
          <ul style={sidebarList}>
            {visibleConcepts.map(c => {
              const active = c.id === selectedConceptId;
              return (
                <li key={c.id} style={sidebarItem(active)}>
                  <button type="button" style={sidebarBtn(active)} onClick={() => applyConcept(c)}>
                    <div style={{ fontWeight: 600 }}>{c.title}</div>
                    <div style={{ fontSize: 12, color: '#4b5563', marginTop: 2 }}>{c.category}{c.description ? ' • ' : ''}{c.description ?? ''}</div>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Right content area */}
        <section style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Tabs */}
          <div style={tabsRow}>
            <button style={tabBtn(tab === 'Concept')} onClick={() => setTab('Concept')}>Concept</button>
            <button style={tabBtn(tab === 'Sample')} onClick={() => setTab('Sample')}>Sample</button>
            <button style={tabBtn(tab === 'Exercise')} onClick={() => setTab('Exercise')}>Exercise</button>
          </div>

          {tab === 'Concept' && (
            <section style={{ background: '#fff', border: '1px solid #d0d0d5', borderRadius: 6, padding: 16, lineHeight: 1.55 }}>
              <h2 style={{ marginTop: 0 }}>{selectedConcept?.title}</h2>
              <p style={{ color: '#4b5563' }}>{selectedConcept?.category}{selectedConcept?.description ? ' • ' : ''}{selectedConcept?.description}</p>
              {(selectedConcept?.content || '').split('\n').map((para, idx) => (
                <p key={idx} style={{ margin: '8px 0' }}>{para}</p>
              ))}
            </section>
          )}

          {tab === 'Sample' && (
            <>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end' }}>
                <span>Mode</span>
                <button style={modePill(sampleMode === 'single')} onClick={() => setSampleMode('single')}>Single</button>
                <button style={modePill(sampleMode === 'compare')} onClick={() => setSampleMode('compare')}>Compare</button>
              </div>

              {sampleMode === 'single' ? (
                <section style={{ ...panelStyle, flex: '1 1 100%' }}>
                  <div style={controlsRow}>
                    <strong style={{ marginRight: 8 }}>Sample</strong>
                    <label htmlFor="language">Language</label>
                    <select id="language" value={lang} onChange={e => { const v = e.target.value as Language; setLang(v); }}>
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                      <option value="go">Go</option>
                    </select>
                    <button onClick={onRun} disabled={running} style={{ marginLeft: 'auto' }}>{running ? 'Running…' : 'Run'}</button>
                  </div>
                  <Editor
                    height="420px"
                    language={lang}
                    value={code}
                    onChange={(v) => setCode(v || '')}
                    theme="vs-dark"
                    options={{ fontSize: 14, minimap: { enabled: false } }}
                  />
                  <div style={{ padding: 10, borderTop: '1px solid #2a2f36' }}>
                    <label htmlFor="output" style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#dfe7ef' }}>Output</label>
                    <pre id="output" style={{ minHeight: 160, margin: 0, padding: 10, background: '#0d0f14', color: '#e7edf5', whiteSpace: 'pre-wrap', borderRadius: 6 }}>{output}</pre>
                  </div>
                </section>
              ) : (
                <div style={{ display: 'flex', gap: 12, alignItems: 'stretch', flexWrap: 'wrap' }}>
                  {/* Panel A */}
                  <section style={panelStyle}>
                    <div style={controlsRow}>
                      <strong style={{ marginRight: 8 }}>A</strong>
                      <label htmlFor="languageA">Language</label>
                      <select id="languageA" value={langA} onChange={e => { const v = e.target.value as Language; setLangA(v); }}>
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="go">Go</option>
                      </select>
                      <button onClick={onRunA} disabled={runningA} style={{ marginLeft: 'auto' }}>{runningA ? 'Running…' : 'Run'}</button>
                    </div>
                    <Editor
                      height="360px"
                      language={langA}
                      value={codeA}
                      onChange={(v) => setCodeA(v || '')}
                      theme="vs-dark"
                      options={{ fontSize: 14, minimap: { enabled: false } }}
                    />
                    <div style={{ padding: 10, borderTop: '1px solid #2a2f36' }}>
                      <label htmlFor="outputA" style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#dfe7ef' }}>Output A</label>
                      <pre id="outputA" style={{ minHeight: 140, margin: 0, padding: 10, background: '#0d0f14', color: '#e7edf5', whiteSpace: 'pre-wrap', borderRadius: 6 }}>{outputA}</pre>
                    </div>
                  </section>

                  {/* Panel B */}
                  <section style={panelStyle}>
                    <div style={controlsRow}>
                      <strong style={{ marginRight: 8 }}>B</strong>
                      <label htmlFor="languageB">Language</label>
                      <select id="languageB" value={langB} onChange={e => { const v = e.target.value as Language; setLangB(v); }}>
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="go">Go</option>
                      </select>
                      <button onClick={onRunB} disabled={runningB} style={{ marginLeft: 'auto' }}>{runningB ? 'Running…' : 'Run'}</button>
                    </div>
                    <Editor
                      height="360px"
                      language={langB}
                      value={codeB}
                      onChange={(v) => setCodeB(v || '')}
                      theme="vs-dark"
                      options={{ fontSize: 14, minimap: { enabled: false } }}
                    />
                    <div style={{ padding: 10, borderTop: '1px solid #2a2f36' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <label htmlFor="outputB" style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#dfe7ef' }}>Output B</label>
                        <button onClick={runBoth} disabled={runningA || runningB} style={{ padding: '6px 10px' }}>{(runningA || runningB) ? 'Running…' : 'Run Both'}</button>
                      </div>
                      <pre id="outputB" style={{ minHeight: 140, margin: 0, padding: 10, background: '#0d0f14', color: '#e7edf5', whiteSpace: 'pre-wrap', borderRadius: 6 }}>{outputB}</pre>
                    </div>
                  </section>
                </div>
              )}
            </>
          )}

          {tab === 'Exercise' && (
            <section style={{ background: '#fff', border: '1px solid #d0d0d5', borderRadius: 6, padding: 16 }}>
              <h2 style={{ marginTop: 0 }}>Exercises: {selectedConcept?.title}</h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
                {(selectedConcept?.exercises || []).map((ex, idx) => (
                  <li key={idx} style={{ border: '1px solid #e5e7ea', borderRadius: 6, padding: 12 }}>
                    <div style={{ fontWeight: 600, marginBottom: 6 }}>Q{idx + 1}. {ex.question}</div>
                    <details>
                      <summary style={{ cursor: 'pointer' }}>Show Answer</summary>
                      <div style={{ marginTop: 8, whiteSpace: 'pre-wrap' }}>{ex.answer}</div>
                    </details>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </section>
      </div>
    </div>
  );
}
