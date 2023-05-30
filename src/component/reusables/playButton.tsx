import { Icon } from "../icon";
import React, { FC } from "react";
import { dimColorString } from "../../utils/ui";
import { RGBorRGBAstring, RGBstring } from "../../interfaces/ui";

interface PlayButtonProps {
  size: number;
  iconSize: number; // the size of the play/pause icon
  buttonColor: RGBstring; // the color of the background
  accentColor: RGBorRGBAstring; // the color of the play/pause icon
  isPlaying?: boolean; // pass the player playback state here
  onClick?: () => void;
};

const playButtonStyling = `flex rounded-full justify-center items-center shrink-0 default-animation hover:scale-[1.1] outline-none focus:ring-2 focus:ring-white`;

const PlayButton: FC<PlayButtonProps> = ({ size, iconSize, buttonColor, accentColor, isPlaying, onClick }) => {
  if (size && iconSize && buttonColor && accentColor) return (
    <button
      style={{ backgroundColor: dimColorString(buttonColor, 0.2), width: size, height: size }}
      className={playButtonStyling}
      onClick={onClick}
    >
      {isPlaying ? (
        <Icon className="h-7 w-7" style={{ width: iconSize, height: iconSize, color: accentColor }} icon="PAUSE" strokeWidth="1" fill={accentColor}/>
      ) : (
        <Icon style={{ width: iconSize, height: iconSize, color: accentColor }} icon="PLAY" strokeWidth="1" fill={accentColor}/>
      )}
    </button>
  );
};

export default PlayButton;

  