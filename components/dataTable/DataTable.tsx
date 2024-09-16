'use client';

import React, { useEffect, useState } from 'react';
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
  setSortOrder,
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
    sortOrder,
  } = useAppSelector((state) => state.characters);

  // Debounce search and filter inputs to reduce API calls
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [debouncedFilter, setDebouncedFilter] = useState(filterTVShow);

  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(setSearchQuery(debouncedSearch));
      dispatch(setFilterTVShow(debouncedFilter));
    }, 400); // 400ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [debouncedSearch, debouncedFilter, dispatch]);

  useEffect(() => {
    dispatch(fetchCharacters());
  }, [dispatch, page, pageSize, searchQuery, filterTVShow, sortOrder]);

  // Table sorting state synchronized with Redux
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    if (sorting.length > 0) {
      dispatch(setSortOrder(sorting[0].desc ? 'desc' : 'asc'));
    } else {
      dispatch(setSortOrder('asc'));
    }
  }, [sorting, dispatch]);

  const table = useReactTable({
    data: characters,
    columns,
    manualPagination: true,
    manualSorting: true,
    pageCount: totalPages,
    state: {
      sorting,
      pagination: {
        pageIndex: page - 1,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      const newPageIndex =
        typeof updater.pageIndex === 'number' ? updater.pageIndex : page - 1;
      dispatch(setPage(newPageIndex + 1));
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleRowClick = (row: any) => {
    const characterId = row.original._id;
    dispatch(openModal(characterId));
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center py-4 space-x-2 mb-4">
        <Input
          placeholder="Search characters..."
          value={debouncedSearch}
          onChange={(e) => setDebouncedSearch(e.target.value)}
          className="max-w-xs"
          aria-label="Search characters"
        />
        <Input
          placeholder="Filter by TV Show..."
          value={debouncedFilter}
          onChange={(e) => setDebouncedFilter(e.target.value)}
          className="max-w-xs"
          aria-label="Filter by TV Show"
        />
        <Select
          value={String(pageSize)}
          onValueChange={(value) => dispatch(setPageSize(Number(value)))}
          aria-label="Select number of rows per page"
        >
          <SelectTrigger className="w-[150px]">
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
          Page {page} of {totalPages}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => dispatch(setPage(page - 1))}
            disabled={page <= 1}
            aria-label="Previous Page"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => dispatch(setPage(page + 1))}
            disabled={page >= totalPages}
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
