'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCharacters, openModal } from '../store/characterSlice';
import CharacterModal from '../components/characterModal/CharacterModal';

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { characters, loading, error, isModalOpen, selectedCharacterId } =
    useAppSelector((state) => state.characters);

  useEffect(() => {
    dispatch(fetchCharacters());
  }, [dispatch]);

  const handleRowClick = (id: number) => {
    dispatch(openModal(id));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Disney Characters Dashboard</h1>

      {/* Example: 
          <DataTable characters={characters} onRowClick={handleRowClick} />
      */}

      {/* Pie Chart Component */}

      {/* Modal Component */}
      <CharacterModal isOpen={isModalOpen} characterId={selectedCharacterId} />
    </div>
  );
};

export default HomePage;
