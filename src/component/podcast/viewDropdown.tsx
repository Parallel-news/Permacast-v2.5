<<<<<<< HEAD
import { Dropdown, DropdownButtonProps } from "@nextui-org/react"
import { useRecoilState } from "recoil";
import { chronStatusAtom } from "../../atoms";
import { useTranslation } from "next-i18next";
import React from "react";
import { Icon } from "../icon";
=======
import { useTranslation } from "next-i18next";
import React, { FC } from "react";
import { useRecoilState } from "recoil";
import { Bars3BottomRightIcon, ClockIcon } from '@heroicons/react/24/outline';
>>>>>>> f4e5c58cf42336ccee803c4bd1a91f6f90744d45

import { chronStatusAtom } from "../../atoms";
import {
    Dropdown,
    dropdownMenuClass,
    menuItemClass
} from '../reusables';

const filterStyling = "w-12 h-12 text-zinc-600 cursor-pointer hover:bg-zinc-700 rounded-full default-no-outline-ringed default-animation px-2"

const ViewDropDown: FC = () => {

<<<<<<< HEAD
    const [chronStatus, setChronStatus] = useRecoilState<number>(chronStatusAtom)
    const filterStyling = "w-12 h-12 text-zinc-600 cursor-pointer hover:bg-zinc-700 rounded-full default-no-outline-ringed default-animation px-2"
	const Clock = () => <Icon {...{ className }} icon="CLOCK" />;
    const className = 'text-white w-4 h-4 ';
	const menuItems = [
		{ icon: <Clock />, key: "showNewest", name: "Show Newest",  href: ""},
	];
    const { t } = useTranslation();

    return (
    <Dropdown>
        <Dropdown.Trigger>
            <Icon className={filterStyling} icon="BAR3BOTTOM"/>
        </Dropdown.Trigger>
        <Dropdown.Menu 
            aria-label="Dynamic Actions" 
            items={menuItems} 
            css={{ backgroundColor: "#18181B", width: '48px' }}
        >
            {(item: DropdownButtonProps) => (
            <Dropdown.Item
                key={item.key}
                color={item.key === "delete" ? "error" : "default"}
                css={{ backgroundColor: "#18181B", color: "white" }}
                className='hover:bg-zinc-700'
            >
                <>
                    <button className={`flex items-center w-full ` + 'gap-x-2'} onClick={() => {
                        // Timeout so text doesnt change mid-click
                        setTimeout(() => setChronStatus(prev => prev + 1), 500)
                    }}>
                        {item.icon}
                        {chronStatus % 2 ? t("viewPodcasts.showOldest") : t("viewPodcasts.showNewest")}
                    </button>
                </>
            </Dropdown.Item>
            )}
        </Dropdown.Menu>
    </Dropdown>
    )
}
=======
    const { t } = useTranslation();

    const [chronStatus, setChronStatus] = useRecoilState<number>(chronStatusAtom);

    const openMenuButton = <Bars3BottomRightIcon className={filterStyling}/>;
    const openMenuButtonClass = `rounded-lg min-w-min bg-zinc-900 justify-start flexFill `;

    const items = [{
        key: "showNewest",
        jsx: (
            <button className={`flexCenterGap w-full `} onClick={() => {
                // Timeout so text doesnt change mid-click
                setTimeout(() => setChronStatus(prev => prev + 1), 500)
            }}>
                <ClockIcon className="text-white w-4 h-4" />
                {chronStatus % 2 ? t("viewPodcasts.showOldest") : t("viewPodcasts.showNewest")}
            </button>
        )
    }];

    return <Dropdown {...{ openMenuButton, items, openMenuButtonClass, dropdownMenuClass, menuItemClass }} />;
};

export default ViewDropDown;
>>>>>>> f4e5c58cf42336ccee803c4bd1a91f6f90744d45
