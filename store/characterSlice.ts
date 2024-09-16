import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import {
  Character,
  CharactersResponse,
} from "../types/character";
import { normalizeApiResponse } from "@/lib/utils";

export interface CharactersState {
  characters: Character[];
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  totalPages: number;
  searchQuery: string;
  filterTVShow: string;
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
  isModalOpen: false,
  selectedCharacterId: null,
};

export const fetchCharacters = createAsyncThunk<
  CharactersResponse,
  void,
  { state: { characters: CharactersState } }
>("characters/fetchCharacters", async (_, { getState, rejectWithValue }) => {
  const { page, pageSize, searchQuery, filterTVShow } = getState().characters;
  let url = `https://api.disneyapi.dev/character?page=${page}&pageSize=${pageSize}`;

  if (searchQuery) {
    url += `&name=${encodeURIComponent(searchQuery)}`;
  }

  if (filterTVShow) {
    url += `&tvShows=${encodeURIComponent(filterTVShow)}`;
  }

  try {
    const response = await axios.get(url);
    const data = response.data;

    data.data = normalizeApiResponse(data);

    return data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error ||
      error.message ||
      "Failed to fetch characters";
    return rejectWithValue(errorMessage);
  }
});

const characterSlice = createSlice({
  name: "characters",
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
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload;
      state.page = 1;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
      state.page = 1;
    },
    setFilterTVShow(state, action: PayloadAction<string>) {
      state.filterTVShow = action.payload;
      state.page = 1;
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
        state.characters = action.payload.data as Character[];
        state.totalPages = action.payload.info?.totalPages || 0;
      })
      .addCase(fetchCharacters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.characters = [];
        state.totalPages = 0;
      });
  },
});

export const {
  setPage,
  setPageSize,
  setSearchQuery,
  setFilterTVShow,
  openModal,
  closeModal,
} = characterSlice.actions;

export default characterSlice.reducer;
