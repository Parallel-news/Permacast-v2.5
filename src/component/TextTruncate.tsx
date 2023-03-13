import React, { useState } from "react";


interface TextTruncateProps {
    text: string;
    limit: number;
    textClass: string;
    buttonClass: string;
}

const TextTruncate: React.FC<TextTruncateProps> = ({ text, limit, textClass, buttonClass }) => {
  const [showFullText, setShowFullText] = useState(false);
  const truncatedText = showFullText ? text : `${text.slice(0, limit)}...`;

  const toggleShowFullText = () => {
    setShowFullText(!showFullText);
  };

  return (
    <div>
      <p className={textClass}>{truncatedText}</p>
      {text.length > limit && (
        <button onClick={toggleShowFullText} className={buttonClass}>
          {showFullText ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};

export default TextTruncate;