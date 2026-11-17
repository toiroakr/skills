import { parse as parseYaml } from 'yaml';

/**
 * Minimal frontmatter parser. Only supports YAML (the `---` delimiter).
 * Does NOT support `---js` / `---javascript` to avoid eval()-based RCE
 * that exists in gray-matter's built-in JS engine.
 */
export function parseFrontmatter(raw: string): {
  data: Record<string, unknown> & { metadata?: Record<string, unknown> };
  content: string;
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };
  const parsed: unknown = parseYaml(match[1]!);
  const data =
    parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  const { metadata, ...fields } = data;
  return {
    data: {
      ...fields,
      ...(metadata !== null && typeof metadata === 'object' && !Array.isArray(metadata)
        ? { metadata: metadata as Record<string, unknown> }
        : {}),
    },
    content: match[2] ?? '',
  };
}
