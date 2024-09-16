'use client';

import React, { useEffect } from 'react';
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

interface DataTableProps {}

const DataTable: React.FC<DataTableProps> = () => {
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

  useEffect(() => {
    dispatch(fetchCharacters());
  }, [dispatch, page, pageSize, searchQuery, filterTVShow]);

  // Table sorting state
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data: characters,
    columns,
    manualPagination: true,
    manualSorting: true, // Indicate manual sorting
    pageCount: totalPages,
    state: {
      sorting,
      pagination: {
        pageIndex: page - 1,
        pageSize: pageSize,
      },
    },
    onPaginationChange: (updater) => {
      const newPageIndex =
        typeof updater.pageIndex === 'number' ? updater.pageIndex : page - 1;
      dispatch(setPage(newPageIndex + 1));
    },
    onSortingChange: (newSorting) => {
      setSorting(newSorting);
      // Optionally, dispatch an action to handle sorting in the Redux state
      // For example: dispatch(setSortOrder(newSorting[0]?.desc ? "desc" : "asc"));
    },
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
      <div className="flex items-center py-4 space-x-2">
        <Input
          placeholder="Search characters..."
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          className="max-w-xs"
        />
        <Input
          placeholder="Filter by TV Show..."
          value={filterTVShow}
          onChange={(e) => dispatch(setFilterTVShow(e.target.value))}
          className="max-w-xs"
        />
        <Select
          value={String(pageSize)}
          onValueChange={(value) => dispatch(setPageSize(Number(value)))}
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
      <div className="rounded-md border">
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
                <TableCell colSpan={columns.length} className="text-center">
                  Error: {error}
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => handleRowClick(row)}
                  className="cursor-pointer hover:bg-gray-100"
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
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => dispatch(setPage(page + 1))}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
