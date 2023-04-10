import { FC, ReactNode } from "react";
import { useRecoilState } from "recoil";
import { currentThemeColorAtom } from "../../atoms";
import { dimColorString } from "../../utils/ui";


interface ThemedButtonInterface {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
};

export const hoverableLinkButtonStyling = `px-3 py-2 rounded-full text-sm ml-5 cursor-pointer hover:brightness-[3] default-animation outline-inherit `;
export const themedButtonIconStyling = `text-inherit w-4 h-4 `;

const ThemedButton: FC<ThemedButtonInterface> = ({ children, onClick, disabled, className }) => {
  const [currentThemeColor] = useRecoilState(currentThemeColorAtom);
  
  return (
    <button
      {...{disabled, onClick, className}}
      className={hoverableLinkButtonStyling}
      style={{
        backgroundColor: dimColorString(currentThemeColor, 0.1),
        color: currentThemeColor,
      }}
    >
      {children}
    </button>
  );
};

export default ThemedButton;