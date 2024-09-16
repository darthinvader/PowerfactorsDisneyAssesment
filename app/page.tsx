'use client';

import React from 'react';
import CharacterModal from '../components/characterModal/CharacterModal';
import PieChart from '@/components/pieChart/PieChart';
import DataTable from '@/components/dataTable/DataTable';

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Disney Characters Dashboard</h1>
      <DataTable />
      <PieChart />
      <CharacterModal />
    </div>
  );
};

export default HomePage;
