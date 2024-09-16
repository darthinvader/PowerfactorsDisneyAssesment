'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Character } from '../../types/character';
import { Button } from '@/components/ui/button';
import { CaretSortIcon } from '@radix-ui/react-icons';

// Column definitions for the Character data
export const columns: ColumnDef<Character>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Name
        <CaretSortIcon className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue('name')}</div>,
  },
  {
    id: 'numTVShows',
    header: () => <div className="text-right"># TV Shows</div>,
    accessorFn: (row) => (row.tvShows ? row.tvShows.length : 0),
    cell: ({ row }) => (
      <div className="text-right">{row.getValue('numTVShows')}</div>
    ),
  },
  {
    id: 'numVideoGames',
    header: () => <div className="text-right"># Video Games</div>,
    accessorFn: (row) => (row.videoGames ? row.videoGames.length : 0),
    cell: ({ row }) => (
      <div className="text-right">{row.getValue('numVideoGames')}</div>
    ),
  },
  {
    accessorKey: 'allies',
    header: 'Allies',
    cell: ({ row }) => (
      <div>{(row.original.allies || []).join(', ') || 'None'}</div>
    ),
  },
  {
    accessorKey: 'enemies',
    header: 'Enemies',
    cell: ({ row }) => (
      <div>{(row.original.enemies || []).join(', ') || 'None'}</div>
    ),
  },
];
