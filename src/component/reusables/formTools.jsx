import { useTranslation } from "next-i18next";
import { Transition } from "@headlessui/react";
import { EPISODE_DESC_MAX_LEN, EPISODE_DESC_MIN_LEN, EPISODE_NAME_MIN_LEN, PODCAST_AUTHOR_MAX_LEN, PODCAST_AUTHOR_MIN_LEN, PODCAST_DESC_MAX_LEN, PODCAST_DESC_MIN_LEN, PODCAST_LABEL_MAX_LEN, PODCAST_LABEL_MIN_LEN, PODCAST_NAME_MAX_LEN, PODCAST_NAME_MIN_LEN } from "../../constants";

/**
 * Reusable Text Validation Box to Appear Under Respective Input
 * @param {valMsg, className} props 
 * @returns Text highlighted validation concern
 */
export const ValMsg = props => {
  const { t } = useTranslation();
  const { valMsg, className } = props;
  let lengths;
  // Shows
  if (valMsg === "uploadshow.validation.label.limit") lengths = { minLength: PODCAST_LABEL_MIN_LEN, maxLength: PODCAST_LABEL_MAX_LEN};
  if (valMsg === "uploadshow.validation.name") lengths = {minLength: PODCAST_NAME_MIN_LEN, maxLength: PODCAST_NAME_MAX_LEN};
  if (valMsg === "uploadshow.validation.description") lengths = {minLength: PODCAST_DESC_MIN_LEN, maxLength: PODCAST_DESC_MAX_LEN};
  if (valMsg === "uploadshow.validation.author") lengths = {minLength: PODCAST_AUTHOR_MIN_LEN, maxLength: PODCAST_AUTHOR_MAX_LEN};
  // Episodes
  if (valMsg === "uploadepisode.validation.name") lengths = {minLength: EPISODE_NAME_MIN_LEN, maxLength: EPISODE_DESC_MAX_LEN};
  if (valMsg === "uploadepisode.validation.description") lengths = {minLength: EPISODE_DESC_MIN_LEN, maxLength: EPISODE_DESC_MAX_LEN};
  // Rss
  if (valMsg === "rss.norssepisode") lengths = {};
  if (valMsg === "rss.norsspodcast") lengths = {};

  return (
    <Transition
        show={valMsg.length ? true : false}
        appear={true}
        enter="transform transition duration-[500ms]"
        enterFrom="opacity-0 scale-75"
        enterTo="opacity-100 scale-100"
        leave="transform transition duration-[200ms]"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-75 scale-75"
    >   
      <p className={`text-red-300 flex ${className}`}>{t(valMsg, lengths)}</p>
    </Transition>
  );
}

/**
 * Verifies whether email meets certain patterns
 * @param {string} email 
 * @returns boolean value of whether email matches pattern of '@' and '.' presence
 */
export const isValidEmail = email => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}


export function reduceImageSize(file) {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = function () {
      var image = new Image();
      image.src = reader.result;

      image.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, image.width, image.height);
        var MAX_SIZE = 64 * 1024;
        var quality = 1;
        while (true) {
          canvas.toBlob(function (blob) {
            var fileSize = blob.size;
            if (fileSize <= MAX_SIZE) {
              resolve(blob);
            }
            quality -= 0.1;
          }, 'image/jpeg', quality);
        }
      };
    };
  });
}