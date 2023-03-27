export type HexString = string;
export type RGBstring = string;

export interface RGB {
  r: number,
  g: number,
  b: number,
};

export type RGBAstring = string;

export type RGBorRGBAstring = RGBstring | RGBAstring;

export interface RGBA {
  r: number,
  g: number,
  b: number,
  a: number,
};

export interface HSL {
  h: number,
  s: number,
  l: number,
};

export type RGBtoHSLInterface = (rgb: RGB) => HSL;

export type replaceColorsInterface = (rgba: RGBA, lightness: number) => RGB;

export type Classname = string;