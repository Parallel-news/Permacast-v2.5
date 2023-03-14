import { useState } from 'react';

export default function Player({ audioSrc }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
  <>
    <div className="audio-player">
      <div className="icon-container flex flex-row items-center bg-red-300 w-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="audio-icon w-[7%] h-[7%]" viewBox="0 0 20 20" fill="currentColor">
          <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
        </svg>
        <audio src={audioSrc} className="w-3/6" controls={true} autoPlay={isPlaying}>
          <source src={audioSrc} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
    </>
  );
}