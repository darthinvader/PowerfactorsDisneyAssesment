'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from '@tanstack/react-table';
import { columns } from './columns';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import {
  fetchCharacters,
  setPage,
  setPageSize,
  setSearchQuery,
  setFilterTVShow,
  openModal,
} from '../../store/characterSlice';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import useDebounce from '../../hooks/useDebounce';

const DataTable: React.FC = () => {
  const dispatch = useAppDispatch();

  const {
    characters,
    loading,
    error,
    page,
    pageSize,
    totalPages,
    searchQuery,
    filterTVShow,
  } = useAppSelector((state) => state.characters);

  const [searchInput, setSearchInput] = useState(searchQuery);
  const [filterInput, setFilterInput] = useState(filterTVShow);

  const debouncedSearch = useDebounce(searchInput, 400);
  const debouncedFilter = useDebounce(filterInput, 400);

  useEffect(() => {
    dispatch(setSearchQuery(debouncedSearch));
    dispatch(setFilterTVShow(debouncedFilter));
  }, [debouncedSearch, debouncedFilter, dispatch]);

  useEffect(() => {
    dispatch(fetchCharacters());
  }, [dispatch, page, pageSize, searchQuery, filterTVShow]);

  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: characters,
    columns,
    manualPagination: true,
    pageCount: totalPages,
    state: {
      sorting,
      pagination: {
        pageIndex: page - 1,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      let newPageIndex: number | undefined;

      if (typeof updater === 'function') {
        // If updater is a function, call it with the current state to get the new state
        const oldState = { pageIndex: page - 1, pageSize };
        const updatedState = updater(oldState);
        newPageIndex = updatedState.pageIndex;
      } else {
        // If updater is an object, directly access pageIndex
        newPageIndex = updater.pageIndex;
      }

      if (typeof newPageIndex === 'number') {
        // Dispatch the new page number (1-based)
        dispatch(setPage(newPageIndex + 1));
      }
    },
    onSortingChange: setSorting,
    getCoreRowModel: useMemo(() => getCoreRowModel(), []),
    getPaginationRowModel: useMemo(() => getPaginationRowModel(), []),
    getSortedRowModel: useMemo(() => getSortedRowModel(), []),
  });

  const handleRowClick = (row: any) => {
    const characterId = row.original._id;
    dispatch(openModal(characterId));
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center py-4 md:space-x-2 mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-2 w-full">
          <Input
            placeholder="Search characters..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full md:max-w-xs mb-2 md:mb-0"
            aria-label="Search characters"
          />
          <Input
            placeholder="Filter by TV Show..."
            value={filterInput}
            onChange={(e) => setFilterInput(e.target.value)}
            className="w-full md:max-w-xs mb-2 md:mb-0"
            aria-label="Filter by TV Show"
          />
          <Select
            value={String(pageSize)}
            onValueChange={(value) => dispatch(setPageSize(Number(value)))}
            aria-label="Select number of rows per page"
          >
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder={`${pageSize} rows`} />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 50, 100, 200, 500].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  Show {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center text-red-500"
                >
                  Error: {error}
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => handleRowClick(row)}
                  className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleRowClick(row);
                    }
                  }}
                  role="button"
                  aria-pressed="false"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination controls */}
      <div className="flex items-center justify-between py-4">
        <div>
          {totalPages > 0
            ? `Page ${page} of ${totalPages}`
            : 'No pages to display'}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => dispatch(setPage(page - 1))}
            disabled={page <= 1 || totalPages === 0}
            aria-label="Previous Page"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => dispatch(setPage(page + 1))}
            disabled={page >= totalPages || totalPages === 0}
            aria-label="Next Page"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
