// /components/pieChart/PieChart.tsx

import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useAppSelector } from '../../store/hooks';
import { Character } from '../../types/character';
import * as XLSX from 'xlsx';

interface ChartDataPoint {
  name: string;
  y: number;
  custom: {
    films: string[];
  };
}

const PieChart: React.FC = () => {
  const { characters } = useAppSelector((state) => state.characters);
  const [options, setOptions] = useState<Highcharts.Options | null>(null);

  useEffect(() => {
    if (!characters || characters.length === 0) {
      setOptions(null);
      return;
    }

    // Prepare data for the pie chart
    const chartData: ChartDataPoint[] = characters.map(
      (character: Character) => ({
        name: character.name,
        y: character.films ? character.films.length : 0,
        custom: {
          films: character.films || [],
        },
      })
    );

    // Handle case where all characters have zero films
    const totalFilms = chartData.reduce((acc, point) => acc + point.y, 0);
    if (totalFilms === 0) {
      setOptions(null);
      return;
    }

    // Configure Highcharts options
    const chartOptions: Highcharts.Options = {
      chart: {
        type: 'pie',
      },
      title: {
        text: 'Number of Films per Character',
      },
      tooltip: {
        formatter: function (this: Highcharts.TooltipFormatterContextObject) {
          const point = this.point as Highcharts.Point & {
            custom?: { films: string[] };
          };
          const filmsList = point.custom?.films?.length
            ? point.custom.films.join(', ')
            : 'No Films';
          return `<b>${point.name}</b>: ${this.percentage?.toFixed(2)}%<br/>Films: ${filmsList}`;
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '{point.name}: {point.y}',
          },
        },
      },
      series: [
        {
          type: 'pie',
          name: 'Films',
          data: chartData,
        },
      ],
    };

    setOptions(chartOptions);
  }, [characters]);

  /**
   * Exports the chart data to an XLSX file.
   */
  const exportToExcel = () => {
    const data = characters.map((character: Character) => ({
      Name: character.name,
      'Number of Films': character.films ? character.films.length : 0,
      Films: character.films ? character.films.join(', ') : 'No Films',
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Characters');

    XLSX.writeFile(workbook, 'characters_films.xlsx');
  };

  if (!options) {
    return <div className="mt-8">No data available for the pie chart.</div>;
  }

  return (
    <div className="mt-8">
      <HighchartsReact highcharts={Highcharts} options={options} />
      <button
        onClick={exportToExcel}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Export to Excel
      </button>
    </div>
  );
};

export default PieChart;
