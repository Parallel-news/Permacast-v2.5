import Image from 'next/image'; 
import { Player } from '@livepeer/react';
import waterfallsPoster from '../../../public/telegramLogo.svg'

const PosterImage = () => {
    return (
      <Image
        src={waterfallsPoster}
        alt="waterfull"
        priority
        placeholder="blur"
        className="object-cover"
        blurDataURL="https://theboutiqueadventurer.com/wp-content/uploads/2022/11/seljalandsfoss-waterfall.jpg.webp" //must be link not data:image
      />
    );
  };

//const playbackId = 'bafybeigtqixg4ywcem3p6sitz55wy6xvnr565s6kuwhznpwjices3mmxoe';
const playbackId = 'ar://oz7zITe4FE73tW4p2kFH1cn72NX1mZ5gAI18wojRA1U'

//const arweaveId = "ahCH0wG_wxwmvQ_syjTZB1qxzzC3B10xJ9XdbsX1eZI"

export default function WatchVideo() {

  return (
    <div className="h-[200px]">
        <Player
            title="Waterfalls"
            //playbackId={`${playbackId}`}
            src={playbackId}
            loop
            autoPlay
            muted
            showTitle={false}
            poster={<PosterImage />}
            theme={{
              colors: {
                accent: '#00a55f',
                background: "#fff"
              },
            }}
        />
    </div>
  )
}

// Upload an audio asset
// Play audio asset on command by making the player show at bottom
