export interface RGB {
  r: number,
  g: number,
  b: number,
}

export interface RGBA {
  r: number,
  g: number,
  b: number,
  a: number,
}

export interface HSL {
  h: number,
  s: number,
  l: number,
}

export type RGBtoHSLInterface = (rgb: RGB) => HSL;

export type replaceColorsInterface = (rgba: RGBA) => RGB;


export type ShowShikwasaPlayerInterface = (
  themeColor:  string,
  title:  string,
  artist: string,
  cover:  string,
  src:    string,
) => void;
