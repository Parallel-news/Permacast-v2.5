import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownInter {
  markdownText: any;
  color?: string;
  align?: string;
}

const MarkdownRenderer = (props: MarkdownInter) => {
  return <ReactMarkdown className={props.color+" "+props.align}>{props.markdownText}</ReactMarkdown>;
};

export default MarkdownRenderer;