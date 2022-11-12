import {
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRecoilState } from "recoil";
import { videoSelection } from '../atoms';

export default function VideoModal() {

  // Recoil atom, stores focus data..
  const [vs_, setVS_] = useRecoilState(videoSelection);

  return (
    <div className={`w-full h-full fixed flex flex-col justify-center items-center bg-black/70 transition-all duration-200 z-[61] ${!(vs_[0].length == 0) ? 'backdrop-blur-none opacity-0 pointer-events-none' : 'backdrop-blur-[10px] opacity-100 pointer-events-auto'}`}>
    <div className={`w-[700px] flex flex-col justify-center items-center`}>
      <div className={`w-[700px] h-[20px] flex flex-row`}>
      <div className={`w-[70px] h-[20px] flex flex-row justify-center items-center ml-auto text-white/70 cursor-pointer z-[63] bottom-[16px] relative`} onClick={() => {
        setVS_(['2', {}])
      }}>
      <FontAwesomeIcon icon={faArrowLeft} className={`relative bottom-[-0px] right-2`} onClick={() => {
        
      }}/>
      <p className={`relative bottom-[0px]`} onClick={() => {
        
      }}>Back</p>
      </div>
      </div>
    <div className="text-zinc-400 w-[700px] flex flex-col justify-center items-center rounded-[4px] relative overflow-hidden z-[62]">
      
      <video
        id="my-player"
        class="video-js"
        controls
        preload="auto"
        poster="https://images.pexels.com/photos/8657665/pexels-photo-8657665.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        data-setup="{}"
        className="rounded-[4px]"
      >
        <source src="https://www.pexels.com/video/853921/download/?fps=25.0&h=720&w=1280" type="video/mp4"></source>
        <p class="vjs-no-js">
          To view this video please enable JavaScript, and consider upgrading to
          a web browser that
          <a href="https://videojs.com/html5-video-support/" target="_blank">
            supports HTML5 video
          </a>
        </p>
      </video>
      
    </div>
    </div>
    </div>
  );
}
