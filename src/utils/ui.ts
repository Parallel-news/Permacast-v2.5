import Shikwasa from '../shikwasa-src/main.js';
import { HSL, replaceColorsInterface, RGB, RGBA, RGBstring, RGBtoHSLInterface } from '../interfaces/ui';
import { ShowShikwasaPlayerInterface } from '../interfaces/playback';
import { FastAverageColor, FastAverageColorResult } from 'fast-average-color';
import { podcastCoverColorManager } from './localstorage.js';
import { ARWEAVE_READ_LINK } from '../constants/index.js';


export const RGBtoHex = (rgb: RGB): string => {
  const hexNum = (c: number) => {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  };

  const { r, g, b } = rgb;

  return "#" + hexNum(r) + hexNum(g) + hexNum(b);
};

export const hexToRGB = (hex: string): RGB => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  };
};

export const RGBobjectToString = (rgb: RGB) => `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
export const RGBAobjectToString = (rgba: RGBA) => `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;

export const RGBstringToObject = (rgb: string): RGB => {
  // Remove "rgba(" and ")" from the string, and split the values into an array
  const values = rgb.replace('rgb(', '').replace(')', '').split(',');

  const r = parseInt(values[0]);
  const g = parseInt(values[1]);
  const b = parseInt(values[2]);

  return { r, g, b };
};

export const RGBAstringToObject = (rgba: string): RGBA => {
  // Remove "rgba(" and ")" from the string, and split the values into an array
  const values = rgba.replace('rgba(', '').replace(')', '').split(',');

  const r = parseInt(values[0]);
  const g = parseInt(values[1]);
  const b = parseInt(values[2]);
  const a = parseFloat(values[3]);

  return { r, g, b, a };
};

export const RGBobjectToArray = (rgb: RGB) => [rgb.r, rgb.g, rgb.b];

export const RGBstringToArray = (str: string) => str.replace(/[^0-9,]/g, '').split(',');

export const RGBtoHSL: RGBtoHSLInterface = (rgb) => {
  let { r, g, b } = rgb;

  r /= 255;
  g /= 255;
  b /= 255;
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h: number, s: number, l: number = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: h = 0;
    }
    h /= 6;
  }

  return {h: h, s: s, l: l};
}

export const HSLtoRGB = (hsl: HSL) => {
  let { h, s, l }: HSL = hsl;
  let { r, g, b }: RGB = { r: 0, g: 0, b: 0 };

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {

    let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    let p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {r: r * 255, g: g * 255, b: b * 255};
}

export const hue2rgb = (p: number, q: number, t: number) => {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1/6) return p + (q - p) * 6 * t;
  if (t < 1/2) return q;
  if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
  return p;
};


export const replaceDarkColorsRGB: replaceColorsInterface = (rgba) => {

  const lightness = rgba.a;

  // convert to HSL in order to shift lightness up
  let { h, s, l } = RGBtoHSL(rgba);
  if (l < lightness) l = lightness;

  let { r, g, b } = HSLtoRGB({h, s, l});
  r = Math.round(r);
  g = Math.round(g);
  b = Math.round(b);
  return { r, g, b };
};


export const replaceLightColorsRGB: replaceColorsInterface = (rgba: RGBA) => {

  const lightness = rgba.a;

  // convert to HSL in order to shift lightness down
  let { h, s, l } = RGBtoHSL(rgba);
  if (l > lightness) l = lightness;

  let { r, g, b } = HSLtoRGB({h, s, l});
  r = Math.round(r);
  g = Math.round(g);
  b = Math.round(b);
  return { r, g, b };
};

export const isTooDark = (rgba: RGB | RGBA, lightness = 0.25): boolean => {
  let hsl = RGBtoHSL(rgba);
  return hsl.l < lightness;
};

export const isTooLight = (rgba: RGB | RGBA, lightness = 0.8): boolean => {
  let hsl = RGBtoHSL(rgba);
  return hsl.l > lightness;
};

export const dimColorString = (rgb: RGBstring, dimness: number) => {
  let Rgb = rgb;
  if (Rgb.includes('rgba')) {
    const { r, g, b } = RGBAstringToObject(Rgb);
    return `rgb(${r}, ${g}, ${b}, ${dimness})`;
  };
  return rgb.replace(')', ','+dimness+')');
}

export const dimColorObject = (rgb: RGB, dimness: number): RGBA => ({ r: rgb.r, g: rgb.g, b: rgb.b, a: dimness })

export function getButtonRGBs(rgb: RGB, textLightness=0.8, backgroundLightness=0.15) {
  const replacedRGB = RGBobjectToString(replaceDarkColorsRGB({...rgb, a: 0.45 }));
  const iconColor = replacedRGB?.replace('rgb', 'rgba')?.replace(')', `, ${textLightness})`);
  const background = replacedRGB?.replace('rgb', 'rgba')?.replace(')', `, ${backgroundLightness})`);
  return { backgroundColor: background, color: iconColor };
};

export const fetchAverageColor = async (cover: string): Promise<FastAverageColorResult> => {
  if (!cover) return;
  const fac = new FastAverageColor();
  const averageColor: FastAverageColorResult = await fac.getColorAsync('https://arweave.net/' + cover, { algorithm: 'dominant' })
  return averageColor;
};

export const getCoverColorScheme = (RGBAstring: string): string[] => {
  const rgba: RGBA = RGBAstringToObject(RGBAstring);
  const coverColor = RGBAobjectToString(rgba);
  const textColor = isTooLight(rgba, 0.6) ? "rgb(0, 0, 0)" : "rgb(255, 255, 255)";
  return [coverColor, textColor];
};

// capitalize first letter, remove ar from label
export const trimANSLabel = (label: string) => {
  return label.replace(/\w/, c => c.toUpperCase()).replace('ar', '')
};

export const fetchDominantColor = async (cover: string): Promise<FastAverageColorResult> => {
  if (!cover) return;
  const savedColor = podcastCoverColorManager.getValueFromObject(cover);
  if (savedColor) return {rgb: '', rgba: savedColor, hex: '', isDark: false, isLight: false, hexa: '', value: [0,0,0,0]};
  const fac = new FastAverageColor();
  const averageColor: FastAverageColorResult = await fac.getColorAsync(ARWEAVE_READ_LINK + cover, { algorithm: 'dominant' })
  podcastCoverColorManager.addValueToObject(cover, averageColor.rgba); //? in the future, if this becomes too big, save first 10 chars.
  return averageColor;
};

export const showShikwasaPlayer: ShowShikwasaPlayerInterface = ({
  playerColorScheme,
  title,
  artist,
  cover,
  src
}) => {
  const player = new Shikwasa({
    container: () => document.getElementById('podcast-player'),
    themeColor: playerColorScheme,
    theme: `dark`,
    autoplay: true,
    audio: {
      title: title,
      artist: artist,
      cover: `https://arweave.net/${cover}`,
      src: `https://arweave.net/${src}`,
      color: playerColorScheme,
    },
    download: true
  });
  player.play();
  window.scrollTo(0, document.body.scrollHeight);
  return player;
};
