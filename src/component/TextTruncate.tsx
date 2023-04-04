import React, { useEffect, useState } from "react";
import { FADE_IN_STYLE } from "../constants";
import { useTranslation } from "next-i18next";
import MarkdownRenderer from "./markdownRenderer";
interface TextTruncateProps {
    text: string;
    limit: number;
    textClass: string;
    buttonClass: string;
    isMarkDown?: boolean;
}

const TextTruncate: React.FC<TextTruncateProps> = ({ text, limit, textClass, buttonClass, isMarkDown }) => {
  const [showFullText, setShowFullText] = useState(false);
  const [markdownText, setMarkdownText] = useState('');
  const truncatedText = showFullText ? text : `${text.slice(0, limit)}${text.length < limit ? "" : "..."}`;
  const truncatedMarkdown = showFullText ? markdownText : `${markdownText.slice(0, limit)}${markdownText.length < limit ? "" : "..."}`;
  const [isVisible, setIsVisible] = useState<boolean>(true)

  const { t } = useTranslation()

    const toggleShowFullText = () => {
    setIsVisible(false)
    const timeout = setTimeout(() => {
      setIsVisible(true)
      setShowFullText(!showFullText);
    }, 200); // react makes current text disappear, pause, then fade in
  };

  

  useEffect(() => {
    const fetchMarkdown = async () => {
      const url = text;
      const response = await fetch(url);
      console.log("response: ", response.body)
      const txt = await response.text();
      setMarkdownText(txt);
    };

    if(isMarkDown) fetchMarkdown();
  }, []);

  return (
    <div>
      {isMarkDown ?
        <MarkdownRenderer markdownText={truncatedMarkdown} />
      :
        <p className={textClass+ " " +(isVisible ? "opacity-100" : (FADE_IN_STYLE))}>{truncatedText}</p>
      }
      {markdownText.length > limit && (
        <button onClick={toggleShowFullText} className={buttonClass}>
          {showFullText ? <p>Show Less</p> : <p>Show More</p>}
        </button>
      )}
    </div>
  );
};

export default TextTruncate;



