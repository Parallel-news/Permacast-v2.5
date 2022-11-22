import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRecoilState } from "recoil";
import { videoSelection } from "../atoms";

export default function VideoModal() {
  // Recoil atom, stores focus data..
  const [vs_, setVS_] = useRecoilState(videoSelection);

  let playerObj = document.getElementById("my-player");

  return (
    <div
      className={`w-full h-full fixed flex flex-col justify-center items-center bg-black/70 transition-all duration-200 z-[45] ${
        vs_[0].length == 0
          ? "backdrop-blur-none opacity-0 pointer-events-none"
          : "backdrop-blur-[10px] opacity-100 pointer-events-auto"
      }`}
    >
      <div
        className={`w-[700px] sm:w-full flex flex-col justify-center items-center`}
      >
        <div className={`md:w-[700px] h-[20px] flex flex-row`}>
          <div
            className={`w-[70px] h-[20px] flex flex-row justify-center items-center ml-auto text-white/70 cursor-pointer bottom-[16px] relative`}
            onClick={() => {
              setVS_(["", {}]);
              playerObj.pause();
              playerObj.currentTime = 0;
            }}
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
              className={`relative bottom-[-0px] right-2`}
              onClick={() => {}}
            />
            <p className={`relative bottom-[0px]`} onClick={() => {}}>
              Back
            </p>
          </div>
        </div>
        <div className="text-zinc-400 w-[700px] sm:w-full flex flex-col justify-center items-center rounded-[4px] relative overflow-hidden">
            <video
            id="my-player"
            class="video-js"
            controls
            preload="auto"
            poster={vs_[1].cover}
            data-setup="{}"
            className="rounded-[4px]"
          >
            <source
              src={
                "https://mdn.github.io/learning-area/javascript/apis/video-audio/finished/video/sintel-short.webm"
              }
              type="video/webm"
            ></source>
            <p class="vjs-no-js">
              To view this video please enable JavaScript, and consider
              upgrading to a web browser that
              <a
                href="https://videojs.com/html5-video-support/"
                target="_blank"
              >
                supports HTML5 video
              </a>
            </p>
          </video>
        </div>
      </div>
    </div>
  );
}
