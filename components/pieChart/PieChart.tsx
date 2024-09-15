import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useAppSelector } from '../../store/hooks';
import { Character } from '../../types/character';
import * as XLSX from 'xlsx';

/**
 * PieChart Component
 * - Displays a pie chart representing the number of films each character participates in.
 * - Updates when the character list in the Redux store changes.
 * - Allows exporting the chart data to an XLSX file.
 */
const PieChart: React.FC = () => {
  const { characters } = useAppSelector((state) => state.characters);
  const [options, setOptions] = useState<Highcharts.Options>({});

  useEffect(() => {
    if (characters.length === 0) {
      setOptions({});
      return;
    }

    // Prepare data for the pie chart
    const chartData = characters.map((character: Character) => ({
      name: character.name,
      y: character.films.length,
      custom: {
        films: character.films,
      },
    }));

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
          const point = this.point;
          const films = (point.options as any).custom?.films as string[];
          const filmsList =
            films && films.length > 0 ? films.join(', ') : 'No Films';
          return `<b>${point.name}</b>: ${this.percentage.toFixed(
            2
          )}%<br/>Films: ${filmsList}`;
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
      'Number of Films': character.films.length,
      Films: character.films.join(', '),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Characters');

    XLSX.writeFile(workbook, 'characters_films.xlsx');
  };

  if (characters.length === 0) {
    return <div>No characters to display.</div>;
  }

  return (
    <div>
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
