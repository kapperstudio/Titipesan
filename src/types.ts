export interface TitipesanSong {
  trackId?: number;
  trackName: string;
  artistName: string;
  collectionName?: string;
  artworkUrl100?: string;
  previewUrl?: string;
  trackViewUrl?: string;
}

export type PaperColor =
  | 'Warm Paper'
  | 'Soft Pink'
  | 'Pale Blue'
  | 'Cream'
  | 'Lavender'
  | 'Sage'
  | 'Sand';

export interface TitipesanMessage {
  id: string;
  to: string;
  message: string;
  color: PaperColor;
  song?: TitipesanSong | null;
  from: string;
  date: string;
  createdAt: number;
}

export type AppRoute =
  | '/'
  | '/create'
  | '/search'
  | '/history'
  | '/donate'
  | '/about'
  | '/privacy'
  | '/support'
  | '/detail';

export interface ColorScheme {
  id: PaperColor;
  name: string;
  bgHex: string;
  borderHex: string;
  accentHex: string;
}

export const PAPER_COLORS: ColorScheme[] = [
  { id: 'Warm Paper', name: 'Warm Paper', bgHex: '#FCFAF4', borderHex: '#EAE3D5', accentHex: '#8C8275' },
  { id: 'Soft Pink', name: 'Soft Pink', bgHex: '#FAF1F1', borderHex: '#EEDCDC', accentHex: '#9E7D7D' },
  { id: 'Pale Blue', name: 'Pale Blue', bgHex: '#F1F5F8', borderHex: '#DCE4ED', accentHex: '#718399' },
  { id: 'Cream', name: 'Cream', bgHex: '#FDF8EC', borderHex: '#EFE3CA', accentHex: '#9C8862' },
  { id: 'Lavender', name: 'Lavender', bgHex: '#F5F1F8', borderHex: '#E4DFEC', accentHex: '#89779E' },
  { id: 'Sage', name: 'Sage', bgHex: '#F1F6F3', borderHex: '#DDE7E0', accentHex: '#6F8A77' },
  { id: 'Sand', name: 'Sand', bgHex: '#F7F3EB', borderHex: '#E8DFD1', accentHex: '#918471' },
];
