import axios from "axios";
import { useTranslation } from "next-i18next";
import { EXM_READ_LINK, NO_SHOW } from "../../../constants";
import { getContractVariables } from "../../../utils/contract";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Podcast } from "../../../interfaces";
import FeaturedPodcast from "../../../component/home/featuredPodcast";
import { 
  Bars3BottomRightIcon, ClockIcon
} from '@heroicons/react/24/outline';
import { Dropdown, DropdownButtonProps } from "@nextui-org/react";
import { flexCenter } from "../../../component/creator/featuredCreators";
import { useEffect, useState } from "react";
import { detectTimestampType } from "../../../utils/reusables";

export default function ViewPodcasts({yourShows}) {

    const titleRow = "flex flex-row justify-between items-end mb-10"
    const allPodcastHeader = "text-3xl text-neutral-300/90 font-semibold pt-10 text-center md:text-start"
    const podcastContainer = "grid grid-cols-1 justify-items-center md:justify-items-start md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1 gap-y-10 mb-10"
	const filterStyling = "w-12 h-12 text-zinc-600 cursor-pointer hover:bg-zinc-700 rounded-full default-no-outline-ringed default-animation px-2"

    
    const { t } = useTranslation();
	const [chronStatus, setChronStatus] = useState<number>(0)
	const [shows, setShows] = useState<Podcast[]>([])

	const className = 'text-white w-4 h-4 ';
	const Clock = () => <ClockIcon {...{ className }} />;

	const menuItems = [
		{ icon: <Clock />, key: "showNewest", name: "Show Newest",  href: ""},
	];

	useEffect(() => {
		const showsCopy = [...yourShows];
		const shows = showsCopy.sort((a, b) =>  a.createdAt - b.createdAt)
		if(chronStatus % 2) {
			setShows(shows.reverse()) 
		} else {
			setShows(shows)
		}
	}, [chronStatus])
	console.log("Shows: ", shows)
    return (
        <>
			<div className={titleRow}>
				{/*Header*/}
				<div className="flex md:hidden"></div>
				<h2 className={allPodcastHeader}>{t("viewPodcasts.allpodcasts")}</h2>
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
								<button className={flexCenter + 'gap-x-2'} onClick={() => {
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
			</div>
			{/*Podcasts*/}
            <div className={podcastContainer}>
                {shows.map((podcast: Podcast, index: number) =>
                    <FeaturedPodcast {...podcast} key={index} />
                )}
            </div>
        </>

    )
}

export async function getStaticProps({ locale }) {
    const { contractAddress } = getContractVariables()
    let yourShows = null
    let error = "";
    try {
      const res = await axios.get(EXM_READ_LINK+contractAddress)
      yourShows = res.data?.podcasts
	  yourShows.map(item => {
		if(detectTimestampType(item.createdAt) === "seconds") {
			item.createdAt = item.createdAt*1000
			return item;
		}
	  })
    } catch(e) {
      error = NO_SHOW
    }

    return {
      props: {
        ...(await serverSideTranslations(locale, [
          'common',
        ])),
        yourShows,
        error
      },
    }
}