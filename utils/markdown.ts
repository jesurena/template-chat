/**
 * Normalizes markdown text to ensure consistent rendering across different LLM outputs.
 * - Fixes alternative pipe characters
 * - Ensures blank lines before tables
 * - Removes accidental gaps between table rows
 * @param text The raw markdown text
 * @returns Normalized markdown text
 */
export function normalizeMarkdown(text: string) {
    if (!text) return '';

    // Normalize pipe alternatives (common in some LLM outputs)
    let normalized = text.replace(/[｜│┃]/g, '|');

    // Ensure there's a blank line before the table start for GFM compatibility.
    // This finds a character at the end of a line followed by a newline and a pipe.
    normalized = normalized.replace(/([^\n])\n\|/g, '$1\n\n|');

    const lines = normalized.split('\n');
    const output: string[] = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // If this is an empty line between two lines that both contain a pipe,
        // it's likely part of a table that an LLM accidentally split.
        // We remove it to keep the table contiguous for the GFM parser.
        if (trimmed === '' && i > 0 && i < lines.length - 1) {
            const prev = lines[i - 1].trim();
            const next = lines[i + 1].trim();
            if (prev.includes('|') && next.includes('|')) {
                continue;
            }
        }

        output.push(line);
    }

    return output.join('\n');
}
