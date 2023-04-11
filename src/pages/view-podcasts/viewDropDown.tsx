import { Dropdown, DropdownButtonProps } from "@nextui-org/react"
import { 
    Bars3BottomRightIcon, ClockIcon
} from '@heroicons/react/24/outline';
import { useRecoilState } from "recoil";
import { chronStatusAtom } from "../../atoms";
import { useTranslation } from "next-i18next";

export default function ViewDropDown() {

    const [chronStatus, setChronStatus] = useRecoilState<number>(chronStatusAtom)
    const filterStyling = "w-12 h-12 text-zinc-600 cursor-pointer hover:bg-zinc-700 rounded-full default-no-outline-ringed default-animation px-2"
	const Clock = () => <ClockIcon {...{ className }} />;
    const className = 'text-white w-4 h-4 ';
	const menuItems = [
		{ icon: <Clock />, key: "showNewest", name: "Show Newest",  href: ""},
	];
    const { t } = useTranslation();

    return (
    <Dropdown>
        <Dropdown.Trigger>
            <Bars3BottomRightIcon className={filterStyling}/>
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
                    <button className={`flex items-center ` + 'gap-x-2'} onClick={() => {
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
