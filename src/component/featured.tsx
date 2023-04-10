import { useTranslation } from "next-i18next";
import React from "react";
import { useArconnect } from 'react-arconnect';

export function Greeting() {
  const { t } = useTranslation();
  const {
    ANS,
  } = useArconnect();
  
  return (
    <div>
      <h1 className="text-white text-2xl">
        {ANS?.currentLabel ? (
          <>{t("home.hi")} {ANS?.currentLabel + '.ar'}!</>
        ) : (
          <>{t("home.welcome")}</>
        )}
      </h1>
      <p className="text-zinc-400 mb-9">{t("home.subtext")}</p>
    </div>
  );
}
