import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Character, CharactersResponse } from '../types/character';

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
}

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

// Async thunk to fetch characters
export const fetchCharacters = createAsyncThunk<
  CharactersResponse,
  void,
  { state: { characters: CharactersState } }
>('characters/fetchCharacters', async (_, { getState, rejectWithValue }) => {
  const { page, pageSize, searchQuery, filterTVShow, sortOrder } = getState().characters;
  let url = `https://api.disneyapi.dev/character?page=${page}&pageSize=${pageSize}`;

  if (searchQuery) {
    url += `&name=${encodeURIComponent(searchQuery)}`;
  }

  if (filterTVShow) {
    url += `&tvShows=${encodeURIComponent(filterTVShow)}`;
  }

  try {
    const response = await axios.get<CharactersResponse>(url);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch characters');
  }
});

const charactersSlice = createSlice({
  name: 'characters',
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload;
      state.page = 1; // Reset to first page when page size changes
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
      state.page = 1; // Reset to first page when search query changes
    },
    setFilterTVShow(state, action: PayloadAction<string>) {
      state.filterTVShow = action.payload;
      state.page = 1; // Reset to first page when filter changes
    },
    setSortOrder(state, action: PayloadAction<'asc' | 'desc'>) {
      state.sortOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCharacters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCharacters.fulfilled, (state, action) => {
        state.loading = false;
        state.characters = action.payload.data;
        state.totalPages = action.payload.info.totalPages;
      })
      .addCase(fetchCharacters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setPage,
  setPageSize,
  setSearchQuery,
  setFilterTVShow,
  setSortOrder,
} = charactersSlice.actions;

export default charactersSlice.reducer;
