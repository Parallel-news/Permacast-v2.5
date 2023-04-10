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

export default function ViewPodcasts({yourShows}) {

    const titleRow = "flex flex-row justify-between items-end mb-10"
    const allPodcastHeader = "text-3xl text-neutral-300/90 font-semibold pt-10 text-center md:text-start"
    const podcastContainer = "grid grid-cols-1 justify-items-center md:justify-items-start md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1 gap-y-10"

    console.log("Your Shows: ", yourShows)
    const { t } = useTranslation();

	const className = 'text-white w-4 h-4 ';
	const Clock = () => <ClockIcon {...{ className }} />;

	const menuItems = [
		{ icon: <Clock />, key: "sortChron", name: "Sort",  href: ""},
	  ];

    return (
        <>
			<div className={titleRow}>
				<div className="flex md:hidden"></div>
				<h2 className={allPodcastHeader}>{t("viewPodcasts.allpodcasts")}</h2>
				<Dropdown>
					<Dropdown.Trigger

					>
						<Bars3BottomRightIcon className="w-10 h-10 text-zinc-600 cursor-pointer"/>
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
							{item.key === "sortChron" && (
								<button className={flexCenter + 'gap-x-2'} onClick={() => alert("hi")}>
								{item.icon}
								{t(item.name)}
								</button>
							)}
							</>
						</Dropdown.Item>
						)}
					</Dropdown.Menu>
					</Dropdown>
				
			</div>
            <div className={podcastContainer}>
                {yourShows.map((podcast: Podcast, index: number) =>
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