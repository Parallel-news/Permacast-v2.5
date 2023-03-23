import React from 'react';
import ReactMarkdown from 'react-markdown';

const MarkdownRenderer = ({ markdownText }) => {
  return <ReactMarkdown>{markdownText}</ReactMarkdown>;
};

export default MarkdownRenderer;