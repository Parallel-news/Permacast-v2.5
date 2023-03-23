import React, { FC } from "react";

import { dimColorString } from "../../utils/ui";

import { PauseIcon } from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/24/solid";
import { RGBorRGBAstring, RGBstring } from "../../interfaces/ui";


interface PlayButtonProps {
  size: number;
  iconSize: number;
  buttonColor: RGBstring;
  accentColor: RGBorRGBAstring;
  isPlaying?: boolean;
  onClick?: () => void;
};

const playButtonStyling = `flex z-10 rounded-full justify-center items-center shrink-0 default-animation hover:scale-[1.1]`;

const PlayButton: FC<PlayButtonProps> = ({ size, iconSize, buttonColor, accentColor, isPlaying, onClick }) => {
  return (
    <button
      style={{ backgroundColor: dimColorString(buttonColor, 0.2), width: size, height: size }}
      className={playButtonStyling}
      onClick={onClick}
    >
      {isPlaying ? (
        <PauseIcon className="stroke-[3]" style={{ width: iconSize, height: iconSize, color: accentColor }} />
      ): (
        <PlayIcon className="stroke-[3]" style={{ width: iconSize, height: iconSize, color: accentColor }} />
      )}
    </button>
  );
};

export default PlayButton;