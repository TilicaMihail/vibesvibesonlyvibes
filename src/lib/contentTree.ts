export function getTypeIcon(type: string): string {
  const m: Record<string, string> = {
    chapter: '📁',
    text: '📄',
    video: '🎬',
    file: '📎',
    test: '📝',
    lesson: '📄',
  };
  return m[type] ?? '📄';
}
