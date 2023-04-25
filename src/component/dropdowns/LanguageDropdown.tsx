import { FC } from "react";
import { LanguageIcon } from "@heroicons/react/24/solid";

import LANGUAGES, { LanguageOptionInterface } from "../../utils/languages";
import { LanguageButton } from "../reusables/LanguageButton";
import Dropdown, { 
  dropdownMenuClass,
  menuItemClass
} from "../reusables/dropdown";


const LanguageDropdown: FC = () => {
  const items = LANGUAGES.map((l: LanguageOptionInterface) => ({
    key: l.name, jsx: <LanguageButton {...{ className: `flexFill `, l }} />,
  }));

  const openMenuButton = <LanguageIcon className="h-5 w-5" aria-hidden="true" />;
  const openMenuButtonClass = `rounded-lg min-w-min bg-zinc-900 justify-start flexFill `;
  return <Dropdown {...{ openMenuButton, items, openMenuButtonClass, dropdownMenuClass, menuItemClass }} />;
};

export default LanguageDropdown;