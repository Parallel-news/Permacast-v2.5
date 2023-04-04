import { Dispatch, FC, SetStateAction, useState } from "react";
import { useTranslation } from "next-i18next";
import { useRecoilState } from "recoil";
import { currentThemeColorAtom } from "../atoms";
import { flexCol, flexItemsCenter } from "./creator";

interface DateSelectorInterface {
  duration: number,
  setDuration: Dispatch<SetStateAction<number>>;
}

const DateSelector: FC<DateSelectorInterface> = ({ duration, setDuration }) => {

  const { t } = useTranslation();
  const [currentThemeColor, setcurrentThemeColor] = useRecoilState(currentThemeColorAtom);

  return (
    <div className={flexItemsCenter + "w-96 justify-center"}>
      <input
        id="default-range"
        type="range"
        className="w-72 h-0.5 bg-black rounded-lg cursor-pointer dark:bg-gray-700 mx-2 grow"
        style={{ accentColor: currentThemeColor }}
        min="1"
        max="100"
        step="1"
        value={duration}
        onChange={(e) => {
          setDuration(parseInt(e.target.value));
        }}
      />
      <span className="mb-0.5 grow font-mono">{duration} {t("home.featured-modal.days")}</span>
    </div>
  );
};

export default DateSelector;