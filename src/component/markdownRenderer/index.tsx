import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownInter {
  markdownText: any;
  color?: string;
  align?: string;
}

const MarkdownStyle = `select-text `;

const MarkdownRenderer = (props: MarkdownInter) => {
  return <ReactMarkdown className={MarkdownStyle + props.color+" "+props.align}>{props.markdownText}</ReactMarkdown>;
};

export default MarkdownRenderer;