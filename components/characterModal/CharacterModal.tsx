'use client';

import React from 'react';
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton component
import { Character } from '../../types/character';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { closeModal } from '../../store/characterSlice';
import Image from 'next/image';

interface CharacterModalProps {
  isOpen: boolean;
  characterId: number | null;
}

const CharacterModal: React.FC<CharacterModalProps> = ({
  isOpen,
  characterId,
}) => {
  const dispatch = useAppDispatch();
  const character = useAppSelector((state) =>
    state.characters.characters.find(
      (char: Character) => char._id === characterId
    )
  );

  const handleClose = () => {
    dispatch(closeModal());
  };

  // Render the skeleton loader if characterId is null or character data is not found
  if (!characterId || !character) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogOverlay />
        <DialogContent className="p-6">
          <DialogHeader>
            <DialogTitle>
              <Skeleton className="h-8 w-48 mb-4" /> {/* Skeleton for title */}
            </DialogTitle>
            <DialogDescription>
              <div className="mb-4">
                <Skeleton className="h-32 w-32 rounded-md" />{' '}
                {/* Skeleton for image */}
              </div>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">TV Shows:</h3>
                <ul className="list-disc list-inside space-y-2">
                  {[...Array(3)].map((_, index) => (
                    <li key={index}>
                      <Skeleton className="h-4 w-full" />{' '}
                      {/* Skeletons for TV shows */}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Video Games:</h3>
                <ul className="list-disc list-inside space-y-2">
                  {[...Array(3)].map((_, index) => (
                    <li key={index}>
                      <Skeleton className="h-4 w-full" />{' '}
                      {/* Skeletons for video games */}
                    </li>
                  ))}
                </ul>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Skeleton className="h-10 w-24" /> {/* Skeleton for close button */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Render the character data when available
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogOverlay />
      <DialogContent className="p-6">
        <DialogHeader>
          <DialogTitle>{character.name}</DialogTitle>
          <DialogDescription>
            <div className="mb-4">
              <Image
                src={character.imageUrl}
                alt={character.name}
                width={128}
                height={128}
                className="w-32 h-32 object-cover rounded-md"
              />
            </div>
            <div className="mb-4">
              <h3 className="font-semibold">TV Shows:</h3>
              <ul className="list-disc list-inside space-y-2">
                {character.tvShows.length > 0 ? (
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
                {character.videoGames.length > 0 ? (
                  character.videoGames.map((game, index) => (
                    <li key={index}>{game}</li>
                  ))
                ) : (
                  <li>No Video Games</li>
                )}
              </ul>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Close
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CharacterModal;
