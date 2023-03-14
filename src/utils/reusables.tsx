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
 * @param {string} eid - The value of the "eid" key to search for.
 * @returns {Object|null} - The object that matches the "pid" and "eid" keys, or null if no match is found.
 */

export function findObjectByPidAndEid(arr, pid, eid) {
    for (let i = 0; i < arr.length; i++) {
      const obj = arr[i];
      if (obj.pid === pid) {
        const episodes = obj.episodes;
        for (let j = 0; j < episodes.length; j++) {
          const episode = episodes[j];
          if (episode.eid === eid) {
            return obj;
          }
        }
      }
    }
    return null;
  }