import React, { useState } from "react";
import { FADE_IN_STYLE } from "../constants";


interface TextTruncateProps {
    text: string;
    limit: number;
    textClass: string;
    buttonClass: string;
}

const TextTruncate: React.FC<TextTruncateProps> = ({ text, limit, textClass, buttonClass }) => {
  const [showFullText, setShowFullText] = useState(false);
  const truncatedText = showFullText ? text : `${text.slice(0, limit)}...`;
  const [isVisible, setIsVisible] = useState<boolean>(true)

  const toggleShowFullText = () => {
    setIsVisible(false)
    const timeout = setTimeout(() => {
      setIsVisible(true)
      setShowFullText(!showFullText);
    }, 200);
  };

  return (
    <div>
      <p className={textClass+" "+(FADE_IN_STYLE)+" "+(isVisible && "opacity-100")}>{truncatedText}</p>
      {text.length > limit && (
        <button onClick={toggleShowFullText} className={buttonClass}>
          {showFullText ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};

export default TextTruncate;