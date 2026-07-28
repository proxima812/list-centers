export type MapCopy = {
  title: string;
  description: string;
  heading: string;
  intro: string;
  countLabel: string;
  totalLabel: string;
  selected: string;
  openCenter: string;
  openMap: string;
  search: string;
  searchPlaceholder: string;
  listTitle: string;
  exactLabel: string;
  cityLabel: string;
  countryLabel: string;
  noResults: string;
  dragHint: string;
  empty: string;
  loading: string;
  loadError: string;
  continents: Record<string, string>;
};

export type MapCenter = {
  id: string;
  title: string;
  location?: string;
  city?: string;
  country?: string;
  color: string;
  softColor: string;
  href: string;
  lat: number;
  lng: number;
  address?: string;
  mapUrl?: string;
  precision: "exact" | "city" | "country";
  precisionLabel?: string;
  searchText?: string;
};

export type MapCountry = {
  id: string;
  name: string;
  polygons: number[][][][];
};

export type MapPayload = {
  centers: MapCenter[];
  totalCenters: number;
  exactCentersCount: number;
  cityCentersCount: number;
  countryCentersCount: number;
};

export type Rotation = {
  lat: number;
  lng: number;
};
