import { Icon } from "../icon";
import React, { FC, Fragment } from "react";
import { useRecoilState } from "recoil";
import { chronStatusAtom } from "../../atoms";
import { useTranslation } from "next-i18next";
import { Menu } from "@headlessui/react";

const ViewDropDown: FC = () => {
    const [chronStatus, setChronStatus] = useRecoilState<number>(chronStatusAtom)
    const filterStyling = "w-12 h-12 text-zinc-600 cursor-pointer hover:bg-zinc-700 rounded-full default-no-outline-ringed default-animation p-4"
	const Clock = () => <Icon {...{ className }} icon="CLOCK" />;
    const className = 'text-white w-4 h-4 ';
    const { t } = useTranslation();

    return (
    <Menu>
        <Menu.Button>
            <Icon className={filterStyling} icon="BAR3BOTTOM"/>
        </Menu.Button>
        <Menu.Items 
            aria-label="Dynamic Actions" 
            className="bg-[#18181B] w-[48px]"
        >
            <Menu.Item
                as={Fragment}
            >
                <>
                    <button className={`flex items-center w-full hover:bg-zinc-700 text-white bg-[#18181B] ` + 'gap-x-2'} onClick={() => {
                        // Timeout so text doesnt change mid-click
                        setTimeout(() => setChronStatus(prev => prev + 1), 500)
                    }}>
                        <Clock />
                        {chronStatus % 2 ? t("viewPodcasts.showOldest") : t("viewPodcasts.showNewest")}
                    </button>
                </>
            </Menu.Item>
        </Menu.Items>
    </Menu>
    )
}

export default ViewDropDown;

