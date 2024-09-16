'use client';

import React from 'react';
import CharacterModal from '../components/characterModal/CharacterModal';
import PieChart from '@/components/pieChart/PieChart';
import DataTable from '@/components/dataTable/DataTable';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col h-screen">
      <header className="h-16 flex items-center justify-center bg-gray-100 p-2">
        <h1 className="text-2xl font-bold">Disney Characters Dashboard</h1>
      </header>

      <main className="flex-1 flex flex-col md:flex-row">
        <div
          className="md:w-1/2 w-full overflow-y-auto p-4 "
          style={{ maxHeight: 'calc(100vh - 64px)' }}
        >
          <DataTable />
        </div>

        <div className="md:w-1/2 w-full flex-1 p-4 flex flex-col">
          <PieChart />
        </div>
      </main>

      <CharacterModal />
    </div>
  );
};

export default HomePage;
