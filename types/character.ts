export interface Character {
  _id: number;
  name: string;
  imageUrl: string;
  films?: string[];
  shortFilms?: string[];
  tvShows?: string[];
  videoGames?: string[];
  parkAttractions?: string[];
  allies?: string[];
  enemies?: string[];
  sourceUrl?: string;
  url: string;
}

export interface CharactersInfo {
  totalPages: number;
  count: number;
  previousPage: string | null;
  nextPage: string | null;
}

export interface CharactersResponse {
  info: CharactersInfo;
  data: Character[] | Character;
}

// Type Guards
export function isCharacterArray(data: Character[] | Character): data is Character[] {
  return Array.isArray(data);
}

export function isCharacter(data: Character[] | Character): data is Character {
  return !Array.isArray(data);
}
