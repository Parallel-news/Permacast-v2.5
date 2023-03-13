import React, { useState } from "react";

const TextTruncate = ({ text, limit }) => {
  const [showFullText, setShowFullText] = useState(false);
  const truncatedText = showFullText ? text : `${text.slice(0, limit)}...`;

  const toggleShowFullText = () => {
    setShowFullText(!showFullText);
  };

  return (
    <div>
      <p>{truncatedText}</p>
      {text.length > limit && (
        <button onClick={toggleShowFullText}>
          {showFullText ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};

export default TextTruncate;