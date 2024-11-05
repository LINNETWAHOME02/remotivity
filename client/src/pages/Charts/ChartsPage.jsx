import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2'; // This helps draw the chart
import axios from 'axios';

// This is like the brain that knows how to draw chart
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const ChartsPage = () => {
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

  useEffect(() => {
    const fetchTimeLogs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/task/tasks', { withCredentials: true });
        const tasks = response.data.tasks;

        // Process tasks data to generate chart labels and data
        const labels = tasks.map((task) => new Date(task.startTime).toLocaleDateString());
        const data = tasks.map((task) => {
          const startTime = new Date(task.startTime);
          const endTime = new Date(task.endTime);
          const hours = (endTime - startTime) / (1000 * 60 * 60); 
          return hours > 0 ? hours : 0;
        });

        // Update chart data state
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
      } catch (error) {
        console.error('Error fetching time logs:', error);
      }
    };

    fetchTimeLogs();
  }, []);

  return (
    <div style={{ width: '70%', margin: 'auto' }}>
      <h2>Productivity Chart</h2>
      <Bar
        data={chartData}
        options={{
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
        }}
      />
    </div>
  );
};

export default ChartsPage;
