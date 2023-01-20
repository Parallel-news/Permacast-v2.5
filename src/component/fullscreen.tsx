import { FC } from 'react';
import { useTranslation } from "next-i18next";

interface FullscreenInterface {
  episode: any;
  id:  number;
}

const Fullscreen: FC<FullscreenInterface> = ({ episode, id }) => {
  const { t } = useTranslation();

  return (
    <div
      className="absolute h-full w-full z-[20] bg-black"
      onClick={console.log /*`url("${episode?.cover}")`}}> */}
    >
      {/* <img
        className="absolute h-full w-full blur-lg opacity-30 object-cover"
        src={
          "https://arweave.net/" +
          primaryData_.podcasts
            .filter((obj) => {
              return obj.contentType === "audio/";
            })
            .filter((obj) => {
              return obj.episodes.filter((obj0) => {
                return obj0.eid === number;
              });
            })[0].cover
        }
        alt={episode?.episodeName}
      /> */}
      <div className="absolute mt-28 w-full text-center select-text">
        {/* <img
          className="w-[25%] cursor-pointer mx-auto"
          src={
            "https://arweave.net/" +
            primaryData_.podcasts
              .filter((obj) => {
                return obj.contentType === "audio/";
              })
              .filter((obj) => {
                return obj.episodes.filter((obj0) => {
                  return obj0.eid === number;
                });
              })[0].cover
          }
          alt={episode?.episodeName}
        /> */}
        <div className="mt-5 text-3xl font-bold text-white">
          {t("fullscreen.episode")}{" "}
          {/* {primaryData_.podcasts
            .filter((obj) => {
              return obj.contentType === "audio/";
            })
            .filter((obj) => {
              return obj.episodes.filter((obj0) => {
                return obj0.eid === number;
              });
            })[0]
            .episodes.findIndex((obj) => {
              return obj.eid === number;
            }) + 1}{" "} */}
        </div>
        <div className="mt-5 text-xl text-gray-300">{episode?.episodeName}</div>
      </div>
    </div>
  );
}

export default Fullscreen;
