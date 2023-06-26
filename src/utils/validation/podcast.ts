import { PodcastFormInterface } from "@/interfaces/validation/podcast";
import { validateStrLength } from "@/utils/uploadValidation";

import {
  PODCAST_NAME_MIN_LEN, PODCAST_NAME_MAX_LEN, PODCAST_DESC_MIN_LEN,
  PODCAST_DESC_MAX_LEN, PODCAST_AUTHOR_MIN_LEN, PODCAST_AUTHOR_MAX_LEN,
  PODCAST_LANG_MIN_LEN, PODCAST_LANG_MAX_LEN, PODCAST_CAT_MIN_LEN,
  PODCAST_CAT_MAX_LEN, IS_EXPLICIT_VALUES,
  PODCAST_COVER_MIN_LEN, PODCAST_COVER_MAX_LEN, CONTENT_TYPE_VALUES
} from '@/constants/index';
import { validateLabel } from "../reusables";


/**
 * Verifies whether email meets certain patterns
 * @param {string} email 
 * @returns boolean value of whether email matches pattern of '@' and '.' presence
 */
export const isValidEmail = email => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}


/**
 * Determines whether validation message should be placed within input field
 * @param {string|number - input from form} input 
 * @param {string - form type} type 
 * @returns Validation message || ""
 */

export const handleValMsg = (input: string, type: string, input2: any = "") => {
  switch (type) {
    case 'podName':
      if ((input.length > PODCAST_NAME_MAX_LEN || input.length < PODCAST_NAME_MIN_LEN)) {
        return "uploadshow.validation.name"//, { minLength: PODCAST_NAME_MIN_LEN, maxLength: PODCAST_NAME_MAX_LEN });
      } else {
        return "";
      }
    case 'podDesc':
      if ((input.length > PODCAST_DESC_MAX_LEN || input.length < PODCAST_DESC_MIN_LEN)) {
        return "uploadshow.validation.description"//, { minLength: PODCAST_DESC_MIN_LEN, maxLength: PODCAST_DESC_MAX_LEN });
      } else {
        return "";
      }
    case 'podAuthor':
      if ((input.length > PODCAST_AUTHOR_MAX_LEN || input.length < PODCAST_AUTHOR_MIN_LEN)) {
        return "uploadshow.validation.author"//, { minLength: PODCAST_AUTHOR_MIN_LEN, maxLength: PODCAST_AUTHOR_MAX_LEN };
      } else {
        return "";
      }
    case 'podEmail':
      if (isValidEmail(input)) {
        return "";
      } else {
        return "uploadshow.validation.email";
      }
    case 'podLabel':
      if (validateLabel(input, input2).res) {
        return "";
      } else {
        return validateLabel(input, input2).msg
      }
  }
}



// /**
//  * Checks all form inputs in case UI is skipped for malicious intents
//  * @returns Form inputs || Submission error
//  */
// export const podcastUploadFormIsValid = ({
//   podcastName,
//   podcastDescription,
//   podcastAuthor,
//   podcastEmail,
//   podcastCategory,
//   podcastCover,
//   podcastLanguage,
//   podcastExplicit
// }: PodcastFormInterface): boolean => {
//   validateStrLength(podcastName, PODCAST_NAME_MIN_LEN, PODCAST_NAME_MAX_LEN) ? "" : setPodNameMsg(PODCAST_NAME_VAL_MSG);
//   validateStrLength(podcastDescription, PODCAST_DESC_MIN_LEN, PODCAST_DESC_MAX_LEN) ? "" : setPodDescMsg(PODCAST_DESC_VAL_MSG);
//   validateStrLength(podcastAuthor, PODCAST_AUTHOR_MIN_LEN, PODCAST_AUTHOR_MAX_LEN) ? "" : setPodAuthMsg(PODCAST_AUTH_VAL_MSG);
//   validateStrLength(podcastLanguage, PODCAST_LANG_MIN_LEN, PODCAST_LANG_MAX_LEN) ? "" : setPodMiscMsg("Invalid language");
//   validateStrLength(podcastCover, PODCAST_COVER_MIN_LEN, PODCAST_COVER_MAX_LEN) ? "" : setPodMiscMsg("Invalid Cover");
//   validateStrLength(podcastCategory,  PODCAST_CAT_MIN_LEN, PODCAST_CAT_MAX_LEN) ? "" : setPodMiscMsg("Invalid Category");
//   isValidEmail(podcastEmail) ? "" : setPodEmailMsg(PODCAST_EMAIL_VAL_MSG);
//   IS_EXPLICIT_VALUES.includes(podcastExplicit) ? "" : setPodMiscMsg("Invalid Explicit Value");
//   CONTENT_TYPE_VALUES.includes(contentType_) ? "" : setPodMiscMsg("Invalid Content Type");

//   if () {
//     return true
//   } else {
//     return false
//   }
// }

