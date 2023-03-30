import React from 'react';
import ReactMarkdown from 'react-markdown';

const MarkdownRenderer = ({ markdownText, color}) => {
  return <ReactMarkdown className={color}>{markdownText}</ReactMarkdown>;
};

export default MarkdownRenderer;