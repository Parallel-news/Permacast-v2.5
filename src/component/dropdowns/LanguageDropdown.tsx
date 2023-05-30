import { FC } from "react";
import LANGUAGES, { LanguageOptionInterface } from "../../utils/languages";
import { LanguageButton } from "../reusables/LanguageButton";
import Dropdown, { 
  dropdownMenuClass,
  menuItemClass
} from "../reusables/dropdown";
import { Icon } from "../icon";


const LanguageDropdown: FC = () => {
  const items = LANGUAGES.map((l: LanguageOptionInterface) => ({
    key: l.name, jsx: <LanguageButton {...{ className: `flexFill `, l }} />,
  }));

  const openMenuButton = <Icon className="h-5 w-5" icon="LANGUAGE" fill="currentColor" strokeWidth="0"/>;
  const openMenuButtonClass = `rounded-lg min-w-min bg-zinc-900 justify-start flexFill `;
  return <Dropdown {...{ openMenuButton, items, openMenuButtonClass, dropdownMenuClass, menuItemClass }} />;
};

export default LanguageDropdown;