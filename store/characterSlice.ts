import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Character, CharactersResponse } from "../types/character";

export interface CharactersState {
  characters: Character[];
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  totalPages: number;
  searchQuery: string;
  filterTVShow: string;
  sortOrder: "asc" | "desc";
  isModalOpen: boolean;
  selectedCharacterId: number | null;
}

const initialState: CharactersState = {
  characters: [],
  loading: false,
  error: null,
  page: 1,
  pageSize: 50,
  totalPages: 0,
  searchQuery: "",
  filterTVShow: "",
  sortOrder: "asc",
  isModalOpen: false,
  selectedCharacterId: null,
};

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

const characterSlice = createSlice({
  name: 'characters',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<number>) => {
      state.isModalOpen = true;
      state.selectedCharacterId = action.payload;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.selectedCharacterId = null;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    setPageSize(state, action) {
      state.pageSize = action.payload;
      state.page = 1;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
      state.page = 1;
    },
    setFilterTVShow(state, action) {
      state.filterTVShow = action.payload;
      state.page = 1;
    },
    setSortOrder(state, action) {
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
  openModal,
  closeModal,
} = characterSlice.actions;


export default characterSlice.reducer;
