import mdit from 'markdown-it';
import hljs from 'highlight.js';

import 'highlight.js/styles/github.css';

const md = new mdit({
  html: true,
  highlight: (content: string, lang: string) => {
    if (lang
        && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(content, {
          language: lang,
        }).value;
      } catch (error) {
        console.log(error);
      }
    }

    return '';
  },
});

function render(content: string) {
  return md.render(content);
}

export default {
  render,
};
