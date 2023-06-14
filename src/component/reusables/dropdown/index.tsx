import React, { Fragment, ReactNode } from "react";
import { Menu, Transition } from "@headlessui/react";

export interface ExtendedDropdownButtonProps {
  key: string;
  jsx: ReactNode;
  customClass?: string;
};

export interface DropdownProps {
  openMenuButton?: ReactNode;
  items: ExtendedDropdownButtonProps[];
  openMenuButtonClass?: string;
  dropdownMenuClass: string;
  menuItemClass: string;
};

const Dropdown = ({
  openMenuButton,
  items,
  openMenuButtonClass="flexFullCenter bg-zinc-900 h-12 w-12 rounded-3xl default-animation ",
  dropdownMenuClass,
  menuItemClass
}: DropdownProps) => {

  return (
    <div className="flex">
      <Menu as="div" className="relative inline-block text-left w-full default-animation ">
        {/*Server and Static are generating two separate IDs. Next UI not SSR friendly*/}
        <Menu.Button className={openMenuButtonClass}>
          {openMenuButton}
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            aria-label="Dropdown Items"
            className={dropdownMenuClass}
          >
            {items.map((item, index) => (
              <Menu.Item as="div"
                key={item.key}
                className={
                  `${menuItemClass}
                ${index === 0 && " hover:rounded-t-md "} 
                ${index + 1 === items.length && " hover:rounded-b-md "}`
                }
              >
                {item.jsx}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>
      {/* <div className="h-[10px] w-[10px]"></div> */}
    </div>
  );
};

export default Dropdown;
