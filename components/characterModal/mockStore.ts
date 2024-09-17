import { configureStore } from '@reduxjs/toolkit';
import charactersReducer from '../../store/characterSlice';
import { Character } from '../../types/character';

interface CharactersState {
  characters: Character[];
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  totalPages: number;
  searchQuery: string;
  filterTVShow: string;
  sortOrder: 'asc' | 'desc';
  isModalOpen: boolean;
  selectedCharacterId: number | null;
}

export function createMockStore(preloadedState: { characters: Character[], isModalOpen: boolean, selectedCharacterId: number }) {
  const initialState: CharactersState = {
    characters: preloadedState.characters,
    loading: false,
    error: null,
    page: 1,
    pageSize: 50,
    totalPages: 0,
    searchQuery: '',
    filterTVShow: '',
    sortOrder: 'asc',
    isModalOpen: preloadedState.isModalOpen || false,
    selectedCharacterId: preloadedState.selectedCharacterId || null,
  };

  return configureStore({
    reducer: {
      characters: charactersReducer,
    },
    preloadedState: {
      characters: initialState,
    },
  });
}
