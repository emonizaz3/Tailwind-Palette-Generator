export interface Palette {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

export type Shade = keyof Palette;

export interface ColorState {
  hex: string;
  name: string;
  palette: Palette;
}

export interface AppState {
  primary: ColorState;
  secondary: ColorState;
  hasSecondary: boolean;
}