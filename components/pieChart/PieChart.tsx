import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useAppSelector } from '../../store/hooks';
import { Character } from '../../types/character';
import * as XLSX from 'xlsx';

const PieChart: React.FC = () => {
  const { characters } = useAppSelector((state) => state.characters);

  // Memoize chart data to prevent unnecessary recalculations
  const chartData = useMemo(() => {
    return characters.map((character: Character) => ({
      name: character.name,
      y: character.films ? character.films.length : 0,
      films: character.films || [],
    }));
  }, [characters]);

  const totalFilms = useMemo(() => {
    return chartData.reduce((acc, point) => acc + point.y, 0);
  }, [chartData]);

  const options: Highcharts.Options = useMemo(() => {
    if (totalFilms === 0) {
      return {};
    }

    return {
      chart: {
        type: 'pie',
      },
      title: {
        text: 'Number of Films per Character',
      },
      tooltip: {
        pointFormatter: function () {
          const point = this as Highcharts.Point & { films: string[] };
          const filmsList = point.films.length
            ? point.films.join(', ')
            : 'No Films';
          return `<b>${point.name}</b>: ${Highcharts.numberFormat(this.percentage!, 2)}%<br/>Films: ${filmsList}`;
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
  }, [chartData, totalFilms]);

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

  if (totalFilms === 0 || !options) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-center text-gray-500">
          No film data available to display the pie chart.
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-full flex flex-col">
      {/* Export Button */}
      <div className="flex justify-end">
        <button
          onClick={exportToExcel}
          disabled={totalFilms === 0}
          className={`mt-0 mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
            totalFilms === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-disabled={totalFilms === 0}
        >
          Export to Excel
        </button>
      </div>

      {/* Pie Chart */}
      <div className="flex-1">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
};

export default PieChart;
