import Markdown from 'react-markdown';
import type { Components } from 'react-markdown';

const components: Components = {
  h1: ({ children }) => <h1 className="text-2xl font-bold text-on-surface mt-6 mb-3 first:mt-0">{children}</h1>,
  h2: ({ children }) => <h2 className="text-xl font-bold text-on-surface mt-5 mb-2 first:mt-0">{children}</h2>,
  h3: ({ children }) => <h3 className="text-lg font-semibold text-on-surface mt-4 mb-2 first:mt-0">{children}</h3>,
  h4: ({ children }) => <h4 className="text-base font-semibold text-on-surface mt-3 mb-1 first:mt-0">{children}</h4>,
  p:  ({ children }) => <p className="text-sm text-on-surface leading-relaxed mb-3 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="list-disc list-outside pl-5 mb-3 space-y-1 text-sm text-on-surface">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal list-outside pl-5 mb-3 space-y-1 text-sm text-on-surface">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  a:  ({ href, children }) => <a href={href} className="text-brand hover:text-brand-dark underline underline-offset-2 transition-colors" target="_blank" rel="noopener noreferrer">{children}</a>,
  strong: ({ children }) => <strong className="font-semibold text-on-surface">{children}</strong>,
  em:     ({ children }) => <em className="italic text-on-surface-muted">{children}</em>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-brand/40 pl-4 my-3 text-on-surface-muted italic text-sm">
      {children}
    </blockquote>
  ),
  code: ({ children, className }) => {
    const isBlock = !!className; // fenced code blocks receive a language className
    if (isBlock) {
      return (
        <code className="block bg-surface-border/40 text-on-surface font-mono text-xs leading-relaxed p-4 rounded-lg overflow-x-auto whitespace-pre">
          {children}
        </code>
      );
    }
    return <code className="bg-surface-border/60 text-on-surface font-mono text-xs px-1.5 py-0.5 rounded">{children}</code>;
  },
  pre: ({ children }) => <pre className="my-3 rounded-lg overflow-hidden">{children}</pre>,
  hr:  () => <hr className="border-surface-border my-4" />,
};

export default function MarkdownContent({ children }: { children: string }) {
  return <Markdown components={components}>{children}</Markdown>;
}
