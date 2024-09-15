import { configureStore } from '@reduxjs/toolkit';
import charactersReducer, {
  fetchCharacters,
  setPage,
  setPageSize,
  setSearchQuery,
  setFilterTVShow,
  setSortOrder,
  CharactersState,
} from './characterSlice';
import axios from 'axios';
import { CharactersResponse } from '../types/character';

// Correctly mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('characterSlice', () => {
  const initialState: CharactersState = {
    characters: [],
    loading: false,
    error: null,
    page: 1,
    pageSize: 50,
    totalPages: 0,
    searchQuery: '',
    filterTVShow: '',
    sortOrder: 'asc',
  };

  it('should handle initial state', () => {
    const store = configureStore({ reducer: charactersReducer });
    expect(store.getState()).toEqual(initialState);
  });

  it('should handle setPage', () => {
    const store = configureStore({ reducer: charactersReducer });
    store.dispatch(setPage(2));
    expect(store.getState().page).toEqual(2);
  });

  it('should handle setPageSize', () => {
    const store = configureStore({ reducer: charactersReducer });
    store.dispatch(setPageSize(100));
    expect(store.getState().pageSize).toEqual(100);
  });

  it('should handle setSearchQuery', () => {
    const store = configureStore({ reducer: charactersReducer });
    store.dispatch(setSearchQuery('Mickey'));
    expect(store.getState().searchQuery).toEqual('Mickey');
  });

  it('should handle setFilterTVShow', () => {
    const store = configureStore({ reducer: charactersReducer });
    store.dispatch(setFilterTVShow('Tangled'));
    expect(store.getState().filterTVShow).toEqual('Tangled');
  });

  it('should handle setSortOrder', () => {
    const store = configureStore({ reducer: charactersReducer });
    store.dispatch(setSortOrder('desc'));
    expect(store.getState().sortOrder).toEqual('desc');
  });

  it('should handle fetchCharacters (fulfilled)', async () => {
    const mockResponse: CharactersResponse = {
      info: { totalPages: 1, count: 1, previousPage: null, nextPage: null },
      data: [
        {
          _id: 1,
          name: 'Mickey Mouse',
          imageUrl: '',
          films: [],
          shortFilms: [],
          tvShows: [],
          videoGames: [],
          parkAttractions: [],
          allies: [],
          enemies: [],
          sourceUrl: '',
          url: '',
        },
      ],
    };

    mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });

    const store = configureStore({
      reducer: charactersReducer,
    });

    await store.dispatch(fetchCharacters() as any);

    const state = store.getState();
    expect(state.characters.length).toEqual(1);
    expect(state.totalPages).toEqual(1);
  });

  it('should handle fetchCharacters (rejected)', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Failed to fetch characters'));

    const store = configureStore({
      reducer: charactersReducer,
    });

    await store.dispatch(fetchCharacters() as any);

    const state = store.getState();
    expect(state.loading).toBeFalsy();
    expect(state.error).toEqual('Failed to fetch characters');
  });
});
