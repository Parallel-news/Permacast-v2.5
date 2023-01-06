/**
 * Assure str is within min and max boundaries
 * @param {string} str - String to be checked
 * @param {number} min 
 * @param {number} max 
 * @returns 
 */
export const validateStrLength = (str, min, max) => {
    if(min < str.trim().length && str.trim().length > max) {
        return true;
    } else {
        return false;
    }
}