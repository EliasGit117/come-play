export function capitalizeFirst<T extends string>(str: T): Capitalize<T> {
  if (!str)
    return str as Capitalize<T>;

  return (str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<T>;
}


/** Turns rich text html into a plain excerpt, used for meta descriptions */
export function htmlToExcerpt(html?: string | null, maxLength: number = 160): string | undefined {
  if (!html)
    return undefined;

  const text = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, '\'')
    .replace(/\s+/g, ' ')
    .trim();

  if (!text)
    return undefined;

  if (text.length <= maxLength)
    return text;

  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  return `${(lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated).trimEnd()}…`;
}


type TTransform = 'none' | 'uppercase' | 'lowercase' | 'capitalize';

export function pickFirstLetters(text: string, count: number = 1, transform: TTransform = 'uppercase'): string {
  const picked = text
    .trim()
    .split(/\s+/)
    .slice(0, Math.max(0, count))
    .map(word => word.charAt(0))
    .join('');

  switch (transform) {
    case 'uppercase':
      return picked.toUpperCase();

    case 'lowercase':
      return picked.toLowerCase();

    case 'capitalize':
      return picked.charAt(0).toUpperCase() + picked.slice(1).toLowerCase();

    case 'none':
    default:
      return picked;
  }
}
