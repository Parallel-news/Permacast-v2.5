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