import React, { useState } from "react";
import { FADE_IN_STYLE } from "../constants";
import { useTranslation } from "next-i18next";

interface TextTruncateProps {
    text: string;
    limit: number;
    textClass: string;
    buttonClass: string;
}

const TextTruncate: React.FC<TextTruncateProps> = ({ text, limit, textClass, buttonClass }) => {
  const [showFullText, setShowFullText] = useState(false);
  const truncatedText = showFullText ? text : `${text.slice(0, limit)}${text.length < limit ? "" : "..."}`;
  const [isVisible, setIsVisible] = useState<boolean>(true)

  const { t } = useTranslation()

    const toggleShowFullText = () => {
    setIsVisible(false)
    const timeout = setTimeout(() => {
      setIsVisible(true)
      setShowFullText(!showFullText);
    }, 200);
  };

  return (
    <div>
      <p className={textClass+ " " +(isVisible ? "opacity-100" : (FADE_IN_STYLE))}>{truncatedText}</p>
      {text.length > limit && (
        <button onClick={toggleShowFullText} className={buttonClass}>
          {showFullText ? <p>{t("navbar.home")}</p> : <p>{t("navbar.home")}</p>}
        </button>
      )}
    </div>
  );
};

export default TextTruncate;