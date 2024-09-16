'use client';

import React from 'react';
import CharacterModal from '../components/characterModal/CharacterModal';
import PieChart from '@/components/pieChart/PieChart';
import DataTable from '@/components/dataTable/DataTable';

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Disney Characters Dashboard</h1>

      <div className="flex flex-col md:flex-row flex-1">
        <div className="md:w-1/2 w-full  max-h-[90vh] overflow-y-auto mb-4 md:mb-0 md:pr-2 h-full ">
          <DataTable />
        </div>
        <div className="md:w-1/2 w-full md:pl-2 h-full flex flex-col">
          <PieChart />
        </div>
      </div>
      <CharacterModal />
    </div>
  );
};

export default HomePage;
