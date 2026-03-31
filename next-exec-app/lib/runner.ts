import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { exec as execCb } from 'node:child_process';
import { promisify } from 'node:util';

const exec = promisify(execCb);

export type Language = 'javascript' | 'python' | 'java' | 'go';

export async function runCode(language: Language, code: string): Promise<{ output: string }>{
  const dir = await mkdtemp(join(tmpdir(), 'next-exec-'));
  try {
    switch (language) {
      case 'javascript':
        return await runNode(dir, code);
      case 'python':
        return await runPython(dir, code);
      case 'java':
        return await runJava(dir, code);
      case 'go':
        return await runGo(dir, code);
      default:
        throw new Error(`Unsupported language: ${language}`);
    }
  } finally {
    // cleanup directory recursively
    await rm(dir, { recursive: true, force: true });
  }
}

const TIMEOUT = 8000; // ms

async function runNode(dir: string, code: string) {
  const file = join(dir, 'temp.js');
  await writeFile(file, code, 'utf8');
  return runCommand(`node ${escapePath(file)}`);
}

async function runPython(dir: string, code: string) {
  const file = join(dir, 'temp.py');
  await writeFile(file, code, 'utf8');
  return runCommand(`python3 ${escapePath(file)}`);
}

async function runJava(dir: string, code: string) {
  const className = 'Temp';
  const file = join(dir, `${className}.java`);
  await writeFile(file, code, 'utf8');
  // compile
  await runCommand(`javac ${escapePath(file)}`);
  // run class from the temp dir
  return runCommand(`java -cp ${escapePath(dir)} ${className}`);
}

async function runGo(dir: string, code: string) {
  const file = join(dir, 'temp.go');
  await writeFile(file, code, 'utf8');
  return runCommand(`go run ${escapePath(file)}`);
}

function escapePath(p: string) {
  return `'${p.replaceAll(`'`, `"`)}'`;
}

async function runCommand(command: string): Promise<{ output: string }>{
  try {
    const { stdout, stderr } = await exec(command, { timeout: TIMEOUT });
    const out = `${stdout || ''}${stderr || ''}`.trimEnd();
    return { output: out };
  } catch (e: any) {
    // child_process exec throws on non-zero exit codes or timeouts
    if (e.killed || /ETIMEDOUT/.test(String(e.code))) {
      return { output: 'Error: execution timed out' };
    }
    const stdout = e?.stdout ?? '';
    const stderr = e?.stderr ?? '';
    const out = `${stdout}${stderr || e?.message || String(e)}`.trimEnd();
    return { output: out };
  }
}
