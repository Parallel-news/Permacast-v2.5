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

export const openMenuButtonClass = `min-w-min bg-zinc-900 h-12 `;
export const dropdownMenuClass = `w-40 hover:bg-zinc-900 bg-zinc-900 min-w-min `;
export const menuItemClass = `bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white my-1 `;

const Dropdown: FC<DropdownProps> = ({
  openMenuButton,
  items,
  openMenuButtonClass,
  dropdownMenuClass,
  menuItemClass
}) => {

  return (
    <NextUIDropdown closeOnSelect={false}>
      <NextUIDropdown.Button id="1" className={openMenuButtonClass}>
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
  );
};

export default Dropdown;