export interface Character {
  _id: number;
  name: string;
  imageUrl: string;
  films: string[];
  shortFilms: string[];
  tvShows: string[];
  videoGames: string[];
  parkAttractions: string[];
  allies: string[];
  enemies: string[];
  sourceUrl: string;
  url: string;
}

export interface CharactersResponse {
  info: {
    totalPages: number;
    count: number;
    previousPage: string | null;
    nextPage: string | null;
  };
  data: Character[];
}
