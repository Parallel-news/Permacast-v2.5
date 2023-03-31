import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownInter {
  markdownText: any;
  color?: string;
}

const MarkdownRenderer = (props: MarkdownInter) => {
  return <ReactMarkdown className={props.color}>{props.markdownText}</ReactMarkdown>;
};

export default MarkdownRenderer;