import React, { useContext } from 'react';
import { appContext } from '../utils/initStateGen.js';

import { useLocation, useHistory } from 'react-router-dom';
import { replaceDarkColorsRGB, isTooLight, trimANSLabel, RGBobjectToString } from '../utils/ui';
import { Cooyub, PlayButton, GlobalPlayButton } from './reusables/icons';
import { EyeIcon } from '@heroicons/react/24/outline';
import { FaPlay } from 'react-icons/fa';
import { FiEye } from 'react-icons/fi';

import Track from './track';
import { getButtonRGBs } from '../utils/ui';

export function Greeting() {
  const appState = useContext(appContext);
  const user = appState.user;
  const label = user.ANSData?.currentLabel
  // what about randomizing greetings?

  return (
    <div>
      <h1 className="text-zinc-100 text-xl">
      {label ? (
        <>
          Hello {trimANSLabel(label)}!
        </>
      ) : 'Welcome!'}
      </h1>
      <p className="text-zinc-400 mb-9">Let's see what we have for today</p>
    </div>
  )
}

export function FeaturedEpisode({episode}) {
  const appState = useContext(appContext);
  const {cover, title, description} = episode;

  const rgb = RGBobjectToString(replaceDarkColorsRGB(episode.rgb))

  return (
    <div className="p-14 flex w-full border border-zinc-800 rounded-3xl">
      <img className="w-40 cursor-pointer  mr-8" src={cover} alt={title} />
      <div className="col-span-2 my-3 text-zinc-100 max-w-xs md:max-w-lg mr-2">
        <div onClick={() => ('')} className="font-medium cursor-pointer line-clamp-1">{title}</div>
        <div className="text-sm line-clamp-5">{description}</div>
      </div>
      <div className="ml-auto">
        <>
          <div className="w-24 btn btn-primary border-0 mt-5 rounded-full flex items-center cursor-pointer backdrop-blur-md" style={getButtonRGBs(rgb)} onClick={() => 'appState.queue.playEpisode(episode)'}>
            <FaPlay className="w-3 h-3" />
            <div className="ml-2">Play</div>
          </div>
          <div className="w-24 btn btn-primary border-0 mt-5 rounded-full flex items-center cursor-pointer backdrop-blur-md" style={getButtonRGBs(rgb)}>
            <FiEye className="h-5 w-5" />
            <div className="ml-2">View</div>
          </div>
        </>
      </div>
    </div>
  )
}


export function FeaturedPodcast({podcast}) {
  const appState = useContext(appContext);
  const history = useHistory();
  const { rgb, episodesCount, cover, podcastName, title, description, firstTenEpisodes, podcastId } = podcast;
  const textColor = isTooLight(rgb) ? 'black' : 'white';
  const { enqueuePodcast, play } = appState.queue;

  return (
    <>
      <div style={{backgroundColor: rgb, color: textColor}} className="mt-4 backdrop-blur-md rounded-3xl">
        <div className="h-1/6 w-full px-5 pb-2 cursor-pointer">
          <div onClick={() => history.push(`/podcast/${podcastId}`)}>
            <div className="pt-5 pb-3 text-xs">{episodesCount} Episode{episodesCount == 1 ? '' : 's'}</div>
            <div className="w-full mb-7">
              <img className="object-contain h-[180px] w-full" src={cover} alt={podcastName} />
            </div>
          </div>
          <div className="h-16 flex items-center">
            <div className="z-10" onClick={() => {
              Promise.all(firstTenEpisodes(true)).then((episodes) => {
                enqueuePodcast(episodes)
                play(episodes[0]);
              });
            }}>
              <GlobalPlayButton size="20" innerColor={rgb} outerColor={textColor} />
            </div>
            <div className="ml-3" onClick={() => history.push(`/podcast/${podcastId}`)}>
              <div className="text-lg line-clamp-1 cursor-pointer">{title}</div>
              <div className="text-xs max-w-[95%] line-clamp-2">{description}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export function FeaturedPodcasts({podcasts}) {
  return (
    <>
      {podcasts.map((podcast, index) => (
        <React.Fragment key={index}>
          <FeaturedPodcast podcast={podcast} />
        </React.Fragment>
      ))}
    </>
  )
}

export function FeaturedPodcastsMobile({podcasts}) {
  return (
    <div className="carousel">
      {podcasts.map((podcast, index) => (
        <div className="carousel-item max-w-[280px] md:max-w-xs pr-4" key={index}>
          <FeaturedPodcast podcast={podcast} />
        </div>
      ))}
    </div>
  )
}

export function RecentlyAdded({episodes}) {
  return (
    <div className="">
      <h2 className="text-zinc-400 mb-4">Recently Added</h2>
      <div className="grid grid-rows-3 gap-y-4 text-zinc-100">
        {episodes.map((episode, index) => (
          <div key={index} className="border border-zinc-800 rounded-3xl p-3 w-full">
            <Track episode={episode} includeDescription={true} />
          </div>
        ))}
      </div>
    </div>
  )
}

export function FeaturedCreators({creators}) {
  const appState = useContext(appContext);
  const {themeColor} = appState.theme;
  const bg = themeColor.replace('rgb', 'rgba').replace(')', ', 0.1)')

  return (
    <div>
      <h2 className="text-zinc-400 mb-4">Featured Creators</h2>
      {creators.map((creator, index) => (
        <div key={index} className="flex justify-between items-center py-4 mb-4">
          <div className="flex">
            {creator?.avatar ? (
              <img className="rounded-lg h-12 w-12" src={creator.avatar} alt={creator.fullname} />
              ) : (
                <Cooyub svgStyle="rounded-lg h-12 w-12" rectStyle="h-6 w-6" fill={'rgb(255, 80, 0)'} />
              )
            }
            <div className="ml-4 flex items-center">
              <div className="flex flex-col">
                <div className="text-zinc-100 text-sm cursor-pointer">{creator.fullname}</div>
                <div className="text-zinc-400 cursor-pointer text-[8px]">@{creator.anshandle}</div>
              </div>
              <div className=" ">
                <p style={{backgroundColor: bg, color: themeColor}} className="px-3 py-2 rounded-full text-[10px] ml-5 cursor-pointer">{appState.t("view")}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
