'use client';

import { useState, useEffect } from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import {
  FiTrendingUp,
  FiUsers,
  FiLayers,
  FiActivity,
  FiDownload,
  FiCalendar,
} from 'react-icons/fi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  BarElement,
  ArcElement,
} from 'chart.js';
import Loading from '@/components/Loading';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  BarElement,
  ArcElement,
);

const Dashboard = () => {
  const { data: summary, error } = useSWR(`/api/projects/summary`);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center p-16 text-destructive font-medium">
        Failed to fetch dashboard data.
      </div>
    );
  }

  if (!summary) return <Loading />;

  const chartTextColor = isDarkMode ? '#a6a2c0' : '#6b6880';
  const gridColor = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

  const getOptions = () => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          color: chartTextColor,
        },
      },
      tooltip: {
        backgroundColor: isDarkMode ? '#1b1930' : '#16152a',
        padding: 12,
        borderRadius: 10,
        titleColor: '#fff',
        bodyColor: '#e7e5f1',
      },
    },
    scales: {
      y: {
        grid: { color: gridColor },
        border: { display: false },
        ticks: { color: chartTextColor },
      },
      x: {
        grid: { display: false },
        ticks: { color: chartTextColor },
      },
    },
  });

  const usersData = {
    labels: summary.usersData.map((x: any) => x._id),
    datasets: [
      {
        fill: true,
        label: 'Growth',
        data: summary.usersData.map((x: any) => x.totalUsers),
        borderColor: '#7c3aed',
        backgroundColor: 'rgba(124, 58, 237, 0.12)',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#7c3aed',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  const kpiCards = [
    {
      label: 'Projects',
      value: summary.projectsCount,
      icon: <FiLayers size={20} />,
      trend: '+12%',
    },
    {
      label: 'Users',
      value: summary.usersCount,
      icon: <FiUsers size={20} />,
      trend: '+18%',
    },
    {
      label: 'Active',
      value: '1,204',
      icon: <FiActivity size={20} />,
      trend: '+5%',
    },
    {
      label: 'Revenue',
      value: '$42.5k',
      icon: <FiTrendingUp size={20} />,
      trend: '+24%',
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-bold tracking-tight">
            Executive <span className="text-primary">Overview</span>
          </h1>
          <div className="mt-1.5 flex items-center gap-2 text-sm text-muted-foreground">
            <FiCalendar className="text-primary" />
            <span>Fiscal Year {new Date().getFullYear()} • Updated Live</span>
          </div>
        </motion.div>

        <div className="flex gap-3">
          <button className="btn btn-outline gap-2 rounded-xl px-4 py-2.5 text-sm">
            <FiDownload size={16} />
            Export
          </button>
          <button className="btn btn-primary gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold">
            New Project
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="card-hover group p-6"
          >
            <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
              {stat.icon}
            </div>

            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              {stat.label}
            </p>

            <div className="mt-1 flex items-baseline gap-2">
              <h3 className="text-2xl font-bold tracking-tight">
                {stat.value}
              </h3>
              <span className="text-xs font-semibold text-success">
                {stat.trend}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Line Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card lg:col-span-8 p-6 sm:p-8"
        >
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold">User Acquisition</h3>
            <select className="rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20">
              <option>Last 12 Months</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-80">
            <Line data={usersData} options={getOptions()} />
          </div>
        </motion.div>

        {/* Doughnut Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="card relative overflow-hidden lg:col-span-4 p-6 sm:p-8"
        >
          {/* Soft accent glow */}
          <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-primary/10 blur-3xl" />

          <h3 className="mb-6 text-lg font-semibold">Distribution</h3>

          <div className="h-64">
            <Doughnut
              data={{
                labels: summary.projectsData.map((x: any) => x._id),
                datasets: [
                  {
                    label: 'Projects',
                    data: summary.projectsData.map((x: any) => x.totalProjects),
                    backgroundColor: [
                      '#7c3aed',
                      '#a78bfa',
                      '#06b6d4',
                      '#f59e0b',
                      '#10b981',
                      '#3b82f6',
                    ],
                    borderColor: 'transparent',
                    hoverOffset: 12,
                  },
                ],
              }}
              options={{
                ...getOptions(),
                cutout: '72%',
                plugins: {
                  legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                      color: chartTextColor,
                      usePointStyle: true,
                      padding: 16,
                    },
                  },
                },
              }}
            />
          </div>

          <div className="mt-6 rounded-2xl border border-border/60 bg-muted/40 p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Insight
            </p>
            <p className="mt-1 text-sm font-semibold">
              Category &ldquo;Development&rdquo; is up 14% this month.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
