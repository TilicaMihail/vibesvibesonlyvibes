import type { ContentNode, ContentTreeNode, ResourceType } from '@/types';

export function buildTree(nodes: ContentNode[]): ContentTreeNode[] {
  const map = new Map<string, ContentTreeNode>();
  nodes.forEach(n => map.set(n.id, { ...n, children: [] }));
  const roots: ContentTreeNode[] = [];
  nodes.forEach(n => {
    const node = map.get(n.id)!;
    if (n.parentId && map.has(n.parentId)) {
      map.get(n.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  });
  roots.sort((a, b) => a.order - b.order);
  roots.forEach(r => r.children.sort((a, b) => a.order - b.order));
  return roots;
}

export function flattenTree(tree: ContentTreeNode[]): ContentNode[] {
  const result: ContentNode[] = [];
  tree.forEach((chapter, ci) => {
    const { children, ...chapterNode } = chapter;
    result.push({ ...chapterNode, order: ci, parentId: null });
    children.forEach((child, li) => {
      const { children: _c, ...childNode } = child;
      result.push({ ...childNode, order: li, parentId: chapter.id });
    });
  });
  return result;
}

export function getTypeIcon(type: ResourceType): string {
  const icons: Record<ResourceType, string> = {
    chapter: '📁',
    text: '📄',
    video: '🎬',
    file: '📎',
    test: '📝',
  };
  return icons[type] ?? '📄';
}
