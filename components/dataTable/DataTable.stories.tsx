import React from 'react';
import { Meta, StoryFn } from '@storybook/react';

import DataTable from './DataTable';
import { Provider } from 'react-redux';
import { createMockStore } from '../characterModal/mockStore';
import { Character } from '../../types/character';

export default {
  title: 'Components/DataTable',
  component: DataTable,
  decorators: [
    (Story) => {
      const preloadedState: { characters: Character[] } = {
        characters: [...mockCharacters],
      };

      const store = createMockStore(preloadedState);

      return (
        <Provider store={store}>
          <div className="p-4">
            <Story />
          </div>
        </Provider>
      );
    },
  ],
} as Meta<typeof DataTable>;

const Template: StoryFn<typeof DataTable> = (args) => <DataTable {...args} />;

export const Default = Template.bind({});
Default.args = {};

// Mock data
const mockCharacters: Character[] = [
  {
    _id: 1,
    name: 'Mickey Mouse',
    imageUrl: 'https://example.com/mickey.jpg',
    films: ['Fantasia', 'Steamboat Willie'],
    shortFilms: ['The Band Concert'],
    tvShows: ['Mickey Mouse Clubhouse'],
    videoGames: ['Kingdom Hearts'],
    parkAttractions: ['Mickey’s PhilharMagic'],
    allies: ['Donald Duck', 'Goofy'],
    enemies: ['Pete'],
    sourceUrl: '',
    url: '',
  },
  {
    _id: 2,
    name: 'Donald Duck',
    imageUrl: 'https://example.com/donald.jpg',
    films: ['The Wise Little Hen'],
    shortFilms: ['Don Donald'],
    tvShows: ['DuckTales'],
    videoGames: ['Kingdom Hearts'],
    parkAttractions: ["Donald's Boat"],
    allies: ['Mickey Mouse', 'Goofy'],
    enemies: ["Chip 'n' Dale"],
    sourceUrl: '',
    url: '',
  },
  // Add more mock characters as needed
];
