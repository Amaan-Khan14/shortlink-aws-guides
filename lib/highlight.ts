import { createHighlighter, type Highlighter } from "shiki";

const LANGS = ["bash", "json", "yaml", "dotenv", "ini", "diff", "powershell", "javascript", "sql", "text"];
const ALIASES: Record<string, string> = {
  sh: "bash",
  shell: "bash",
  zsh: "bash",
  console: "bash",
  env: "dotenv",
  js: "javascript",
  yml: "yaml",
  plaintext: "text",
  txt: "text",
  output: "text",
};

let instance: Promise<Highlighter> | undefined;

function getHighlighter() {
  instance ??= createHighlighter({ themes: ["github-light", "github-dark"], langs: LANGS });
  return instance;
}

/** Highlight with both themes at once; CSS picks one via the `.dark` class. */
export async function highlight(code: string, lang: string): Promise<string> {
  const resolved = ALIASES[lang] ?? lang;
  const safe = LANGS.includes(resolved) ? resolved : "text";
  const h = await getHighlighter();
  return h.codeToHtml(code, {
    lang: safe,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  });
}
