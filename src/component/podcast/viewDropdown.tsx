import { useTranslation } from "next-i18next";
import React, { FC } from "react";
import { useRecoilState } from "recoil";

import { chronStatusAtom } from "../../atoms";
import { Icon } from "../icon";
import {
    Dropdown,
    dropdownMenuClass,
    menuItemClass
} from '../reusables';

const filterStyling = "w-12 h-12 text-zinc-600 cursor-pointer hover:bg-zinc-700 rounded-full default-no-outline-ringed default-animation px-2";

const ViewDropDown: FC = () => {
    const { t } = useTranslation();

    const [chronStatus, setChronStatus] = useRecoilState<number>(chronStatusAtom);

    const openMenuButton = <Icon icon="BAR3BOTTOM" className={filterStyling}/>;
    const openMenuButtonClass = `rounded-lg min-w-min bg-zinc-900 justify-start flexFill `;

    const items = [{
        key: "showNewest",
        jsx: (
            <button className={`flexCenterGap w-full `} onClick={() => {
                // Timeout so text doesnt change mid-click
                setTimeout(() => setChronStatus(prev => prev + 1), 500)
            }}>
                <Icon icon="CLOCK" className="text-white w-4 h-4" />
                {chronStatus % 2 ? t("viewPodcasts.showOldest") : t("viewPodcasts.showNewest")}
            </button>
        )
    }];

    return <Dropdown {...{ openMenuButton, items, openMenuButtonClass, dropdownMenuClass, menuItemClass }} />;
};

export default ViewDropDown;

