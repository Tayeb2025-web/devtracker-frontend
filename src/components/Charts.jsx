import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#21262d',
      titleColor: '#e6edf3',
      bodyColor: '#8b949e',
      borderColor: '#30363d',
      borderWidth: 1,
      cornerRadius: 8,
      padding: 12,
    },
  },
  scales: {
    x: {
      grid: { color: 'rgba(48, 54, 61, 0.5)' },
      ticks: { color: '#8b949e', font: { size: 11 } },
    },
    y: {
      grid: { color: 'rgba(48, 54, 61, 0.5)' },
      ticks: { color: '#8b949e', font: { size: 11 } },
      beginAtZero: true,
    },
  },
};

export function LineChart({ data, label = 'Hours' }) {
  const chartData = {
    labels: data.map(d => d.label),
    datasets: [{
      label,
      data: data.map(d => d.hours),
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointHoverRadius: 6,
    }],
  };

  return (
    <div className="h-64">
      <Line data={chartData} options={chartDefaults} />
    </div>
  );
}

export function BarChartComponent({ data, label = 'Hours' }) {
  const chartData = {
    labels: data.map(d => d.label),
    datasets: [{
      label,
      data: data.map(d => d.hours),
      backgroundColor: 'rgba(59, 130, 246, 0.7)',
      borderRadius: 6,
      borderSkipped: false,
    }],
  };

  return (
    <div className="h-64">
      <Bar data={chartData} options={chartDefaults} />
    </div>
  );
}

export function PieChartComponent({ data }) {
  const chartData = {
    labels: data.map(d => d.name),
    datasets: [{
      data: data.map(d => parseFloat(d.hours)),
      backgroundColor: data.map(d => d.color || '#3B82F6'),
      borderWidth: 0,
    }],
  };

  const options = {
    ...chartDefaults,
    plugins: {
      ...chartDefaults.plugins,
      legend: {
        display: true,
        position: 'right',
        labels: { color: '#8b949e', font: { size: 11 }, padding: 12, usePointStyle: true },
      },
    },
    scales: {},
  };

  return (
    <div className="h-64">
      <Pie data={chartData} options={options} />
    </div>
  );
}

export function GoalConfetti({ show }) {
  const fired = useRef(false);

  useEffect(() => {
    if (show && !fired.current) {
      fired.current = true;
      import('canvas-confetti').then(({ default: confetti }) => {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        setTimeout(() => confetti({ particleCount: 100, spread: 100, origin: { y: 0.5 } }), 300);
      });
    }
    if (!show) fired.current = false;
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="glass rounded-2xl px-8 py-6 text-center animate-fade-in">
        <p className="text-4xl mb-2">⭐⭐⭐⭐⭐</p>
        <h2 className="text-2xl font-bold text-accent">Goal Completed!</h2>
        <p className="text-text-muted mt-1">Amazing work today! Keep it up!</p>
      </div>
    </div>
  );
}
