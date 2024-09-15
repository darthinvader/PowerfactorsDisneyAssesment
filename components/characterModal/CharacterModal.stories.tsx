import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Provider } from 'react-redux';
import CharacterModal from './CharacterModal';
import { createMockStore } from './mockStore';
import { Character } from '../../types/character';
import { CharacterModalProps } from './CharacterModal';

const sampleCharacter: Character = {
  _id: 1,
  name: 'Mickey Mouse',
  imageUrl:
    'https://static.wikia.nocookie.net/disney/images/9/99/Mickey_Mouse_Disney_3.jpeg',
  films: ['Fantasia', 'Steamboat Willie'],
  shortFilms: ['The Barn Dance'],
  tvShows: ['Mickey Mouse Clubhouse'],
  videoGames: ['Kingdom Hearts'],
  parkAttractions: ["Mickey's Toontown"],
  allies: ['Minnie Mouse'],
  enemies: ['Pete'],
  sourceUrl: 'https://disney.fandom.com/wiki/Mickey_Mouse',
  url: 'https://api.disneyapi.dev/characters/1',
};

// Create a mock store with the sample character
const mockStore = createMockStore({ characters: [sampleCharacter] });

export default {
  title: 'Components/CharacterModal',
  component: CharacterModal,
  decorators: [
    (Story) => (
      <Provider store={mockStore}>
        <div style={{ padding: '3rem' }}>
          <Story />
        </div>
      </Provider>
    ),
  ],
} as Meta;

const Template: StoryFn<CharacterModalProps> = (args) => (
  <CharacterModal {...args} />
);

export const Default = Template.bind({});
Default.args = {
  isOpen: true,
  characterId: sampleCharacter._id,
};

export const Skeleton = Template.bind({});
Skeleton.args = {
  isOpen: true,
  characterId: null,
};

export const Closed = Template.bind({});
Closed.args = {
  isOpen: false,
  characterId: sampleCharacter._id,
};
