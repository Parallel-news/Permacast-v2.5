import toast from "react-hot-toast";
import { CONNECT_WALLET, PODCAST_LABEL_MAX_LEN, PODCAST_LABEL_MIN_LEN, TOAST_DARK } from "../constants";
import { Podcast } from "../interfaces";

interface hexToRgbInter {
    hex: string
    alpha: number
}
export function hexToRGB(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    } else {
    return `rgb(${r}, ${g}, ${b})`;
    }
}

/**
 * Finds the object that contains the corresponding "pid" key and "eid" key.
 *
 * @param {Array<Object>} arr - An array of objects that contain "pid" and "eid" keys.
 * @param {string} pid - The value of the "pid" key to search for.
 * @returns {Object|null} - The object that matches the "pid" and "eid" keys, or null if no match is found.
 */

export function findObjectById(arr, pid, key) {
    for (let i = 0; i < arr.length; i++) {
      const obj = arr[i];
      if (obj[key] === pid) {
        return {
            "obj": obj,
            "index": i
        };
      }
    }
    return null;
}

/**
 * Formats the given string to show the specified number of characters at the beginning and end with 3 dots in the middle.
 *
 * @param {string} str - The string to be formatted.
 * @param {number} beginLength - The number of characters to show at the beginning.
 * @param {number} endLength - The number of characters to show at the end.
 * @returns {string} The formatted string.
 */
export function formatStringByLen(str, beginLength, endLength) {
    const strLength = str.length;
    const beginStr = str.substr(0, beginLength);
    const endStr = str.substr(strLength - endLength, strLength);
    return `${beginStr}...${endStr}`;
}

/**
 * Puts the object with a specific domain property to the first in order in the array.
 * @param {Array<any>} array - The array of objects to search and sort.
 * @param {string} needle - The domain property of the object to be moved to the first index.
 * @returns {Array<any>} - The updated array with the specified object moved to the first index.
 */
export const checkConnection = (arAddress: string) => {
    if (arAddress === undefined) {
      toast.error(CONNECT_WALLET)
      return false
    } else {
      return true
    }
}

/**
 * Displays number of bytes for a string
 * @param str String to measure number of bytes
 * @returns number
 */
export const byteSize = (str:string) => new Blob([str]).size;


/**
 * Checks dictionary object for populated keys. If populated, dont submit
 * @param fieldsObj obj containing conditions. If true, qualified for submission
 * @returns boolean
 */
export const allFieldsFilled = (fieldsObj: any) => {
  for (const key in fieldsObj) {
      if(Object.hasOwnProperty.call(fieldsObj, key)) {
          if(!fieldsObj[key]) {
              return false
          }
      }   
  }
  return true
}

export function handleError (errorMessage: string, loadingSetter: (v: boolean) => void) {
  toast.error(errorMessage, {style: TOAST_DARK})
  loadingSetter(false)
}

export const determineMediaType = (mime: string) => mime.match(/^(audio\/|video\/)/)[0];

export function validateLabel(label, podcasts: Podcast[]) {

  if (!label) {
    return {res: false, msg: "uploadshow.validation.label.limit"}
  };
  if(label.length < PODCAST_LABEL_MIN_LEN || label.length > PODCAST_LABEL_MAX_LEN) {
    return {res: false, msg: "uploadshow.validation.label.limit"}
  }
  const existingLabels = podcasts.map((pod) => pod.label); // only valid labels
  if(existingLabels.includes(label)) {
    return {res: false, msg: "uploadshow.validation.label.in-use"}
  }
  if (/^(?!-)[a-zA-Z0-9-]{1,35}(?<!-)$/.test(label)) {
    return {res: true, msg: label};
  }
}