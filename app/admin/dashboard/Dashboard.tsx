'use client';
import { useState, useEffect } from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
import useSWR from 'swr';
import { motion } from 'framer-motion'; // For interactive animations
import {
  FiTrendingUp, FiUsers, FiLayers, FiActivity,
  FiDownload, FiCalendar
} from 'react-icons/fi';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Filler, Legend, BarElement, ArcElement,
} from 'chart.js';
import Loading from '@/components/Loading';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Filler, Legend, BarElement, ArcElement
);

const Dashboard = () => {
  const { data: summary, error } = useSWR(`/api/projects/summary`);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  if (error) return <div className="p-10 text-red-500 font-medium">Failed to fetch 2026 data.</div>;
  if (!summary) return <Loading />;

  const getOptions = (title: string) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const, labels: { usePointStyle: true, padding: 20, color: isDarkMode ? '#94a3b8' : '#64748b' } },
      tooltip: { backgroundColor: '#1e293b', padding: 12, borderRadius: 8 },
    },
    scales: {
      y: { grid: { color: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }, border: { display: false } },
      x: { grid: { display: false } }
    }
  });

  const usersData = {
    labels: summary.usersData.map((x: any) => x._id),
    datasets: [{
      fill: true,
      label: 'Growth',
      data: summary.usersData.map((x: any) => x.totalUsers),
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#6366f1',
    }],
  };

  return (
    <div className=" transition-colors duration-500">

      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Executive <span className="text-indigo-600">Overview</span>
          </h1>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mt-1">
            <FiCalendar className="text-indigo-500" />
            <span className="text-sm font-medium">Fiscal Year {new Date().getFullYear()} • Updated Live</span>
          </div>
        </motion.div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold shadow-sm hover:shadow-md transition-all">
            <FiDownload /> Export
          </button>
          <button className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all">
            New Project
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Projects', value: summary.projectsCount, icon: <FiLayers />, color: 'indigo', trend: '+12%' },
          { label: 'Users', value: summary.usersCount, icon: <FiUsers />, color: 'purple', trend: '+18%' },
          { label: 'Active', value: '1,204', icon: <FiActivity />, color: 'emerald', trend: '+5%' },
          { label: 'Revenue', value: '$42.5k', icon: <FiTrendingUp />, color: 'pink', trend: '+24%' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative overflow-hidden p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:border-indigo-500/50 transition-colors group"
          >
            <div className={`p-3 rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-500/10 text-${stat.color}-600 dark:text-${stat.color}-400 w-fit mb-4`}>
              {stat.icon}
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white my-1">{stat.value}</h3>
              <span className="text-xs font-bold text-emerald-500">{stat.trend}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-8 p-8 rounded-4xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">User Acquisition</h3>
            <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-xs font-bold px-3 py-1 text-slate-600 outline-none">
              <option>Last 12 Months</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-87.5">
            <Line data={usersData} options={getOptions('Growth')} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-4 p-8 rounded-4xl bg-indigo-600 dark:bg-indigo-900 shadow-2xl shadow-indigo-500/20 text-white"
        >
          <h3 className="text-lg font-bold mb-6">Distribution</h3>
          <div className="h-70">
            <Doughnut
              data={{
                labels: summary.projectsData.map((x: any) => x._id),
                datasets: [{
                  label: 'Projects',
                  data: summary.projectsData.map((x: any) => x.totalProjects),
                  backgroundColor: ['#6366f1', '#a855f7', '#ec4899', '#f97316', '#10b981', '#3b82f6'],
                  borderColor: 'transparent',
                  hoverOffset: 15,
                }],
              }}
              options={{
                ...getOptions(''),
                cutout: '75%',
                plugins: {
                  legend: {
                    display: true,
                    position: 'bottom',
                    labels: { color: isDarkMode ? '#fff' : '#1e293b', usePointStyle: true }
                  }
                }
              }}
            />

          </div>
          <div className="mt-6 p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
            <p className="text-xs font-medium opacity-80">Insight</p>
            <p className="text-sm font-bold">Category "Development" is up 14% this month.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
