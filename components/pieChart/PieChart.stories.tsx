import React from 'react';
import { Story, Meta } from '@storybook/react';
import PieChart from './PieChart';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import charactersReducer from '../../store/characterSlice';
import { Character } from '../../types/character';

/**
 * Mock data for Storybook
 */
const mockCharacters: Character[] = [
  {
    _id: 1,
    name: 'Mickey Mouse',
    films: ['Fantasia', 'Steamboat Willie'],
    shortFilms: [],
    tvShows: [],
    videoGames: [],
    parkAttractions: [],
    allies: [],
    enemies: [],
    sourceUrl: '',
    imageUrl: '',
    url: '',
  },
  {
    _id: 2,
    name: 'Donald Duck',
    films: ['The Wise Little Hen'],
    shortFilms: [],
    tvShows: [],
    videoGames: [],
    parkAttractions: [],
    allies: [],
    enemies: [],
    sourceUrl: '',
    imageUrl: '',
    url: '',
  },
  {
    _id: 2,
    name: 'Donald Duck',
    films: ['The Wise Little Hen'],
    shortFilms: [],
    tvShows: [],
    videoGames: [],
    parkAttractions: [],
    allies: [],
    enemies: [],
    sourceUrl: '',
    imageUrl: '',
    url: '',
  },
  // Add more mock characters as needed
];

/**
 * Create a mock Redux store for Storybook
 */
const mockStore = configureStore({
  reducer: {
    characters: charactersReducer as unknown as any,
  },
  preloadedState: {
    characters: {
      characters: mockCharacters,
      loading: false,
      error: null,
      page: 1,
      pageSize: 50,
      totalPages: 1,
      searchQuery: '',
      filterTVShow: '',
      sortOrder: 'asc',
      isModalOpen: false,
      selectedCharacterId: null,
    },
  },
});

export default {
  title: 'Components/PieChart',
  component: PieChart,
  decorators: [
    (Story) => (
      <Provider store={mockStore}>
        <div className="p-4">
          <Story />
        </div>
      </Provider>
    ),
  ],
} as Meta<typeof PieChart>;

/**
 * Default story for the PieChart component
 */
const Template: Story<typeof PieChart> = (args) => <PieChart {...args} />;

export const Default = Template.bind({});
Default.args = {};
