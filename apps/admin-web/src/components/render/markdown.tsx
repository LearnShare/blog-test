import MD from '@packages/lib/md';

import '@/css/markdown.scss';

function MarkdownRender({
  content,
}: {
  content: string;
}) {
  return (
    <div
        className="markdown-content"
        dangerouslySetInnerHTML={ {
          __html: MD.render(content),
        } } />
  );
}

export default MarkdownRender;
