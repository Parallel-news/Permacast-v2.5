import Shikwasa from '../shikwasa-src/main.js';
import { useAccount } from 'wagmi';
import { useArconnect } from 'react-arconnect';
import { HSL, replaceColorsInterface, RGB, RGBA, RGBtoHSLInterface } from '../interfaces/ui.js';

export const CheckAuthHook = () => {
  const { address: EthAddress } = useAccount();
  const { address: ArConnectAddress } = useArconnect();

  return [EthAddress, ArConnectAddress];
}

export const dimColor = (color: string, dimness: number): string => {
  if (color.includes('rgba')) return color;
  return color.replace('rgb', 'rgba')?.replace(')', `,${dimness})`)
}

export const RGBobjectToString = (rgb: RGB) => `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

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

export const isTooDark = (rgba: RGBA): boolean => {
  const lightness = rgba.a;
  let hsl = RGBtoHSL(rgba);
  return hsl.l < lightness;
};

export const isTooLight = (rgba: RGBA): boolean => {
  const lightness = rgba.a;
  let hsl = RGBtoHSL(rgba);
  return hsl.l > lightness;
};

export function getButtonRGBs(rgb: RGB, textLightness=0.8, backgroundLightness=0.15) {
  const replacedRGB = RGBobjectToString(replaceDarkColorsRGB({...rgb, a: 0.45 }));
  const iconColor = replacedRGB?.replace('rgb', 'rgba')?.replace(')', `, ${textLightness})`);
  const background = replacedRGB?.replace('rgb', 'rgba')?.replace(')', `, ${backgroundLightness})`);
  return { backgroundColor: background, color: iconColor };
};

// capitalize first letter, remove ar from label
export const trimANSLabel = (label: string) => {
  return label.replace(/\w/, c => c.toUpperCase()).replace('ar', '')
};

export const showPlayer = (podcast, episode) => {
  const player = new Shikwasa({
    container: () => document.querySelector('.podcast-player'),
    themeColor: 'gray',
    theme: `dark`,
    autoplay: true,
    audio: {
      title: episode.episodeName,
      artist: podcast.podcastName,
      cover: `https://arweave.net/${podcast.cover}`,
      src: `https://arweave.net/${episode.contentTx}`,
    },
    download: true
  })
  player.play()
  window.scrollTo(0, document.body.scrollHeight)
}
