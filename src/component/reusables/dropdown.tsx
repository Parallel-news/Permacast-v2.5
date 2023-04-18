import React, { FC, ReactNode } from "react";
import { DropdownButtonProps, Dropdown as NextUIDropdown } from "@nextui-org/react";

export interface ExtendedDropdownButtonProps extends DropdownButtonProps {
  key: string;
  jsx: ReactNode;
};

export interface DropdownProps {
  items: ExtendedDropdownButtonProps[]
}

const Dropdown: FC<DropdownProps> = ({ items }) => {
  return (
    <NextUIDropdown>
      <NextUIDropdown.Button className={`rounded-full min-w-min `}>
        
      </NextUIDropdown.Button>
      <NextUIDropdown.Menu 
        aria-label="Dynamic Actions"
        items={items}
        className='w-28 hover:bg-zinc-900 bg-zinc-900 min-w-min'
      >
        {(item: ExtendedDropdownButtonProps) => (
          <NextUIDropdown.Item
            key={item.key}
            textValue={item.key}
            className='w-40 hover:bg-zinc-900 bg-zinc-900'
          >
            {item.jsx}
          </NextUIDropdown.Item>
        )}
      </NextUIDropdown.Menu>
    </NextUIDropdown>
  );
};

export default Dropdown;