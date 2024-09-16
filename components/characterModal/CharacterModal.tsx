'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Character } from '../../types/character';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { closeModal } from '../../store/characterSlice';
import Image from 'next/image';
import { Button } from '../ui/button';
import axios from 'axios';

const CharacterModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isModalOpen, selectedCharacterId } = useAppSelector(
    (state) => state.characters
  );
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const characterCache = useRef<{ [key: number]: Character }>({});

  useEffect(() => {
    const loadCharacter = async () => {
      if (!selectedCharacterId) return;
      if (characterCache.current[selectedCharacterId]) {
        setCharacter(characterCache.current[selectedCharacterId]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `https://api.disneyapi.dev/character/${selectedCharacterId}`
        );
        characterCache.current[selectedCharacterId] = response.data.data;
        setCharacter(response.data.data);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            err.message ||
            'Failed to load character details'
        );
      } finally {
        setLoading(false);
      }
    };

    if (isModalOpen && selectedCharacterId) {
      loadCharacter();
    } else {
      setCharacter(null);
    }
  }, [isModalOpen, selectedCharacterId]);

  const handleClose = () => {
    dispatch(closeModal());
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="p-6 max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle id="character-modal-title">
            {loading ? (
              <Skeleton className="h-8 w-48 mb-4" />
            ) : (
              character?.name || 'Character Details'
            )}
          </DialogTitle>
          <DialogDescription>
            {loading ? (
              <>
                <Skeleton className="h-32 w-32 rounded-md mb-4" />
                <div className="mb-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  {[...Array(3)].map((_, index) => (
                    <Skeleton key={index} className="h-4 w-full mb-2" />
                  ))}
                </div>
                <div>
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  {[...Array(3)].map((_, index) => (
                    <Skeleton key={index} className="h-4 w-full mb-2" />
                  ))}
                </div>
              </>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : character ? (
              <>
                <div className="mb-4">
                  <Image
                    src={character.imageUrl}
                    alt={character.name}
                    width={128}
                    height={128}
                    className="w-32 h-32 object-cover rounded-md"
                    unoptimized
                  />
                </div>
                <div className="mb-4">
                  <h3 className="font-semibold">TV Shows:</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {character.tvShows && character.tvShows.length > 0 ? (
                      character.tvShows.map((show, index) => (
                        <li key={index}>{show}</li>
                      ))
                    ) : (
                      <li>No TV Shows</li>
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold">Video Games:</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {character.videoGames && character.videoGames.length > 0 ? (
                      character.videoGames.map((game, index) => (
                        <li key={index}>{game}</li>
                      ))
                    ) : (
                      <li>No Video Games</li>
                    )}
                  </ul>
                </div>
              </>
            ) : (
              <div>No character selected.</div>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={handleClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CharacterModal;
