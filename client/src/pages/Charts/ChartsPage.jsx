// Import necessary modules from React and Chart.js libraries
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

// Register the components we need from Chart.js
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const ChartsPage = ({ timelogData }) => {
  // State to store the chart data
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Productivity Hours',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  });

  // Effect hook to process the timelog data when it changes
  useEffect(() => {
    // Process the timelogData to generate labels and productivity hours
    const labels = timelogData.map((log) => log.date);
    const data = timelogData.map((log) => {
      const startTime = new Date(`1970-01-01T${log.startTime}:00`);
      const endTime = new Date(`1970-01-01T${log.endTime}:00`);
      return (endTime - startTime) / (1000 * 60 * 60); // Calculate hours
    }); 

    // Update the chart data state
    setChartData({
      labels: labels,
      datasets: [
        {
          label: 'Productivity Hours',
          data: data,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    });
  }, [timelogData]);

  return (
    <div style={{ width: '70%', margin: 'auto' }}>
      <h2>Productivity Chart</h2>
      {/* Render the bar chart with the chartData state */}
      <Bar data={chartData} options={{
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'User Productivity Over Time',
          },
        },
      }} />
    </div>
  );
};

export default ChartsPage;