import React, { FC, ReactNode } from "react";
import { DropdownButtonProps, Dropdown as NextUIDropdown } from "@nextui-org/react";

export interface ExtendedDropdownButtonProps extends DropdownButtonProps {
  key: string;
  jsx: ReactNode;
  customClass?: string;
};

export interface DropdownProps {
  openMenuButton?: ReactNode;
  items: ExtendedDropdownButtonProps[];
  openMenuButtonClass: string;
  dropdownMenuClass: string;
  menuItemClass: string;
};

export const openMenuButtonClass = `bg-zinc-900 h-12 `;
export const dropdownMenuClass = `hover:bg-zinc-900 bg-zinc-900 w-[22px]`;
export const menuItemClass = `bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white my-1`;
 
const Dropdown: FC<DropdownProps> = ({
  openMenuButton,
  items,
  openMenuButtonClass,
  dropdownMenuClass,
  menuItemClass
}) => {

  return (
    <div className="flex flex-row mr-4">
    <NextUIDropdown closeOnSelect={false}>
      {/*Server and Static are generating two separate IDs. Next UI not SSR friendly*/}
      <NextUIDropdown.Button className={openMenuButtonClass} suppressHydrationWarning={true}>
        {openMenuButton}
      </NextUIDropdown.Button>
      <NextUIDropdown.Menu
        aria-label="Dropdown Items" 
        items={items}
        className={dropdownMenuClass}
      >
        {(item: ExtendedDropdownButtonProps) => (
          <NextUIDropdown.Item
            key={item.key}
            textValue={item.key}
            className={item.customClass ? item.customClass : menuItemClass}
          >
            {item.jsx}
          </NextUIDropdown.Item>
        )}
      </NextUIDropdown.Menu>
    </NextUIDropdown>
    <div className="h-[10px] w-[10px]"></div>
    </div>
  );
};

export default Dropdown;