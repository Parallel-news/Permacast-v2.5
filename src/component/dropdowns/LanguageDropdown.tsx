import { FC } from "react";
import LANGUAGES, { LanguageOptionInterface } from "../../utils/languages";
import { LanguageButton } from "../reusables/LanguageButton";
import { Icon } from "../icon";
import { Dropdown } from "../reusables";


const LanguageDropdown: FC = () => {
  const items = LANGUAGES.map((l: LanguageOptionInterface) => ({
    key: l.name, jsx: <LanguageButton {...{ className: `flexFill `, l }} />,
  }));

  const openMenuButton = <Icon className="h-5 w-5" icon="LANGUAGE" fill="currentColor" strokeWidth="0"/>;
  const openMenuButtonClass = `rounded-lg min-w-min bg-zinc-900 justify-start flexFill `;
  const menuItemClass = "border-0 p-[10px] hover:bg-zinc-800 hover:text-white"
  const dropdownMenuClass = `absolute z-50 right-0 mt-2 w-32 md:w-56 origin-top-right rounded-md bg-zinc-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border-[2px] border-zinc-400`
  return <Dropdown {...{ openMenuButton, items, openMenuButtonClass, dropdownMenuClass, menuItemClass }} />;
};

export default LanguageDropdown;